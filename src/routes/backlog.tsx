import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDesc,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EPICS, STORIES, type Story, type StoryStatus } from "@/lib/data/backlog";
import { phaseProgress, useImmune } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/backlog")({ component: Backlog });

const COLS: { id: StoryStatus; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "ready", label: "Ready" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
];

const NEXT: Record<StoryStatus, StoryStatus | null> = {
  backlog: "ready",
  ready: "doing",
  doing: "done",
  done: null,
};

function Backlog() {
  const storyStatus = useImmune((s) => s.storyStatus);
  const setStory = useImmune((s) => s.setStory);
  const [open, setOpen] = useState<Story | null>(null);
  const totalSp = STORIES.reduce((a, s) => a + s.sp, 0);
  const doneSp = STORIES.filter((s) => storyStatus[s.id] === "done").reduce((a, s) => a + s.sp, 0);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Agile board</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Four epics. One maintainer. No theatre.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Definition of Ready: AC written, dependencies listed, sized ≤ 8 SP or split. Definition
          of Done: CI green, docs updated, playbook in git, branch deleted. Advance cards in this
          session — they persist locally.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        {EPICS.map((e) => {
          const p = phaseProgress(storyStatus, e.phase);
          return (
            <Card key={e.id} className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-muted">{e.id}</p>
              <p className="mt-1 font-display font-semibold">{e.title}</p>
              <Progress className="mt-3" value={p.pct} />
              <p className="mt-2 font-mono text-xs text-muted">
                {p.done}/{p.total}
              </p>
            </Card>
          );
        })}
      </div>

      <p className="text-sm text-muted">
        Velocity budget ~13 SP / 2-week sprint. Board total {totalSp} SP · done {doneSp} SP.
      </p>

      <div className="grid gap-3 md:grid-cols-4">
        {COLS.map((col) => {
          const items = STORIES.filter((s) => (storyStatus[s.id] ?? "backlog") === col.id);
          return (
            <section key={col.id} className="rounded-xl border border-border bg-surface/60 p-3">
              <h2 className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted">
                {col.label}
                <span className="ml-2 font-mono text-fg">{items.length}</span>
              </h2>
              <ul className="space-y-2">
                {items.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(s)}
                      className="w-full rounded-md border border-border bg-elevated p-3 text-left hover:border-border-strong"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-muted">{s.id}</span>
                        <Badge tone="muted">{s.sp} SP</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-snug">{s.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        {open ? (
          <DialogContent>
            <DialogTitle>
              {open.id} · {open.title}
            </DialogTitle>
            <DialogDesc>
              {open.kind} · {open.sp} SP · ~{open.days}d · phase {open.phase}
              {open.issues.length ? ` · issues ${open.issues.map((n) => `#${n}`).join(", ")}` : ""}
            </DialogDesc>
            <Block title="Acceptance" items={open.ac} />
            <Block title="Ready" items={open.dor} />
            <Block title="Done" items={open.dod} />
            <div className="mt-5 flex flex-wrap gap-2">
              {COLS.map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={storyStatus[open.id] === c.id ? "primary" : "secondary"}
                  onClick={() => setStory(open.id, c.id)}
                >
                  {c.label}
                </Button>
              ))}
              {NEXT[storyStatus[open.id] ?? "backlog"] ? (
                <Button
                  size="sm"
                  onClick={() => {
                    const n = NEXT[storyStatus[open.id] ?? "backlog"];
                    if (n) setStory(open.id, n);
                  }}
                >
                  Advance
                </Button>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className={cn("text-[11px] uppercase tracking-[0.14em] text-muted")}>{title}</p>
      <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-fg">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
