/**
 * Management Center settings, editable on the Settings screen.
 *
 * Stored in localStorage on this machine only. No secrets live here: tokens
 * stay in memory/sessionStorage (see infinity/session.ts) and the CMDB
 * password is never stored.
 */

import { isTauri } from "./http.ts";

export interface McConfig {
  /** Infinity issuer (OIDC). Empty until Infinity Portal/One publish OIDC discovery. */
  infinityIssuer: string;
  infinityClientId: string;
  infinityScope: string;
  /** SVC-TWH-05 Stage Gates, shown as Project Management > Gates. */
  stageGatesUrl: string;
  /** Atlas CMDB, shown inside the Service Management Center. */
  cmdbUrl: string;
  theme: "dark" | "light";
}

export const DEFAULT_CONFIG: McConfig = {
  infinityIssuer: "",
  infinityClientId: "management-center",
  infinityScope: "openid profile email roles",
  stageGatesUrl: "http://127.0.0.1:8705",
  cmdbUrl: "http://127.0.0.1:8765",
  theme: "dark",
};

const KEY = "mc.config.v1";

export function loadConfig(storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage): McConfig {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<McConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: McConfig, storage: Pick<Storage, "setItem"> | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(KEY, JSON.stringify(config));
  } catch {
    // Private mode or blocked storage: settings fall back to defaults next launch.
  }
}

/**
 * In the desktop app, call the services directly. In a browser dev session,
 * call the Vite proxy paths instead, because the services refuse CORS.
 */
export function serviceBase(kind: "stage-gates" | "cmdb", config: McConfig): string {
  if (!isTauri()) return kind === "stage-gates" ? "/__svc/stage-gates" : "/__svc/cmdb";
  return (kind === "stage-gates" ? config.stageGatesUrl : config.cmdbUrl).replace(/\/+$/, "");
}
