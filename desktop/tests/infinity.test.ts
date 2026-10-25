import { test } from "node:test";
import assert from "node:assert/strict";
import { challengeFor, createVerifier } from "../src/lib/infinity/pkce.ts";
import { evaluate, mayEnterManagementCenter, readClaims } from "../src/lib/infinity/gate.ts";
import { buildAuthorizeUrl, parseCallback } from "../src/lib/infinity/oidc.ts";

const b64url = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (claims: Record<string, unknown>) => `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(claims)}.sig`;
const future = Math.floor(Date.now() / 1000) + 3600;

test("PKCE challenge matches RFC 7636 appendix B example", async () => {
  assert.equal(await challengeFor("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"), "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
});

test("PKCE verifier uses the unreserved set and the requested length", () => {
  const v = createVerifier(64);
  assert.equal(v.length, 64);
  assert.match(v, /^[A-Za-z0-9\-._~]+$/);
  assert.throws(() => createVerifier(10));
});

test("Gate admits a TownHall-style admin token", () => {
  const d = evaluate(readClaims(jwt({ sub: "drew", role: "admin", exp: future })));
  assert.deepEqual(d.levels, ["admin"]);
  assert.equal(mayEnterManagementCenter(d).allowed, true);
});

test("Gate refuses non-admin, expired, and per-location viewer tokens", () => {
  assert.equal(mayEnterManagementCenter(evaluate(readClaims(jwt({ sub: "a", roles: ["viewer"], exp: future })))).allowed, false);
  assert.equal(mayEnterManagementCenter(evaluate(readClaims(jwt({ sub: "a", role: "admin", exp: 10 })))).allowed, false);
  // Per-location grant overrides platform-wide level.
  const scoped = evaluate(readClaims(jwt({ sub: "a", role: "admin", permissions: { "management-center": ["viewer"] }, exp: future })));
  assert.equal(mayEnterManagementCenter(scoped).allowed, false);
});

test("Gate accepts a per-location admin grant", () => {
  const d = evaluate(readClaims(jwt({ sub: "a", roles: ["viewer"], permissions: { "Management-Center": "Admin" }, exp: future })));
  assert.equal(mayEnterManagementCenter(d).allowed, true);
});

test("readClaims rejects non-JWT input", () => {
  assert.throws(() => readClaims("not-a-token"));
});

test("authorize URL carries PKCE S256, state and nonce", () => {
  const url = new URL(buildAuthorizeUrl({
    authorizationEndpoint: "http://127.0.0.1:8005/oauth/authorize",
    clientId: "management-center",
    redirectUri: "http://127.0.0.1:50123/callback",
    scope: "openid roles",
    state: "s1",
    nonce: "n1",
    codeChallenge: "c1",
  }));
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("state"), "s1");
  assert.equal(url.searchParams.get("nonce"), "n1");
});

test("Gate refuses a token with no exp, and one that expires after sign-in", () => {
  const noExp = evaluate(readClaims(jwt({ sub: "a", role: "admin" })));
  assert.equal(mayEnterManagementCenter(noExp).allowed, false);
  assert.match(mayEnterManagementCenter(noExp).reason, /no expiry/);
  // Evaluated at sign-in while valid, then checked again after exp has passed.
  const d = evaluate(readClaims(jwt({ sub: "a", role: "admin", exp: 1000 })), 900);
  assert.equal(d.expired, false);
  assert.equal(mayEnterManagementCenter(d, 999).allowed, true);
  assert.equal(mayEnterManagementCenter(d, 1000).allowed, false);
});

test("callback parsing enforces state and surfaces issuer errors", () => {
  assert.equal(parseCallback("?code=abc&state=s1", "s1"), "abc");
  assert.throws(() => parseCallback("?code=abc&state=evil", "s1"), /state/);
  assert.throws(() => parseCallback("?error=access_denied&state=s1", "s1"), /access_denied/);
});
