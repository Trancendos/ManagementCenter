import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { GAPS, REPO, SWOT, type Severity } from "@/lib/data/catalog";
import { useImmune } from "@/lib/store";

export const Route = createFileRoute("/forensics")({ component: Forensics });

const TONE: Record<Severity, "danger" | "warn" | "muted" | "ok"> = {
  critical: "danger",
  high: "warn",
  medium: "muted",
  low: "ok",
};

function Forensics() {
  const healed = useImmune((s) => s.healed);
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Forensic assessment</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          What the tree actually contains
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Census taken against the public GitHub API on 11 Sep 2026. Earlier reports citing 863
          issues were stale — GitHub now shows 12 true open issues and ~83 pull requests, all of
          the sampled PRs labeled blocked. The README still advertises 29 workers; {REPO.workersActual}{" "}
          directories sit under workers/.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Swot title="Strengths" items={SWOT.strengths} />
        <Swot title="Weaknesses" items={SWOT.weaknesses} />
        <Swot title="Opportunities" items={SWOT.opportunities} />
        <Swot title="Threats" items={SWOT.threats} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Root causes — no blame</CardTitle>
          <CardDesc>
            Illnesses the body never cleared. The cure is adaptive memory plus automated
            clearance, not more scanners.
          </CardDesc>
        </CardHeader>
        <ul className="grid gap-4 sm:grid-cols-2">
          <Cause
            t="Dual runway"
            b="Legacy Cloudflare path and 89 FastAPI workers coexist. Routing and config drift is structural, not accidental."
          />
          <Cause
            t="Gates on absolute state"
            b="The freshness gate measures the body’s surface, not the change. Bot bumps look like disease."
          />
          <Cause
            t="Detection without thymus"
            b="Aikido, Bolt, Renovate, CodeFactor all shout. Nothing trains tolerance or batches clearance."
          />
          <Cause
            t="Docs lag the constellation"
            b="29 vs 89 workers. Spark phases, Infinity Void internals, and DR are underspecified."
          />
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gap register</CardTitle>
          <CardDesc>Mapped to phases. Cured rows dim once the matching antibody has fired.</CardDesc>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-medium">ID</th>
                <th className="py-2 pr-3 font-medium">Domain</th>
                <th className="py-2 pr-3 font-medium">Finding</th>
                <th className="py-2 pr-3 font-medium">Sev</th>
                <th className="py-2 font-medium">Phase</th>
              </tr>
            </thead>
            <tbody>
              {GAPS.map((g) => {
                const cured = Boolean(g.issue && healed[g.issue]);
                return (
                  <tr
                    key={g.id}
                    className={`border-b border-border/70 ${cured ? "opacity-45" : ""}`}
                  >
                    <td className="py-3 pr-3 font-mono text-xs">
                      {g.id}
                      {g.issue ? (
                        <a
                          className="ml-2 text-accent hover:underline"
                          href={`${REPO.url}/issues/${g.issue}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          #{g.issue}
                        </a>
                      ) : null}
                    </td>
                    <td className="py-3 pr-3 text-muted">{g.domain}</td>
                    <td className="py-3 pr-3 leading-relaxed">{g.finding}</td>
                    <td className="py-3 pr-3">
                      <Badge tone={TONE[g.severity]}>{g.severity}</Badge>
                    </td>
                    <td className="py-3 tabular-nums text-muted">{g.phase}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Swot({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it} className="text-sm leading-relaxed text-muted">
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Cause({ t, b }: { t: string; b: string }) {
  return (
    <li>
      <p className="font-medium">{t}</p>
      <p className="mt-1 text-sm text-muted leading-relaxed">{b}</p>
    </li>
  );
}
