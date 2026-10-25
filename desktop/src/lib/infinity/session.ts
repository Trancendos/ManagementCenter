/**
 * Infinity session for the Management Center: Portal (sign-in) -> Gate (rights).
 *
 * Two ways in:
 *  1. Infinity Portal (OIDC + PKCE, loopback redirect). Used when an issuer is
 *     configured. Infinity-One is the account behind it.
 *  2. Development sign-in: paste a token, e.g. one minted by
 *     `stage-gates token --sub drew --role admin`. This exists because the
 *     Infinity-Portal/Gate repos are still empty (checked 2026-10-25), so no
 *     OIDC issuer is live yet. It is clearly labelled in the UI.
 *
 * Tokens are kept in sessionStorage only: closing the app signs you out.
 */

import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import type { McConfig } from "../config.ts";
import { isTauri } from "../http.ts";
import { evaluate, readClaims, type GateDecision, type TokenClaims } from "./gate.ts";
import { buildAuthorizeUrl, discover, exchangeCode, parseCallback, type TokenSet } from "./oidc.ts";
import { challengeFor, createVerifier, randomToken } from "./pkce.ts";

export type SignInMethod = "infinity-portal" | "development-token";

export interface InfinitySession {
  method: SignInMethod;
  accessToken: string;
  idToken: string | null;
  decision: GateDecision;
  signedInAt: number;
}

const KEY = "mc.session.v1";

/** Rights are read from the access token when it is a JWT, else from the ID token. */
function claimsOf(tokens: TokenSet): TokenClaims {
  try {
    return readClaims(tokens.access_token);
  } catch {
    if (!tokens.id_token) throw new Error("Neither the access token nor an ID token carries readable claims.");
    return readClaims(tokens.id_token);
  }
}

export function sessionFromTokens(method: SignInMethod, tokens: TokenSet): InfinitySession {
  return {
    method,
    accessToken: tokens.access_token,
    idToken: tokens.id_token ?? null,
    decision: evaluate(claimsOf(tokens)),
    signedInAt: Date.now(),
  };
}

export function saveSession(session: InfinitySession | null): void {
  try {
    if (session) sessionStorage.setItem(KEY, JSON.stringify(session));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the session lives only as long as this window's memory.
  }
}

export function restoreSession(): InfinitySession | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as InfinitySession;
    // Re-evaluate expiry now rather than trusting the stored decision, from the same token sign-in used.
    const tokens = { access_token: session.accessToken, id_token: session.idToken ?? undefined };
    return { ...session, decision: evaluate(claimsOf(tokens)) };
  } catch {
    return null;
  }
}

export function signInWithToken(token: string): InfinitySession {
  return sessionFromTokens("development-token", { access_token: token.trim() });
}

/** Runs the full Infinity Portal flow. Only available inside the desktop app. */
export async function signInWithPortal(config: McConfig, timeoutMs = 5 * 60_000): Promise<InfinitySession> {
  if (!config.infinityIssuer) throw new Error("No Infinity issuer is configured yet. Set it in Settings.");
  if (!isTauri()) throw new Error("Infinity Portal sign-in needs the desktop app (it listens for the browser redirect).");

  const discovery = await discover(config.infinityIssuer);
  const verifier = createVerifier();
  const state = randomToken();
  const nonce = randomToken();

  // Rust binds 127.0.0.1 on a free port and waits for exactly one redirect carrying this state.
  const port = await invoke<number>("infinity_loopback_listen", { timeoutSecs: Math.ceil(timeoutMs / 1000), expectedState: state });
  const redirectUri = `http://127.0.0.1:${port}/callback`;

  const query = new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Sign-in timed out. Start again.")), timeoutMs);
    void listen<string>("infinity://callback", (event) => {
      clearTimeout(timer);
      resolve(event.payload);
    });
  });

  await openUrl(
    buildAuthorizeUrl({
      authorizationEndpoint: discovery.authorization_endpoint,
      clientId: config.infinityClientId,
      redirectUri,
      scope: config.infinityScope,
      state,
      nonce,
      codeChallenge: await challengeFor(verifier),
    }),
  );

  const code = parseCallback(await query, state);
  const tokens = await exchangeCode({
    tokenEndpoint: discovery.token_endpoint,
    clientId: config.infinityClientId,
    code,
    redirectUri,
    codeVerifier: verifier,
  });
  if (tokens.id_token) {
    const idClaims = readClaims(tokens.id_token);
    if (idClaims.nonce !== nonce) throw new Error("ID token nonce did not match. Sign-in rejected.");
  }
  return sessionFromTokens("infinity-portal", tokens);
}
