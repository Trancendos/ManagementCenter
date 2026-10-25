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
  infinityScope: "openid email profile infinity offline_access",
  stageGatesUrl: "http://127.0.0.1:8705",
  cmdbUrl: "http://127.0.0.1:8765",
  theme: "dark",
};

const KEY = "mc.config.v1";

/** Reading `localStorage` itself can throw (SecurityError) when storage is blocked, so it is resolved inside `try`. */
function defaultStorage(): Storage | undefined {
  return globalThis.localStorage;
}

export function loadConfig(storage?: Pick<Storage, "getItem">): McConfig {
  try {
    const raw = (storage ?? defaultStorage())?.getItem(KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    const parsed = JSON.parse(raw) as Partial<McConfig>;
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: McConfig, storage?: Pick<Storage, "setItem">): void {
  try {
    (storage ?? defaultStorage())?.setItem(KEY, JSON.stringify(config));
  } catch {
    // Private mode or blocked storage: settings fall back to defaults next launch.
  }
}

/**
 * Origins the desktop app may call. Must match the HTTP allowlist in
 * src-tauri/capabilities/default.json; anything else is refused by Tauri, so
 * Settings rejects it up front with a readable message.
 */
export const ALLOWED_ORIGINS = [
  "http://127.0.0.1:8705",
  "http://localhost:8705",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
  "http://127.0.0.1:8005",
  "http://localhost:8005",
  "https://auth.trancendos.com",
] as const;

/** Returns why a configured URL cannot be used, or null when it is allowed. Empty means "not set". */
export function urlProblem(value: string): string | null {
  if (!value.trim()) return null;
  let origin: string;
  try {
    origin = new URL(value.trim()).origin;
  } catch {
    return "Not a valid URL.";
  }
  return (ALLOWED_ORIGINS as readonly string[]).includes(origin)
    ? null
    : `Not on the desktop app's allowlist (${ALLOWED_ORIGINS.join(", ")}).`;
}

/**
 * In the desktop app, call the services directly. In a browser dev session,
 * call the Vite proxy paths instead, because the services refuse CORS.
 */
export function serviceBase(kind: "stage-gates" | "cmdb", config: McConfig): string {
  if (!isTauri()) return kind === "stage-gates" ? "/__svc/stage-gates" : "/__svc/cmdb";
  return (kind === "stage-gates" ? config.stageGatesUrl : config.cmdbUrl).replace(/\/+$/, "");
}
