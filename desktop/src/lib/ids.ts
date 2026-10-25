/**
 * Reference numbers that tie everything back to a Location.
 *
 * PROVISIONAL formats (Drew to confirm). Drew's scheme, 2026-10-25:
 *   PRN  project reference number
 *   PID  product produced by a completed project
 *   SID  service produced by a completed project
 *   AIRN AI created inside a project
 *   INC / SR / CHG / PRB  Service Management tickets
 *   EPIC / STORY / BUG / DEBT  Agile items
 *
 * Known clash: the existing platform docs already use PID for a Location
 * (e.g. PID-INF) and SID for an agent (e.g. SID-INF-01). Until that is
 * settled, `classify` reports both meanings for PID/SID rather than guessing.
 */

export type RefKind =
  | "project"
  | "product-or-location"
  | "service-or-agent"
  | "ai"
  | "incident"
  | "service-request"
  | "change"
  | "problem"
  | "epic"
  | "story"
  | "bug"
  | "tech-debt";

const PATTERNS: [RefKind, RegExp][] = [
  ["project", /^PRN-\d{4,}$/],
  ["ai", /^AIRN-\d{4,}$/],
  ["product-or-location", /^PID-[A-Z0-9]+(?:-\d+)?$/],
  ["service-or-agent", /^SID-[A-Z0-9]+(?:-\d+)?$/],
  ["incident", /^INC-\d{4,}$/],
  ["service-request", /^SR-\d{4,}$/],
  ["change", /^CHG-\d{4,}$/],
  ["problem", /^PRB-\d{4,}$/],
  ["epic", /^EPIC-\d{4,}$/],
  ["story", /^STORY-\d{4,}$/],
  ["bug", /^BUG-\d{4,}$/],
  ["tech-debt", /^DEBT-\d{4,}$/],
];

export function classify(ref: string): RefKind | null {
  const value = ref.trim().toUpperCase();
  for (const [kind, pattern] of PATTERNS) if (pattern.test(value)) return kind;
  return null;
}

/** Formats a sequence number, e.g. formatRef("PRN", 42) -> "PRN-0042". */
export function formatRef(prefix: "PRN" | "AIRN" | "INC" | "SR" | "CHG" | "PRB" | "EPIC" | "STORY" | "BUG" | "DEBT", n: number): string {
  if (!Number.isInteger(n) || n < 1) throw new RangeError("Reference numbers start at 1.");
  return `${prefix}-${String(n).padStart(4, "0")}`;
}
