/**
 * Read-only client for the Atlas CMDB (Trancendos CMDB v1.0.0), shown inside
 * the Service Management Center.
 *
 * The CMDB uses its own session cookie (POST /api/login) and does not accept
 * Infinity tokens yet, so the Management Center asks for a CMDB account once
 * per session and never stores the password. The cookie is held by the Tauri
 * HTTP plugin's cookie jar, not by JavaScript.
 */

import { requestJson, type FetchLike } from "../http.ts";

export type ItemKind =
  | "application"
  | "location"
  | "ai"
  | "database"
  | "network"
  | "microservice"
  | "nanoservice"
  | "entity"
  | "document"
  | "job"
  | "service"
  | "external";

export interface CmdbItem {
  id: string;
  name: string;
  kind: ItemKind;
  subtype: string;
  description: string;
  owner: string;
  team: string;
  environment: string;
  lifecycle: string;
  criticality: "critical" | "high" | "medium" | "low";
  tags: string[];
  metadata: Record<string, unknown>;
  version: number;
  updated_at: string;
}

export interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  kind: string;
  label: string;
  protocol: string;
  port: number | null;
}

export interface Finding {
  id: string;
  item_id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "open" | "in_progress" | "accepted" | "resolved";
  cvss: number | null;
  reference: string;
}

export interface Page<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface CmdbUser {
  username: string;
  role: string;
}

/** A Location's network view: every link that carries a port or protocol. */
export interface NetworkLink {
  direction: "outbound" | "inbound";
  peerId: string;
  protocol: string;
  port: number | null;
  kind: string;
  label: string;
}

export class CmdbClient {
  private readonly baseUrl: string;
  private readonly fetchImpl?: FetchLike;

  constructor(baseUrl: string, fetchImpl?: FetchLike) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.fetchImpl = fetchImpl;
  }

  private call<T>(path: string, method: "GET" | "POST" = "GET", body?: unknown, headers: Record<string, string> = {}): Promise<T> {
    return requestJson<T>({ service: "CMDB", url: `${this.baseUrl}/api${path}`, method, body, headers, fetchImpl: this.fetchImpl });
  }

  health(): Promise<{ status: string; version: string }> {
    return this.call("/health");
  }

  session(): Promise<{ user: CmdbUser; csrf: string }> {
    return this.call("/session");
  }

  /** The CMDB refuses cross-origin writes, so the login request names the CMDB's own origin. */
  login(username: string, password: string, origin: string): Promise<{ user: CmdbUser; csrf: string }> {
    return this.call("/login", "POST", { username, password }, { Origin: origin.replace(/\/+$/, "") });
  }

  locations(q = "", offset = 0): Promise<Page<CmdbItem>> {
    const params = new URLSearchParams({ kind: "location", limit: "200", offset: String(offset) });
    if (q) params.set("q", q);
    return this.call(`/items?${params.toString()}`);
  }

  item(id: string): Promise<CmdbItem> {
    return this.call(`/items/${encodeURIComponent(id)}`);
  }

  relationships(itemId: string): Promise<Page<Relationship>> {
    return this.call(`/relationships?item_id=${encodeURIComponent(itemId)}&limit=200`);
  }

  findings(itemId: string): Promise<Page<Finding>> {
    return this.call(`/findings?item_id=${encodeURIComponent(itemId)}&limit=200`);
  }
}

export function networkView(itemId: string, relationships: Relationship[]): NetworkLink[] {
  return relationships
    .filter((r) => r.port !== null || (r.protocol ?? "") !== "")
    .map((r) => ({
      direction: r.source_id === itemId ? ("outbound" as const) : ("inbound" as const),
      peerId: r.source_id === itemId ? r.target_id : r.source_id,
      protocol: r.protocol || "unspecified",
      port: r.port,
      kind: r.kind,
      label: r.label,
    }))
    .sort((a, b) => (a.port ?? 99999) - (b.port ?? 99999));
}
