/**
 * Infinity Gate: the navigator that decides where a signed-in person may go.
 *
 * The Gate reads the rights carried in the Infinity-One token and lists the
 * levels the person holds. The Management Center is an Admin-only location.
 *
 * IMPORTANT: this client-side check only decides what the UI offers. It does
 * not verify the token signature; every service (Stage Gates, CMDB) must and
 * does verify the token itself before acting on it.
 */

export type RightsLevel = "admin" | "editor" | "viewer" | (string & {});

export interface TokenClaims {
  sub?: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  iss?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  role?: string;
  roles?: unknown;
  groups?: unknown;
  /** Per-location permissions from Infinity-One, e.g. {"management-center": ["admin"]}. */
  permissions?: unknown;
  [key: string]: unknown;
}

export interface GateDecision {
  identity: string;
  levels: RightsLevel[];
  expired: boolean;
  expiresAt: number | null;
  /** Locations the person may enter, keyed by location slug. */
  locations: Record<string, RightsLevel[]>;
}

export const MANAGEMENT_CENTER = "management-center";
export const REQUIRED_LEVEL: RightsLevel = "admin";

function decodeSegment(segment: string): unknown {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(segment.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

/** Reads a JWT payload. Throws on anything that is not a three-part JWT with a JSON payload. */
export function readClaims(token: string): TokenClaims {
  const parts = token.trim().split(".");
  if (parts.length !== 3 || !parts[1]) throw new Error("Not a JWT: expected three dot-separated parts.");
  const payload = decodeSegment(parts[1]);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("The token payload is not a JSON object.");
  }
  return payload as TokenClaims;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return value ? [value] : [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string" && v.length > 0);
  return [];
}

function normalise(level: string): RightsLevel {
  return level.trim().toLowerCase();
}

export function evaluate(claims: TokenClaims, nowSeconds = Math.floor(Date.now() / 1000)): GateDecision {
  // Platform-wide levels: TownHall tokens use `role`, OIDC providers commonly use `roles` or `groups`.
  const levels = [...new Set([...strings(claims.role), ...strings(claims.roles), ...strings(claims.groups)].map(normalise))];

  const locations: Record<string, RightsLevel[]> = {};
  if (claims.permissions && typeof claims.permissions === "object" && !Array.isArray(claims.permissions)) {
    for (const [slug, value] of Object.entries(claims.permissions as Record<string, unknown>)) {
      const granted = strings(value).map(normalise);
      if (granted.length) locations[slug.toLowerCase()] = granted;
    }
  }

  const expiresAt = typeof claims.exp === "number" ? claims.exp : null;
  return {
    identity: claims.preferred_username ?? claims.email ?? claims.name ?? claims.sub ?? "unknown",
    levels,
    expired: expiresAt !== null && expiresAt <= nowSeconds,
    expiresAt,
    locations,
  };
}

/** The levels this person holds for one location: per-location grants win, else platform-wide levels. */
export function levelsFor(decision: GateDecision, location: string): RightsLevel[] {
  return decision.locations[location.toLowerCase()] ?? decision.levels;
}

export function mayEnterManagementCenter(decision: GateDecision): { allowed: boolean; reason: string } {
  if (decision.expired) return { allowed: false, reason: "Your Infinity session has expired. Sign in again." };
  if (!levelsFor(decision, MANAGEMENT_CENTER).includes(REQUIRED_LEVEL)) {
    return {
      allowed: false,
      reason: "The Management Center only opens for the Admin level. Ask an Infinity-One administrator for access.",
    };
  }
  return { allowed: true, reason: "Admin level confirmed." };
}
