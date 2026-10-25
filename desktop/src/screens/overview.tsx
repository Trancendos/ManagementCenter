import { Activity, Boxes, FlagTriangleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceBase, type McConfig } from "../lib/config.ts";
import type { InfinitySession } from "../lib/infinity/session.ts";
import { CmdbClient } from "../lib/services/cmdb.ts";
import { StageGatesClient } from "../lib/services/stage-gates.ts";
import { useAsync } from "../lib/use-async.ts";
import type { Section } from "./shell.tsx";

interface Props {
  config: McConfig;
  session: InfinitySession;
  onNavigate: (section: Section) => void;
}

function Status({ name, state }: { name: string; state: { data: unknown; error: string | null; loading: boolean } }) {
  const tone = state.loading ? "muted" : state.error ? "danger" : "ok";
  const text = state.loading ? "checking" : state.error ? "unreachable" : "up";
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm">{name}</span>
      <Badge tone={tone}>{text}</Badge>
    </div>
  );
}

/** Service health at a glance, and the two live areas. */
export function Overview({ config, session, onNavigate }: Props) {
  const gates = new StageGatesClient(serviceBase("stage-gates", config), session.accessToken);
  const cmdb = new CmdbClient(serviceBase("cmdb", config));
  const gatesHealth = useAsync(() => gates.health(), [config.stageGatesUrl]);
  const cmdbHealth = useAsync(() => cmdb.health(), [config.cmdbUrl]);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted">Read-only first release. Changes are made in TownHall and the CMDB for now.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="size-4" aria-hidden /> Services</CardTitle>
          </CardHeader>
          <Status name="Stage Gates (SVC-TWH-05)" state={gatesHealth} />
          <Status name="Atlas CMDB" state={cmdbHealth} />
          {(gatesHealth.error || cmdbHealth.error) && (
            <p className="mt-2 text-xs text-muted">{gatesHealth.error ?? cmdbHealth.error}</p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlagTriangleRight className="size-4" aria-hidden /> Project Management</CardTitle>
            <CardDesc>Every project moves through the gates; each passed gate is a sign-off.</CardDesc>
          </CardHeader>
          <Button variant="outline" size="sm" onClick={() => onNavigate("pm-gates")}>Open Gates</Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Boxes className="size-4" aria-hidden /> Service Management</CardTitle>
            <CardDesc>Locations from the CMDB, with their network links, findings and projects.</CardDesc>
          </CardHeader>
          <Button variant="outline" size="sm" onClick={() => onNavigate("sm-locations")}>Open Locations</Button>
        </Card>
      </div>
    </div>
  );
}
