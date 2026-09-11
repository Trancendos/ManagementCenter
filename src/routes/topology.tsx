import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { PILLAR_LABEL, WORKERS, type WorkerZone } from "@/lib/data/catalog";
import { useImmune, type Topology } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/topology")({ component: TopologyPage });

const MODES: { id: Topology; title: string; ready: string; blurb: string }[] = [
  {
    id: "local",
    title: "Local only",
    ready: "~60%",
    blurb:
      "Single host, zero egress after image pull. Needs GGUF, offline TOTP, Shamir vault backup, bounded Loki retention, local OCI mirror.",
  },
  {
    id: "hybrid",
    title: "Hybrid",
    ready: "~35%",
    blurb:
      "Core stays local. Burst is tagged. Without a sovereignty scheduler this collapses into cloud-default with local leftovers.",
  },
  {
    id: "cloud",
    title: "Cloud only",
    ready: "~55%",
    blurb:
      "Still vendor-agnostic — no RDS/S3/Lambda. Needs multi-node, MinIO, distributed secrets, automated DR, spend-guard.",
  },
];

function allowed(zone: WorkerZone, topology: Topology): boolean {
  if (topology === "local") return true;
  if (topology === "cloud") return zone !== "local-only";
  return true;
}

function TopologyPage() {
  const topology = useImmune((s) => s.topology);
  const setTopology = useImmune((s) => s.setTopology);

  const violations = WORKERS.filter(
    (w) => topology === "hybrid" && w.sensitive && w.zone === "cloud-burst",
  );
  const blocked = WORKERS.filter((w) => !allowed(w.zone, topology));

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Topology orchestrator</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          One click. Three sovereignties.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Local first. Hybrid only with tags and a mesh. Cloud only still means self-hosted
          containers — never a managed AWS/Azure brain.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setTopology(m.id)}
            className={cn(
              "rounded-xl border p-5 text-left transition-colors",
              topology === m.id ? "border-accent bg-accent/10" : "border-border bg-surface",
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold">{m.title}</p>
              <Badge tone={topology === m.id ? "accent" : "muted"}>{m.ready}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{m.blurb}</p>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheduler view</CardTitle>
          <CardDesc>
            {topology === "hybrid"
              ? `${violations.length} sensitive workers are tagged cloud-burst — ConfigGuard must block these.`
              : topology === "cloud"
                ? `${blocked.length} local-only workers would refuse to schedule. Keep vaults off rented disks or wrap them in sealed snapshots.`
                : "All workers may run. Watch RAM: Prometheus+Grafana+Loki will starve the model on a hobby box."}
          </CardDesc>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-medium">Worker</th>
                <th className="py-2 pr-3 font-medium">Pillar</th>
                <th className="py-2 pr-3 font-medium">Zone</th>
                <th className="py-2 font-medium">Decision</th>
              </tr>
            </thead>
            <tbody>
              {WORKERS.map((w) => {
                const ok = allowed(w.zone, topology) && !(topology === "hybrid" && w.sensitive && w.zone === "cloud-burst");
                return (
                  <tr key={w.name} className="border-b border-border/70">
                    <td className="py-2 pr-3 font-mono text-xs">
                      {w.name}
                      {w.sensitive ? (
                        <Badge className="ml-2" tone="warn">
                          sensitive
                        </Badge>
                      ) : null}
                    </td>
                    <td className="py-2 pr-3 text-muted">{PILLAR_LABEL[w.pillar]}</td>
                    <td className="py-2 pr-3 text-muted">{w.zone}</td>
                    <td className="py-2">
                      <Badge tone={ok ? "ok" : "danger"}>{ok ? "schedule" : "block"}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setTopology("local")}>
          Force local
        </Button>
        <p className="self-center text-xs text-muted">
          Switching modes is a simulation. Wire the same tags into topology-service before a real cutover.
        </p>
      </div>
    </div>
  );
}
