import { useCallback, useEffect, useState } from "react";
import { loadConfig, saveConfig, type McConfig } from "./lib/config.ts";
import { mayEnterManagementCenter } from "./lib/infinity/gate.ts";
import { restoreSession, saveSession, type InfinitySession } from "./lib/infinity/session.ts";
import { PortalSignIn } from "./screens/portal-sign-in.tsx";
import { GateNavigator } from "./screens/gate-navigator.tsx";
import { Shell, type Section } from "./screens/shell.tsx";

/**
 * Infinity Portal (sign in) -> Infinity Gate (rights) -> Management Center.
 * The Center only opens once the Gate confirms the Admin level.
 */
export function App() {
  const [config, setConfigState] = useState<McConfig>(() => loadConfig());
  const [session, setSessionState] = useState<InfinitySession | null>(() => restoreSession());
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [rearm, setRearm] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.theme = config.theme;
  }, [config.theme]);

  const setConfig = useCallback((next: McConfig) => {
    saveConfig(next);
    setConfigState(next);
  }, []);

  const setSession = useCallback((next: InfinitySession | null) => {
    saveSession(next);
    setSessionState(next);
    if (!next) setEntered(false);
  }, []);

  // Return to the Gate the moment the token passes its `exp`, not only on the next sign-in or reload.
  const expiresAt = session?.decision.expiresAt ?? null;
  useEffect(() => {
    if (expiresAt === null) return;
    const markExpired = () => {
      setSessionState((s) => (s ? { ...s, decision: { ...s.decision, expired: true } } : s));
      setEntered(false);
    };
    const ms = expiresAt * 1000 - Date.now();
    if (ms <= 0) {
      markExpired();
      return;
    }
    // setTimeout caps at ~24.8 days; a longer token re-arms the timer instead of expiring early.
    const MAX_DELAY = 2_147_483_647;
    const timer = setTimeout(ms > MAX_DELAY ? () => setRearm((n) => n + 1) : markExpired, Math.min(ms, MAX_DELAY));
    return () => clearTimeout(timer);
  }, [expiresAt, rearm]);

  // Checked against the clock on every render, so navigation after expiry also closes the Center.
  const access = session ? mayEnterManagementCenter(session.decision) : null;

  if (!session) return <PortalSignIn config={config} onConfigChange={setConfig} onSignedIn={setSession} />;
  if (!entered || !access?.allowed) {
    return <GateNavigator session={session} onEnter={() => setEntered(true)} onSignOut={() => setSession(null)} />;
  }
  return (
    <Shell
      config={config}
      onConfigChange={setConfig}
      session={session}
      section={section}
      onNavigate={setSection}
      onSignOut={() => setSession(null)}
    />
  );
}
