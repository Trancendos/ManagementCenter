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
  /** Per-location permissions, e.g. {"management-center": ["admin"]}. Kept for older tokens. */
  permissions?: unknown;
  /** Infinity-One extension claims. `ext.rights` maps a location slug to its level, e.g. {"management-center": "admin"}. */
  ext?: { rights?: unknown; [key: string]: unknown };
  [key: string]: unknown;
}

export interface GateDecision {
  identity: string;
  levels: RightsLevel[];
  expired: boolean;
  expiresAt: number | null;
  /** Locations the person may enter, keyed by location slug. */
  locations: Record<string, RightsLevel[]>;
  /**
   * True when the token carries Infinity-One `ext.rights`. Those rights are then the only
   * source for location access: a location missing from them is refused, with no fall back
   * to platform-wide roles.
   */
  rightsAuthoritative: boolean;
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
  const merge = (source: unknown) => {
    if (!source || typeof source !== "object" || Array.isArray(source)) return false;
    for (const [slug, value] of Object.entries(source as Record<string, unknown>)) {
      const granted = strings(value).map(normalise);
      if (granted.length) locations[slug.toLowerCase()] = granted;
    }
    return true;
  };
  merge(claims.permissions);
  // Infinity-One rights go last so they win over the older `permissions` claim.
  const rightsAuthoritative = merge(claims.ext?.rights);

  const expiresAt = typeof claims.exp === "number" ? claims.exp : null;
  return {
    identity: claims.preferred_username ?? claims.email ?? claims.name ?? claims.sub ?? "unknown",
    levels,
    // A token without a numeric `exp` never expires, so the Gate does not accept it.
    expired: expiresAt === null || expiresAt <= nowSeconds,
    expiresAt,
    locations,
    rightsAuthoritative,
  };
}

/**
 * The levels this person holds for one location: per-location grants win, else platform-wide levels.
 * When the token carries Infinity-One `ext.rights`, a location missing from them gets no levels.
 */
export function levelsFor(decision: GateDecision, location: string): RightsLevel[] {
  const granted = decision.locations[location.toLowerCase()];
  if (granted) return granted;
  return decision.rightsAuthoritative ? [] : decision.levels;
}

/** True once the token has passed its `exp`, checked against the clock now, not only at sign-in. */
export function isExpired(decision: GateDecision, nowSeconds = Math.floor(Date.now() / 1000)): boolean {
  return decision.expired || decision.expiresAt === null || decision.expiresAt <= nowSeconds;
}

export function mayEnterManagementCenter(
  decision: GateDecision,
  nowSeconds = Math.floor(Date.now() / 1000),
): { allowed: boolean; reason: string } {
  if (decision.expiresAt === null) {
    return { allowed: false, reason: "This token has no expiry time (exp), so the Gate cannot accept it." };
  }
  if (isExpired(decision, nowSeconds)) return { allowed: false, reason: "Your Infinity session has expired. Sign in again." };
  if (!levelsFor(decision, MANAGEMENT_CENTER).includes(REQUIRED_LEVEL)) {
    return {
      allowed: false,
      reason: "The Management Center only opens for the Admin level. Ask an Infinity-One administrator for access.",
    };
  }
  return { allowed: true, reason: "Admin level confirmed." };
}
