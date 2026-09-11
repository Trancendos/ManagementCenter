import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CHECKLIST, GAPS, PULLS, REPO } from "@/lib/data/catalog";
import { ANTIBODIES } from "@/lib/data/antibodies";
import { EPICS } from "@/lib/data/backlog";
import {
  gradeFromState,
  phaseProgress,
  useImmune,
} from "@/lib/store";

export const Route = createFileRoute("/")({ component: Command });

function Command() {
  const dispatched = useImmune((s) => s.dispatched);
  const healed = useImmune((s) => s.healed);
  const events = useImmune((s) => s.events);
  const checks = useImmune((s) => s.checks);
  const storyStatus = useImmune((s) => s.storyStatus);
  const toggleCheck = useImmune((s) => s.toggleCheck);
  const reset = useImmune((s) => s.reset);
  const { letter, score } = gradeFromState(dispatched, healed);
  const p0 = phaseProgress(storyStatus, 0);
  const criticalOpen = GAPS.filter((g) => g.severity === "critical" && !(g.issue && healed[g.issue])).length;
  const blocked = PULLS.filter((p) => p.blocked).length;
  const nextAb = ANTIBODIES.find((a) => !dispatched.includes(a.id));
  const checked = CHECKLIST.filter((c) => checks[c.id]).length;

  const trend = Array.from({ length: 12 }, (_, i) => {
    const t = 32 + (score - 32) * (i / 11);
    return { d: `D${i + 1}`, v: Math.round(t) };
  });

  const inflammation =
    score < 50 ? "Chronic inflammation" : score < 75 ? "Recovery in progress" : "Adaptive clearance";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Live snapshot · 11 Sep 2026</p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            The body detects.
            <br />
            It does not yet clear.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            {REPO.owner}/{REPO.name} is a self-hosted AI platform with a green idea and a red
            pipeline. This console turns the forensic work into bounded antibodies, a sequenced
            backlog, and copy-ready playbooks — still zero cost, still independent.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw /> Reset sim
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Card className="flex flex-col items-center justify-center py-8">
          <div
            className="relative size-40 rounded-full"
            style={{
              background: `conic-gradient(var(--color-accent) ${score}%, var(--color-elevated) 0)`,
            }}
            role="img"
            aria-label={`Immune score ${score}, grade ${letter}`}
          >
            <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-surface">
              <span className="font-display text-4xl font-semibold tabular-nums">{letter}</span>
              <span className="text-xs tabular-nums text-muted">{score}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">{inflammation}</p>
          <Badge tone={score < 50 ? "danger" : score < 75 ? "warn" : "ok"} className="mt-2">
            Sentinel
          </Badge>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Host vitals</CardTitle>
            <CardDesc>
              GitHub census, not README marketing. Open issue count on GitHub includes pull
              requests — 95 combined, 12 true issues, ~83 PRs, 30 sampled all labeled blocked.
            </CardDesc>
          </CardHeader>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
            <Stat k="True issues" v={String(REPO.trueOpenIssues)} />
            <Stat k="Open PRs ~" v={String(REPO.openPrsApprox)} warn />
            <Stat k="Sample blocked" v={`${blocked}/${REPO.sampledPrs}`} warn />
            <Stat k="Workers claimed" v={String(REPO.workersClaimed)} />
            <Stat k="Workers in tree" v={String(REPO.workersActual)} warn />
            <Stat k="Bus factor" v="1" warn />
            <Stat k="Stars / forks" v={`${REPO.stars} / ${REPO.forks}`} />
            <Stat k="Critical gaps" v={String(criticalOpen)} warn={criticalOpen > 0} />
            <Stat k="Antibodies up" v={`${dispatched.length}/${ANTIBODIES.length}`} />
          </dl>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phase 0 — sterilise the host</CardTitle>
            <CardDesc>
              {p0.done}/{p0.total} stories done. Main must stay green for seven days before
              topology work.
            </CardDesc>
          </CardHeader>
          <Progress value={p0.pct} tone={p0.pct === 100 ? "ok" : "accent"} />
          <ol className="mt-5 space-y-3">
            {CHECKLIST.map((c) => (
              <li key={c.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={c.id}
                  checked={Boolean(checks[c.id])}
                  onChange={() => toggleCheck(c.id)}
                  className="mt-1 size-4 accent-[var(--color-accent)]"
                />
                <label htmlFor={c.id} className="text-sm leading-snug text-fg">
                  {c.label}
                </label>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted">
            {checked} of {CHECKLIST.length} cleared in this session
          </p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Immune trend</CardTitle>
            <CardDesc>Projected recovery if dispatched antibodies stay in place.</CardDesc>
          </CardHeader>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <XAxis dataKey="d" hide />
                <RTooltip
                  contentStyle={{
                    background: "var(--color-elevated)",
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                    color: "var(--color-fg)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-accent)"
                  fill="var(--color-accent)"
                  fillOpacity={0.18}
                  strokeWidth={1.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EPICS.map((e) => {
              const p = phaseProgress(storyStatus, e.phase);
              return (
                <div key={e.id} className="rounded-md bg-elevated p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{e.id}</p>
                  <p className="mt-1 font-mono text-sm tabular-nums">{Math.round(p.pct)}%</p>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Next antibody</CardTitle>
            <CardDesc>
              Antibodies propose fixes. They never silent-merge security paths. Dispatch here
              unlocks the matching playbook.
            </CardDesc>
          </CardHeader>
          {nextAb ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xl">{nextAb.name}</p>
                <p className="mt-1 text-sm text-muted">{nextAb.cures}</p>
              </div>
              <Button asChild>
                <Link to="/antibodies">
                  Open antibodies <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-ok">
              All antibodies deployed. Run vaccination on the Antibodies board.
            </p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Event lymph</CardTitle>
            <CardDesc>Session log. Newest first.</CardDesc>
          </CardHeader>
          <ul className="max-h-48 space-y-2 overflow-auto pr-1" aria-live="polite">
            {events.slice(0, 8).map((e, i) => (
              <li key={`${e.t}-${i}`} className="text-sm text-muted">
                <span className="mr-2 font-mono text-[11px] text-subtle">
                  {e.t
                    ? new Date(e.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "t0"}
                </span>
                {e.msg}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}

function Stat({ k, v, warn }: { k: string; v: string; warn?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd
        className={`mt-1 font-display text-2xl font-semibold tabular-nums ${warn ? "text-warn" : "text-fg"}`}
      >
        {v}
      </dd>
    </div>
  );
}
