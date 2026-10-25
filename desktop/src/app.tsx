import { useCallback, useEffect, useMemo, useState } from "react";
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

  const access = useMemo(() => (session ? mayEnterManagementCenter(session.decision) : null), [session]);

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
