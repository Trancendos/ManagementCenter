import { useMemo, useState } from "react";
import { Award, CheckCircle2, Circle, Printer, RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceBase, type McConfig } from "../lib/config.ts";
import type { InfinitySession } from "../lib/infinity/session.ts";
import { STAGE_ORDER, StageGatesClient, type Deliverable, type GateDecisionRecord } from "../lib/services/stage-gates.ts";
import { useAsync } from "../lib/use-async.ts";

interface Props {
  config: McConfig;
  session: InfinitySession;
}

const when = (epochSeconds: number) => new Date(epochSeconds * 1000).toLocaleString();

/** Project Management > Gates: projects by stage, gate criteria, and sign-offs. */
export function ProjectGates({ config, session }: Props) {
  const client = useMemo(() => new StageGatesClient(serviceBase("stage-gates", config), session.accessToken), [config, session.accessToken]);
  const list = useAsync(() => client.listDeliverables(), [client]);
  const [selected, setSelected] = useState<string | null>(null);
  // One Refresh reloads the stage lanes and the open project's criteria and certificates together.
  const [refreshed, setRefreshed] = useState(0);
  const refresh = () => {
    list.reload();
    setRefreshed((n) => n + 1);
  };

  const byStage = useMemo(() => {
    const groups = new Map(STAGE_ORDER.map((s) => [s, [] as Deliverable[]]));
    for (const d of list.data ?? []) groups.get(d.stage)?.push(d);
    return groups;
  }, [list.data]);

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Project Management · Gates</h1>
          <p className="text-sm text-muted">From TownHall Stage Gates. Each project passes concept → closed; each passed gate is signed off.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={refresh} aria-label="Refresh projects"><RefreshCw aria-hidden /> Refresh</Button>
      </header>

      {list.error && <p role="alert" className="text-sm text-danger">{list.error}</p>}
      {list.loading && <p className="text-sm text-muted">Loading projects…</p>}

      {!list.loading && !list.error && (
        <div className="grid auto-cols-[minmax(180px,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2" role="list" aria-label="Stages">
          {STAGE_ORDER.map((stage) => (
            <section key={stage} role="listitem" aria-label={`${stage} stage`} className="flex flex-col gap-2 rounded-md border border-border bg-surface p-2">
              <h2 className="flex items-center justify-between px-1 text-xs font-medium uppercase tracking-wide text-muted">
                {stage} <span>{byStage.get(stage)?.length ?? 0}</span>
              </h2>
              {(byStage.get(stage) ?? []).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelected(d.id)}
                  aria-pressed={selected === d.id}
                  className="rounded-sm border border-border bg-elevated p-2 text-left text-sm hover:border-accent/50 aria-pressed:border-accent"
                >
                  <span className="block font-medium">{d.title}</span>
                  <span className="block text-xs text-muted">{d.location} · {d.kind}</span>
                </button>
              ))}
            </section>
          ))}
        </div>
      )}

      {selected && <DeliverableDetail key={selected} client={client} id={selected} refreshed={refreshed} />}
    </div>
  );
}

function DeliverableDetail({ client, id, refreshed }: { client: StageGatesClient; id: string; refreshed: number }) {
  const detail = useAsync(() => Promise.all([client.getDeliverable(id), client.history(id)]), [client, id, refreshed]);
  if (detail.error) return <p role="alert" className="text-sm text-danger">{detail.error}</p>;
  if (!detail.data) return <p className="text-sm text-muted">Loading…</p>;
  const [deliverable, history] = detail.data;
  const { gate } = deliverable;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{deliverable.title}</CardTitle>
          <CardDesc>
            Location <strong>{deliverable.location}</strong> · requested by {deliverable.requested_by} · ID <code className="font-mono">{deliverable.id}</code>
          </CardDesc>
        </CardHeader>
        <p className="mb-2 flex items-center gap-2 text-sm">
          Current gate: <Badge tone="accent">{gate.stage}</Badge>
          {gate.can_advance ? <Badge tone="ok">ready to advance</Badge> : <Badge tone="warn">{gate.unmet.length} unmet</Badge>}
        </p>
        <ul className="flex flex-col gap-1" aria-label="Gate criteria">
          {gate.criteria.map((c) => (
            <li key={c.criterion.id} className="flex items-start gap-2 text-sm">
              {c.satisfied ? <CheckCircle2 className="mt-0.5 size-4 text-ok" aria-label="met" /> : c.waived ? <ShieldAlert className="mt-0.5 size-4 text-warn" aria-label="waived" /> : <Circle className="mt-0.5 size-4 text-subtle" aria-label="not met" />}
              <span>
                <span className="font-mono text-xs text-muted">{c.criterion.id}</span> {c.criterion.description}
                {!c.criterion.mandatory && <span className="text-xs text-subtle"> (optional)</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="size-4" aria-hidden /> Gate sign-offs</CardTitle>
          <CardDesc>One certificate per passed gate, from the Stage Gates ledger. Final sign-off is the gate into “closed”.</CardDesc>
        </CardHeader>
        {history.length === 0 ? <p className="text-sm text-muted">No gates signed off yet.</p> : <Certificates deliverable={deliverable} history={history} />}
      </Card>
    </div>
  );
}

function Certificates({ deliverable, history }: { deliverable: Deliverable; history: GateDecisionRecord[] }) {
  return (
    <div className="flex flex-col gap-3">
      {history.map((h) => (
        <article key={h.id} className="rounded-md border border-border p-3" aria-label={`Sign-off for ${h.stage}`}>
          <p className="text-xs uppercase tracking-wide text-muted">Gate sign-off certificate</p>
          <p className="font-display text-base font-semibold">{deliverable.title} · {h.stage}</p>
          <p className="text-sm">
            {h.decision === "passed" ? "Passed" : "Passed with waivers"} · approved by {h.approver} · {when(h.decided_at)}
          </p>
          {h.waived_criteria.length > 0 && <p className="text-xs text-warn">Waived: {h.waived_criteria.join(", ")}</p>}
          <p className="font-mono text-[11px] text-subtle">Record {h.id}</p>
        </article>
      ))}
      <Button variant="ghost" size="sm" className="no-print w-fit" onClick={() => window.print()}><Printer aria-hidden /> Print certificates</Button>
    </div>
  );
}
