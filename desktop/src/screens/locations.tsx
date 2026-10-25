import { useMemo, useState, type FormEvent } from "react";
import { Boxes, Network, Search, ShieldAlert, FlagTriangleRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceBase, type McConfig } from "../lib/config.ts";
import type { InfinitySession } from "../lib/infinity/session.ts";
import { CmdbClient, networkView, type CmdbItem } from "../lib/services/cmdb.ts";
import { StageGatesClient } from "../lib/services/stage-gates.ts";
import { useAsync } from "../lib/use-async.ts";

interface Props {
  config: McConfig;
  session: InfinitySession;
}

/** Where each Location links out to, per Drew's 2026-10-25 scope. None of these services exist yet. */
const PLANNED_LINKS: [string, string][] = [
  ["Dependencies", "The Lab"],
  ["Associations and permissions", "Infinity-One"],
  ["Integrations and connections", "API Marketplace"],
  ["Skills", "The Spark"],
  ["Artifacts", "Artifactory"],
  ["Completed projects", "The Workshop"],
  ["Virtual and sandpit environments", "The IceBox"],
];

/** Service Management Center > Locations: the CMDB view of every Location. */
export function Locations({ config, session }: Props) {
  const cmdb = useMemo(() => new CmdbClient(serviceBase("cmdb", config)), [config]);
  const [signedIn, setSignedIn] = useState(false);
  const cmdbSession = useAsync(() => cmdb.session(), [cmdb, signedIn]);

  if (cmdbSession.loading) return <p className="text-sm text-muted">Checking the CMDB session…</p>;
  if (!cmdbSession.data) return <CmdbLogin cmdb={cmdb} origin={config.cmdbUrl} onDone={() => setSignedIn((s) => !s)} hint={cmdbSession.error} />;
  return <LocationBrowser cmdb={cmdb} config={config} session={session} />;
}

function CmdbLogin({ cmdb, origin, onDone, hint }: { cmdb: CmdbClient; origin: string; onDone: () => void; hint: string | null }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await cmdb.login(username, password, origin);
      setPassword("");
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>CMDB account</CardTitle>
        <CardDesc>
          The CMDB does not accept Infinity sign-in yet, so it needs its own viewer account for this session. The password
          is sent once and never stored.
        </CardDesc>
      </CardHeader>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" className="h-9 rounded-md border border-border bg-elevated px-2 text-fg" />
        </label>
        <label className="flex flex-col gap-1 text-sm">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="h-9 rounded-md border border-border bg-elevated px-2 text-fg" />
        </label>
        <Button type="submit" disabled={!username || !password}>Sign in to the CMDB</Button>
        <p role="alert" className="text-sm text-danger">{error ?? (hint && !hint.includes("401") && !hint.toLowerCase().includes("sign") ? hint : "")}</p>
      </form>
    </Card>
  );
}

function LocationBrowser({ cmdb, config, session }: { cmdb: CmdbClient; config: McConfig; session: InfinitySession }) {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");
  const [selected, setSelected] = useState<CmdbItem | null>(null);
  const list = useAsync(() => cmdb.locations(applied), [cmdb, applied]);

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
      <section aria-label="Locations" className="flex flex-col gap-3">
        <header>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight"><Boxes className="size-5" aria-hidden /> Locations</h1>
          <p className="text-sm text-muted">CMDB items of kind “location”. {list.data ? `${list.data.total} found.` : ""}</p>
        </header>
        <form role="search" onSubmit={(e) => { e.preventDefault(); setApplied(query); setSelected(null); }} className="flex gap-2">
          <label htmlFor="loc-q" className="sr-only">Search locations</label>
          <input id="loc-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, owner, tag" className="h-9 flex-1 rounded-md border border-border bg-elevated px-2 text-sm text-fg" />
          <Button type="submit" size="sm" variant="secondary" aria-label="Search"><Search aria-hidden /></Button>
        </form>
        {list.error && <p role="alert" className="text-sm text-danger">{list.error}</p>}
        <ul className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto">
          {(list.data?.data ?? []).map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => setSelected(item)} aria-pressed={selected?.id === item.id}
                className="w-full rounded-sm border border-border bg-surface p-2 text-left text-sm hover:border-accent/50 aria-pressed:border-accent">
                <span className="block font-medium">{item.name}</span>
                <span className="block text-xs text-muted">{item.environment} · {item.lifecycle} · {item.criticality}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      {selected && (list.data?.data ?? []).some((i) => i.id === selected.id) ? <LocationRecord key={selected.id} cmdb={cmdb} item={selected} config={config} session={session} /> : (
        <p className="text-sm text-muted">Choose a Location to see its network, findings and projects.</p>
      )}
    </div>
  );
}

function LocationRecord({ cmdb, item, config, session }: { cmdb: CmdbClient; item: CmdbItem; config: McConfig; session: InfinitySession }) {
  const links = useAsync(() => Promise.all([cmdb.relationships(item.id), cmdb.findings(item.id)]), [cmdb, item.id]);
  const gates = useMemo(() => new StageGatesClient(serviceBase("stage-gates", config), session.accessToken), [config, session.accessToken]);
  // Open question D-05: match on location name until deliverables carry a cmdb_id.
  const projects = useAsync(async () => (await gates.listDeliverables()).filter((d) => d.location.toLowerCase() === item.name.toLowerCase()), [gates, item.name]);
  const network = links.data ? networkView(item.id, links.data[0].data) : [];
  const findings = links.data?.[1].data ?? [];
  const peerIds = [...new Set(network.map((n) => n.peerId))].join(",");
  const peers = useAsync(async () => {
    const names: Record<string, string> = {};
    await Promise.all(peerIds.split(",").filter(Boolean).map(async (id) => {
      names[id] = (await cmdb.item(id).catch(() => null))?.name ?? id.slice(0, 8);
    }));
    return names;
  }, [cmdb, peerIds]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDesc>{item.description || "No description recorded."}</CardDesc>
        </CardHeader>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-4">
          {[["Owner", item.owner], ["Team", item.team], ["Environment", item.environment], ["Lifecycle", item.lifecycle]].map(([k, v]) => (
            <div key={k}><dt className="text-xs text-muted">{k}</dt><dd>{v || "—"}</dd></div>
          ))}
        </dl>
      </Card>

      {links.error && <p role="alert" className="text-sm text-danger">{links.error}</p>}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Network className="size-4" aria-hidden /> Network</CardTitle>
          <CardDesc>CMDB relationships that carry a protocol or port. The Network Topology diagram will draw these.</CardDesc>
        </CardHeader>
        {network.length === 0 ? <p className="text-sm text-muted">No ports or protocols recorded for this Location.</p> : (
          <table className="w-full text-sm">
            <caption className="sr-only">Network links for {item.name}</caption>
            <thead className="text-left text-xs text-muted"><tr><th className="py-1">Direction</th><th>Protocol</th><th>Port</th><th>Kind</th><th>Peer</th></tr></thead>
            <tbody>
              {network.map((n, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-1">{n.direction}</td><td>{n.protocol}</td><td className="font-mono">{n.port ?? "—"}</td><td>{n.kind}</td>
                  <td title={n.peerId}>{peers.data?.[n.peerId] ?? n.peerId.slice(0, 8)}{n.label ? <span className="text-xs text-muted"> · {n.label}</span> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="size-4" aria-hidden /> Vulnerabilities</CardTitle>
            <CardDesc>CMDB findings today; The Cryptex later.</CardDesc>
          </CardHeader>
          {findings.length === 0 ? <p className="text-sm text-muted">No findings.</p> : (
            <ul className="flex flex-col gap-1 text-sm">
              {findings.map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <Badge tone={f.severity === "critical" || f.severity === "high" ? "danger" : f.severity === "medium" ? "warn" : "muted"}>{f.severity}</Badge>
                  <span className="flex-1">{f.title}</span><span className="text-xs text-muted">{f.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlagTriangleRight className="size-4" aria-hidden /> Projects</CardTitle>
            <CardDesc>Stage Gates deliverables for this Location (matched by name).</CardDesc>
          </CardHeader>
          {projects.error ? <p className="text-sm text-danger">{projects.error}</p> : (projects.data ?? []).length === 0 ? <p className="text-sm text-muted">No projects recorded.</p> : (
            <ul className="flex flex-col gap-1 text-sm">
              {(projects.data ?? []).map((d) => (
                <li key={d.id} className="flex items-center gap-2"><Badge tone="accent">{d.stage}</Badge><span>{d.title}</span></li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Link2 className="size-4" aria-hidden /> Linked locations</CardTitle>
          <CardDesc>Planned links. Each appears here once that location exposes an API.</CardDesc>
        </CardHeader>
        <ul className="grid gap-1 text-sm md:grid-cols-2">
          {PLANNED_LINKS.map(([what, where]) => (
            <li key={what} className="flex justify-between gap-2 border-b border-border py-1"><span>{what}</span><span className="text-muted">{where} · planned</span></li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
