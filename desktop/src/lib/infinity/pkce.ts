/**
 * PKCE helpers (RFC 7636) for the Infinity Portal sign-in.
 *
 * A desktop app is a "public client": it cannot keep a client secret, so the
 * authorization-code flow is protected with a one-time code verifier instead.
 * Uses WebCrypto only (built into the Tauri webview and Node 22), no packages.
 */

const VERIFIER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 64 characters from the RFC 7636 unreserved set (spec allows 43 to 128). */
export function createVerifier(length = 64): string {
  if (length < 43 || length > 128) throw new RangeError("PKCE verifier must be 43-128 characters");
  const random = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (const r of random) out += VERIFIER_CHARS[r % VERIFIER_CHARS.length];
  return out;
}

export async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64UrlEncode(new Uint8Array(digest));
}

/** Random opaque value for `state` and `nonce`. */
export function randomToken(bytes = 24): string {
  return base64UrlEncode(crypto.getRandomValues(new Uint8Array(bytes)));
}
