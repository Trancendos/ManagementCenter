import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { ANTIBODIES, MUTANTS } from "@/lib/data/antibodies";
import { PLAYBOOKS } from "@/lib/data/playbooks";
import { useImmune } from "@/lib/store";

export const Route = createFileRoute("/antibodies")({ component: Antibodies });

function Antibodies() {
  const dispatched = useImmune((s) => s.dispatched);
  const dispatch = useImmune((s) => s.dispatch);
  const vaccinate = useImmune((s) => s.vaccinate);
  const vaccinations = useImmune((s) => s.vaccinations);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Adaptive immunity</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          White cells for a Python body
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Innate responders fire on every PR. Adaptive ones remember a signature. Autoimmune
          guard: security paths never auto-merge. Dispatching an antibody marks linked issues
          cured in this console and unlocks its playbook.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ANTIBODIES.map((ab) => {
          const on = dispatched.includes(ab.id);
          return (
            <Card key={ab.id} className={on ? "border-ok/40" : ""}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg font-semibold">{ab.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">{ab.role}</p>
                </div>
                <Badge tone={on ? "ok" : "muted"}>{on ? "deployed" : "dormant"}</Badge>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{ab.cures}</p>
              {ab.issues.length ? (
                <p className="mt-2 font-mono text-[11px] text-subtle">
                  {ab.issues.map((n) => `#${n}`).join(" · ")}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={on ? "secondary" : "primary"}
                  disabled={on}
                  onClick={() => {
                    dispatch(ab.id);
                    toast.success(`${ab.name} deployed`);
                  }}
                >
                  {on ? "In memory" : "Dispatch"}
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/playbooks">Playbook</Link>
                </Button>
              </div>
              {!ab.autoMergeSafe ? (
                <p className="mt-3 text-[11px] text-warn">Human review required — security-adjacent.</p>
              ) : (
                <p className="mt-3 text-[11px] text-muted">Safe to auto-propose after CI green.</p>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vaccination</CardTitle>
          <CardDesc>
            Inject a known mutant. If the matching antibody is in memory, the memory-cell path
            catches it. If not, the body is still naive.
          </CardDesc>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {MUTANTS.map((m) => (
            <Button
              key={m.id}
              size="sm"
              variant="outline"
              onClick={() => {
                const r = vaccinate(m.id);
                if (r.caught) toast.success(`Caught by ${r.antibody}`);
                else toast.error(`Naive. Deploy ${r.antibody}.`);
              }}
            >
              Inject {m.label}
            </Button>
          ))}
        </div>
        {vaccinations.length ? (
          <ul className="mt-5 space-y-2">
            {vaccinations.slice(0, 8).map((v, i) => (
              <li key={`${v.t}-${i}`} className="text-sm text-muted">
                <Badge tone={v.caught ? "ok" : "danger"} className="mr-2">
                  {v.caught ? "caught" : "missed"}
                </Badge>
                {v.mutant} · {v.antibody}
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      <p className="text-xs text-subtle">
        {PLAYBOOKS.length} playbooks in the library. Deployed antibodies do not push to GitHub —
        copy the YAML from Playbooks into Tranc3.
      </p>
    </div>
  );
}
