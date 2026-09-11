import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ISSUES,
  PR_CLASSES,
  PULLS,
  REPO,
  type PrClass,
} from "@/lib/data/catalog";
import { formatRelative } from "@/lib/utils";
import { useImmune } from "@/lib/store";

export const Route = createFileRoute("/triage")({ component: Triage });

function Triage() {
  const [q, setQ] = useState("");
  const [klass, setKlass] = useState<PrClass | "all">("all");
  const healed = useImmune((s) => s.healed);

  const pulls = useMemo(() => {
    return PULLS.filter((p) => {
      const hit = !q || `${p.number} ${p.title} ${p.author}`.toLowerCase().includes(q.toLowerCase());
      const k = klass === "all" || p.klass === klass;
      return hit && k;
    });
  }, [q, klass]);

  const issues = useMemo(() => {
    return ISSUES.filter(
      (i) => !q || `${i.number} ${i.title}`.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Triage engine</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Batch the flood. Do not merge it.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Thirty most recent PRs — every one labeled blocked. The merge gate is a single lint
          failure, not thirty unique defects. Issues are the 12 true tickets still open.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PR_CLASSES.map((c) => {
          const n = PULLS.filter((p) => p.klass === c.id).length;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setKlass(klass === c.id ? "all" : c.id)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                klass === c.id ? "border-accent bg-accent/10" : "border-border bg-surface"
              }`}
            >
              <p className="font-mono text-xl tabular-nums">{n}</p>
              <p className="mt-1 text-xs text-muted">{c.label}</p>
            </button>
          );
        })}
      </div>

      {klass !== "all" ? (
        <Card>
          <p className="text-sm leading-relaxed text-muted">
            {PR_CLASSES.find((c) => c.id === klass)?.action}
          </p>
        </Card>
      ) : null}

      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter issues and PRs"
        aria-label="Filter issues and PRs"
      />

      <Card>
        <CardHeader>
          <CardTitle>Pull requests (sample of {PULLS.length})</CardTitle>
          <CardDesc>
            Showing {pulls.length}. Merge order: #1177 → #1175 → human product PRs → batched Aikido.
          </CardDesc>
        </CardHeader>
        <ul className="divide-y divide-border">
          {pulls.map((p) => (
            <li key={p.number} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <a
                  className="font-medium hover:text-accent"
                  href={`${REPO.url}/pull/${p.number}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  #{p.number} {p.title}
                </a>
                <p className="mt-1 text-xs text-muted">
                  {p.author} · {formatRelative(p.updated)}
                  {p.draft ? " · draft" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.blocked ? <Badge tone="danger">blocked</Badge> : null}
                <Badge tone="muted">{p.klass}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open issues ({issues.length})</CardTitle>
          <CardDesc>Dimmed rows have been marked cured by a dispatched antibody in this session.</CardDesc>
        </CardHeader>
        <ul className="divide-y divide-border">
          {issues.map((i) => (
            <li
              key={i.number}
              className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between ${
                healed[i.number] ? "opacity-45" : ""
              }`}
            >
              <div>
                <a
                  className="font-medium hover:text-accent"
                  href={`${REPO.url}/issues/${i.number}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  #{i.number} {i.title}
                </a>
                <p className="mt-1 text-xs text-muted">{formatRelative(i.updated)}</p>
              </div>
              <div className="flex gap-1">
                <Badge tone={i.severity === "critical" || i.severity === "high" ? "warn" : "muted"}>
                  {i.severity}
                </Badge>
                <Badge>{i.kind}</Badge>
                {healed[i.number] ? <Badge tone="ok">cured</Badge> : null}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
