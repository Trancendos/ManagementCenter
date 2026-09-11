import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { PILLAR_LABEL, REPO, WORKERS, type Pillar } from "@/lib/data/catalog";

export const Route = createFileRoute("/architecture")({ component: Architecture });

const ORDER: Pillar[] = [
  "ingress",
  "security",
  "model",
  "creative",
  "commercial",
  "knowledge",
  "wellbeing",
  "devops",
  "infra",
];

function Architecture() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Architecture</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          A constellation that outgrew its map
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          README: {REPO.workersClaimed} workers. Tree: {WORKERS.length} catalogued services
          (plus a handful of untagged dirs). Treat the 35-realm Universe Bible as product
          vision. Ship the host first.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Target data plane</CardTitle>
          <CardDesc>
            LiteFS or single-node Postgres instead of SQLite-per-worker. SOPS+age instead of a
            unaudited Infinity Void. VictoriaMetrics instead of a hungry Prometheus.
          </CardDesc>
        </CardHeader>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Edge UI", "React + optional WASM llama.cpp for 3B local preview"],
            ["Ingress", "Traefik · contract-tested routes · no legacy CF default"],
            ["Workers", "Stateless FastAPI · topology tags · healthz"],
            ["State", "LiteFS / Postgres · MinIO snapshots · SOPS+age secrets"],
          ].map(([t, b]) => (
            <li key={t} className="rounded-md bg-elevated p-3">
              <p className="font-medium">{t}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">{b}</p>
            </li>
          ))}
        </ol>
      </Card>

      {ORDER.map((pillar) => {
        const list = WORKERS.filter((w) => w.pillar === pillar);
        return (
          <section key={pillar}>
            <h2 className="mb-3 font-display text-lg font-semibold">
              {PILLAR_LABEL[pillar]}
              <span className="ml-2 font-sans text-sm font-normal text-muted">{list.length}</span>
            </h2>
            <ul className="flex flex-wrap gap-2">
              {list.map((w) => (
                <li
                  key={w.name}
                  className="rounded-md border border-border bg-surface px-3 py-2"
                  title={w.note}
                >
                  <p className="font-mono text-xs">{w.name}</p>
                  <div className="mt-1 flex gap-1">
                    <Badge tone="muted">{w.zone}</Badge>
                    {w.sensitive ? <Badge tone="warn">sens</Badge> : null}
                    {w.note ? <Badge tone="danger">gap</Badge> : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
