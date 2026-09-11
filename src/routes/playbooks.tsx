import { createFileRoute } from "@tanstack/react-router";
import { CopyBlock } from "@/components/copy-block";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { ANTIBODIES } from "@/lib/data/antibodies";
import { PLAYBOOKS } from "@/lib/data/playbooks";
import { useImmune } from "@/lib/store";

export const Route = createFileRoute("/playbooks")({ component: Playbooks });

function Playbooks() {
  const dispatched = useImmune((s) => s.dispatched);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Playbooks</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Copy into the repo. Do not rent a vendor.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Each artifact is $0, self-hosted, and meant to land as a file in Trancendos/Tranc3.
          Dispatching the matching antibody marks it as in-memory; you still paste the YAML.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>How to apply</CardTitle>
          <CardDesc>
            Phase 0 is mechanical: autofix workflow, asset manifest, freshness formula, path
            traversal sketch, canary steps. Do not start Hybrid control-plane work while main is
            red.
          </CardDesc>
        </CardHeader>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
          <li>Paste pr-autofix.yml and push to a branch. Confirm it commits lint back.</li>
          <li>Mass-fix ruff on main once. Rebase the blocked PR queue.</li>
          <li>Merge #1177 then #1175. Batch Aikido. Close cosine-similarity duplicates.</li>
          <li>Contract-test infinity-ai before touching Traefik.</li>
        </ol>
      </Card>

      <div className="flex flex-col gap-4">
        {PLAYBOOKS.map((p) => {
          const ab = ANTIBODIES.find((a) => a.playbook === p.id);
          const on = ab ? dispatched.includes(ab.id) : false;
          return (
            <div key={p.id} className="relative">
              {ab ? (
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone={on ? "ok" : "muted"}>
                    {ab.name} {on ? "in memory" : "not dispatched"}
                  </Badge>
                </div>
              ) : null}
              <CopyBlock
                title={p.title}
                filename={p.filename}
                code={p.code}
                summary={p.summary}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
