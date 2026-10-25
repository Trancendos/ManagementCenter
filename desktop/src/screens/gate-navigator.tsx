import { DoorOpen, Lock, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MANAGEMENT_CENTER, levelsFor, mayEnterManagementCenter } from "../lib/infinity/gate.ts";
import type { InfinitySession } from "../lib/infinity/session.ts";

interface Props {
  session: InfinitySession;
  onEnter: () => void;
  onSignOut: () => void;
}

/** Infinity Gate: shows the rights the token carries and where they lead. */
export function GateNavigator({ session, onEnter, onSignOut }: Props) {
  const { decision } = session;
  const access = mayEnterManagementCenter(decision);
  const mcLevels = levelsFor(decision, MANAGEMENT_CENTER);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-5 px-4 py-10">
      <header className="flex flex-col gap-2">
        <Badge tone="accent" className="w-fit">Infinity Gate</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome, {decision.identity}</h1>
        <p className="text-sm text-muted">
          Signed in with {session.method === "infinity-portal" ? "your Infinity account" : "a development token"}
          {decision.expiresAt ? `, valid until ${new Date(decision.expiresAt * 1000).toLocaleString()}` : ""}.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your rights</CardTitle>
          <CardDesc>Read from your Infinity-One token. Each service checks the token again before acting.</CardDesc>
        </CardHeader>
        <ul className="flex flex-wrap gap-2" aria-label="Rights levels">
          {decision.levels.length === 0 && <li className="text-sm text-muted">No platform-wide levels in this token.</li>}
          {decision.levels.map((level) => (
            <li key={level}><Badge tone={level === "admin" ? "ok" : "muted"}>{level}</Badge></li>
          ))}
        </ul>
        {Object.keys(decision.locations).length > 0 && (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {Object.entries(decision.locations).map(([slug, levels]) => (
              <div key={slug} className="contents">
                <dt className="font-mono text-muted">{slug}</dt>
                <dd>{levels.join(", ")}</dd>
              </div>
            ))}
          </dl>
        )}
      </Card>

      <Card className={access.allowed ? "border-accent/40" : undefined}>
        <div className="flex items-start gap-3">
          {access.allowed ? <ShieldCheck className="mt-1 size-5 text-ok" aria-hidden /> : <Lock className="mt-1 size-5 text-danger" aria-hidden />}
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-lg font-semibold">Management Center</h2>
            <p className="text-sm text-muted">Requires: admin. You hold: {mcLevels.length ? mcLevels.join(", ") : "none"}.</p>
            <p role="status" className={access.allowed ? "text-sm text-ok" : "text-sm text-danger"}>{access.reason}</p>
          </div>
          <Button onClick={onEnter} disabled={!access.allowed}>
            <DoorOpen aria-hidden /> Enter
          </Button>
        </div>
      </Card>

      <Button variant="ghost" size="sm" className="w-fit" onClick={onSignOut}>
        <LogOut aria-hidden /> Sign out
      </Button>
    </main>
  );
}
