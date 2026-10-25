/**
 * Infinity Portal sign-in: OpenID Connect authorization code flow with PKCE,
 * using a loopback redirect (RFC 8252, "OAuth 2.0 for Native Apps").
 *
 * Flow: discover issuer -> open the Infinity Portal login page in the system
 * browser -> the Rust side listens once on 127.0.0.1:<random port> for the
 * redirect -> exchange the code for tokens -> Infinity Gate evaluates rights.
 *
 * Pure functions here; the Tauri wiring lives in session.ts.
 */

import { getFetch, requestJson, type FetchLike } from "../http.ts";

export interface Discovery {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

export interface TokenSet {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export async function discover(issuer: string, fetchImpl?: FetchLike): Promise<Discovery> {
  const base = issuer.replace(/\/+$/, "");
  const doc = await requestJson<Partial<Discovery>>({
    service: "Infinity issuer",
    url: `${base}/.well-known/openid-configuration`,
    fetchImpl,
  });
  if (!doc.authorization_endpoint || !doc.token_endpoint) {
    throw new Error("The Infinity issuer's discovery document has no authorization or token endpoint.");
  }
  // OIDC Discovery 1.0 section 4.3: the issuer in the document must match the one we asked.
  if (doc.issuer && doc.issuer.replace(/\/+$/, "") !== base) {
    throw new Error(`Issuer mismatch: asked ${base}, document says ${doc.issuer}.`);
  }
  return doc as Discovery;
}

export interface AuthorizeParams {
  authorizationEndpoint: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  nonce: string;
  codeChallenge: string;
}

export function buildAuthorizeUrl(p: AuthorizeParams): string {
  const url = new URL(p.authorizationEndpoint);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", p.clientId);
  url.searchParams.set("redirect_uri", p.redirectUri);
  url.searchParams.set("scope", p.scope);
  url.searchParams.set("state", p.state);
  url.searchParams.set("nonce", p.nonce);
  url.searchParams.set("code_challenge", p.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

/** Reads the redirect query. Throws if the state does not match (CSRF) or the issuer returned an error. */
export function parseCallback(query: string, expectedState: string): string {
  const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const error = params.get("error");
  if (error) {
    const description = params.get("error_description");
    throw new Error(`Infinity sign-in was refused: ${error}${description ? ` (${description})` : ""}`);
  }
  if (params.get("state") !== expectedState) throw new Error("Sign-in state did not match. Start sign-in again.");
  const code = params.get("code");
  if (!code) throw new Error("The Infinity Portal returned no authorization code.");
  return code;
}

export interface ExchangeParams {
  tokenEndpoint: string;
  clientId: string;
  code: string;
  redirectUri: string;
  codeVerifier: string;
}

export async function exchangeCode(p: ExchangeParams, fetchImpl?: FetchLike): Promise<TokenSet> {
  const doFetch = fetchImpl ?? (await getFetch());
  const form = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: p.clientId,
    code: p.code,
    redirect_uri: p.redirectUri,
    code_verifier: p.codeVerifier,
  });
  const res = await doFetch(p.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: form.toString(),
  });
  const body = (await res.json().catch(() => null)) as (TokenSet & { error?: string; error_description?: string }) | null;
  if (!res.ok || !body?.access_token) {
    throw new Error(`Token exchange failed: ${body?.error_description ?? body?.error ?? `HTTP ${res.status}`}`);
  }
  return body;
}
