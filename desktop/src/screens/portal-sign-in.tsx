import { useState, type FormEvent } from "react";
import { KeyRound, LogIn, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { McConfig } from "../lib/config.ts";
import { isTauri } from "../lib/http.ts";
import { signInWithPortal, signInWithToken, type InfinitySession } from "../lib/infinity/session.ts";
import { SettingsForm } from "./settings.tsx";

interface Props {
  config: McConfig;
  onConfigChange: (config: McConfig) => void;
  onSignedIn: (session: InfinitySession) => void;
}

/** Infinity Portal: the login homepage for every Trancendos sign-in. */
export function PortalSignIn({ config, onConfigChange, onSignedIn }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const portalReady = Boolean(config.infinityIssuer) && isTauri();

  async function portal() {
    setBusy(true);
    setError(null);
    try {
      onSignedIn(await signInWithPortal(config));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function devSignIn(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      onSignedIn(signInWithToken(token));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-5 px-4 py-10">
      <header className="flex flex-col gap-2">
        <Badge tone="accent" className="w-fit">Infinity Portal</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Sign in to the Management Center</h1>
        <p className="text-sm text-muted">
          One Infinity-One account for every Trancendos location. After sign-in, Infinity Gate checks your rights; the
          Management Center opens for the Admin level only.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Infinity account</CardTitle>
          <CardDesc>
            Opens the Infinity Portal login in your browser, then returns here. Uses OpenID Connect with PKCE; no
            password is ever typed into this app.
          </CardDesc>
        </CardHeader>
        <Button onClick={portal} disabled={!portalReady || busy} className="w-full" aria-describedby={portalReady ? undefined : "portal-hint"}>
          <LogIn aria-hidden /> {busy ? "Waiting for the browser…" : "Sign in with Infinity"}
        </Button>
        {!portalReady && (
          <p id="portal-hint" className="mt-3 text-xs text-muted">
            {isTauri()
              ? "No Infinity issuer is set yet. Add it in Settings (for example http://127.0.0.1:8005 for the local Infinity auth worker)."
              : "Infinity Portal sign-in runs in the desktop app. In a browser preview, use the development sign-in below."}
          </p>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="size-4" aria-hidden /> Development sign-in
          </CardTitle>
          <CardDesc>
            Paste a short-lived token, for example from <code className="font-mono">stage-gates token --sub you --role admin</code>.
            For local testing until the Infinity issuer is live.
          </CardDesc>
        </CardHeader>
        <form onSubmit={devSignIn} className="flex flex-col gap-3">
          <label htmlFor="dev-token" className="text-xs font-medium text-muted">Token (JWT)</label>
          <textarea
            id="dev-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            rows={3}
            spellCheck={false}
            autoComplete="off"
            className="rounded-md border border-border bg-elevated p-2 font-mono text-xs text-fg"
          />
          <Button type="submit" variant="secondary" disabled={!token.trim()}>Use this token</Button>
        </form>
      </Card>

      <div role="alert" aria-live="assertive" className="min-h-5 text-sm text-danger">{error}</div>

      <Button variant="ghost" size="sm" className="w-fit" onClick={() => setShowSettings((s) => !s)} aria-expanded={showSettings}>
        <Settings2 aria-hidden /> Settings
      </Button>
      {showSettings && <SettingsForm config={config} onChange={onConfigChange} />}
    </main>
  );
}
