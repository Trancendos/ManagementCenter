import type { ComponentType } from "react";
import {
  BookOpen,
  Boxes,
  ClipboardList,
  FlagTriangleRight,
  GitPullRequestArrow,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Network,
  Settings2,
  Siren,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { McConfig } from "../lib/config.ts";
import type { InfinitySession } from "../lib/infinity/session.ts";
import { Overview } from "./overview.tsx";
import { ProjectGates } from "./project-gates.tsx";
import { Locations } from "./locations.tsx";
import { Planned } from "./planned.tsx";
import { SettingsForm } from "./settings.tsx";

export type Section =
  | "overview"
  | "pm-gates"
  | "sm-locations"
  | "sm-incidents"
  | "sm-requests"
  | "sm-changes"
  | "sm-problems"
  | "sm-knowledge"
  | "agile"
  | "network"
  | "settings";

interface NavItem {
  id: Section;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  planned?: boolean;
}

const GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Management Center", items: [{ id: "overview", label: "Overview", icon: LayoutDashboard }] },
  { label: "Project Management", items: [{ id: "pm-gates", label: "Gates", icon: FlagTriangleRight }] },
  {
    label: "Service Management Center",
    items: [
      { id: "sm-locations", label: "Locations (CMDB)", icon: Boxes },
      { id: "sm-incidents", label: "Incidents", icon: Siren, planned: true },
      { id: "sm-requests", label: "Service Requests", icon: ClipboardList, planned: true },
      { id: "sm-changes", label: "Changes", icon: GitPullRequestArrow, planned: true },
      { id: "sm-problems", label: "Problems", icon: TriangleAlert, planned: true },
      { id: "sm-knowledge", label: "Knowledge Base", icon: BookOpen, planned: true },
    ],
  },
  { label: "Agile", items: [{ id: "agile", label: "Boards & Epics", icon: KanbanSquare, planned: true }] },
  { label: "Admin", items: [{ id: "network", label: "Network Topology", icon: Network, planned: true }, { id: "settings", label: "Settings", icon: Settings2 }] },
];

interface Props {
  config: McConfig;
  onConfigChange: (config: McConfig) => void;
  session: InfinitySession;
  section: Section;
  onNavigate: (section: Section) => void;
  onSignOut: () => void;
}

export function Shell({ config, onConfigChange, session, section, onNavigate, onSignOut }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-[248px_1fr]">
      <nav aria-label="Management Center" className="flex flex-col gap-4 border-r border-border bg-surface px-3 py-4">
        <div className="px-2">
          <p className="font-display text-base font-semibold">Management Center</p>
          <p className="truncate text-xs text-muted" title={session.decision.identity}>{session.decision.identity} · admin</p>
        </div>
        {GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-2 text-[11px] font-medium uppercase tracking-wide text-subtle">{group.label}</p>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.id === section;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm",
                        active ? "bg-accent/15 text-accent" : "text-muted hover:bg-elevated hover:text-fg",
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      {item.planned && <span className="text-[10px] uppercase text-subtle">planned</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="mt-auto justify-start" onClick={onSignOut}>
          <LogOut aria-hidden /> Sign out
        </Button>
      </nav>
      <main className="min-w-0 px-6 py-6" aria-live="polite">
        {section === "overview" && <Overview config={config} session={session} onNavigate={onNavigate} />}
        {section === "pm-gates" && <ProjectGates config={config} session={session} />}
        {section === "sm-locations" && <Locations config={config} session={session} />}
        {section === "settings" && <SettingsForm config={config} onChange={onConfigChange} />}
        {(section.startsWith("sm-") && section !== "sm-locations") || section === "agile" || section === "network" ? (
          <Planned section={section} />
        ) : null}
      </main>
    </div>
  );
}
