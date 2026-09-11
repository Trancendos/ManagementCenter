import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  GitPullRequest,
  Kanban,
  Menu,
  Network,
  ScrollText,
  Search,
  Shield,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { REPO } from "@/lib/data/catalog";
import { gradeFromState, useImmune } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Command", icon: Activity },
  { to: "/forensics", label: "Forensics", icon: Search },
  { to: "/triage", label: "Triage", icon: GitPullRequest },
  { to: "/backlog", label: "Backlog", icon: Kanban },
  { to: "/antibodies", label: "Antibodies", icon: Shield },
  { to: "/topology", label: "Topology", icon: Network },
  { to: "/architecture", label: "Architecture", icon: Boxes },
  { to: "/playbooks", label: "Playbooks", icon: ScrollText },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-elevated text-fg"
                : "text-muted hover:bg-elevated/60 hover:text-fg",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1 pb-6">
      <Mark className="size-8 text-accent" />
      <div>
        <p className="font-display text-sm font-semibold tracking-tight">TRANC3 Immune</p>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Command center</p>
      </div>
    </div>
  );
}

function SentinelCard() {
  const dispatched = useImmune((s) => s.dispatched);
  const healed = useImmune((s) => s.healed);
  const { letter, score } = gradeFromState(dispatched, healed);
  return (
    <div className="mt-auto rounded-lg border border-border bg-elevated p-3">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Sentinel</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">
        {letter}
        <span className="ml-2 text-sm font-normal text-muted">{score}</span>
      </p>
      <p className="mt-2 text-[11px] text-subtle">
        {REPO.owner}/{REPO.name} · 11 Sep 2026
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/90 px-4 py-6 backdrop-blur-sm lg:flex">
        <Brand />
        <NavLinks />
        <SentinelCard />
      </aside>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2">
          <Mark className="size-6 text-accent" />
          <span className="font-display text-sm font-semibold">TRANC3 Immune</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <SheetContent side="left">
            <div className="flex h-full flex-col pt-8">
              <Brand />
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <div className="lg:pl-60">
        <main id="main" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
