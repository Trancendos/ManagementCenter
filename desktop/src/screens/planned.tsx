import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Section } from "./shell.tsx";

/**
 * Honest placeholders: these areas are agreed scope (Drew, 2026-10-25) but no
 * backing service exists yet, so nothing here pretends to have data.
 */
const PLANS: Partial<Record<Section, { title: string; summary: string; links: string[] }>> = {
  "sm-incidents": {
    title: "Incidents",
    summary: "Unplanned interruptions against a Location. Each INC links to its Location, any Problem, and Agile items working on it.",
    links: ["Location (CMDB)", "Problems", "Agile epics and stories", "Whiteboards and Design Boards"],
  },
  "sm-requests": {
    title: "Service Requests",
    summary: "Standard requests (access, new environments, data) raised against a Location. Access requests resolve through Infinity-One.",
    links: ["Location (CMDB)", "Infinity-One permissions", "IceBox sandpit environments"],
  },
  "sm-changes": {
    title: "Changes",
    summary: "Planned changes with approval. A Change can reference the Project (PRN) and the gate sign-off that authorised it.",
    links: ["Project Management > Gates", "Location (CMDB)", "Agile epics"],
  },
  "sm-problems": {
    title: "Problems",
    summary: "Root causes behind repeated Incidents. Known errors feed the Knowledge Base.",
    links: ["Incidents", "Knowledge Base", "The Cryptex (vulnerabilities)"],
  },
  "sm-knowledge": {
    title: "Knowledge Base",
    summary: "User-facing articles, backed by the Library: Wiki for admins, Knowledge Base for users, Basement for archive and store.",
    links: ["Library: Wiki", "Library: Knowledge Base", "Library: Basement"],
  },
  agile: {
    title: "Agile boards and epics",
    summary:
      "Configurable Kanban boards. Epics hold stories, bugs, issues and technical debt; tickets link to Incidents, Service Requests, Changes and Problems, and epics link to Project Management gates. Each ticket gets participants (people, AIs, agents, bots), Whiteboards and Design Boards.",
    links: ["Service Management tickets", "Project Management > Gates", "Whiteboards", "Design Boards"],
  },
  network: {
    title: "Network Topology",
    summary:
      "A diagram of Locations and the traffic between them, built from CMDB relationships that carry a protocol and port. Each Location's Network section already lists these links.",
    links: ["CMDB relationships (protocol, port)", "Locations (CMDB) > Network"],
  },
};

export function Planned({ section }: { section: Section }) {
  const plan = PLANS[section];
  if (!plan) return null;
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <Badge tone="warn" className="w-fit">Planned, not built yet</Badge>
        <CardTitle>{plan.title}</CardTitle>
        <CardDesc>{plan.summary}</CardDesc>
      </CardHeader>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">Will link to</p>
      <ul className="flex flex-wrap gap-2">
        {plan.links.map((l) => (
          <li key={l}><Badge>{l}</Badge></li>
        ))}
      </ul>
    </Card>
  );
}
