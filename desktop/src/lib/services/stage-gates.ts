/**
 * Read-only client for SVC-TWH-05 Stage Gates, shown as Project Management > Gates.
 *
 * Types mirror the service JSON (townhall-stage-gates v1.0.0, engine.py
 * `to_dict`), copied from its mobile client. Writes (evidence, waivers,
 * advance, sign-off certificates) are deliberately left out of this first
 * read-only release.
 */

import { requestJson, type FetchLike } from "../http.ts";

export type Stage = "concept" | "initiation" | "design" | "build" | "validation" | "release" | "closed";
export type DeliverableKind =
  | "game"
  | "application"
  | "image"
  | "video"
  | "design_system"
  | "module"
  | "template"
  | "document";
export type Outcome = "pass" | "fail" | "pending";

export const STAGE_ORDER: readonly Stage[] = ["concept", "initiation", "design", "build", "validation", "release", "closed"];

export interface Criterion {
  id: string;
  stage: Stage;
  evidence_kind: string;
  description: string;
  supplied_by: string;
  applies_to: DeliverableKind[];
  mandatory: boolean;
}

export interface Evidence {
  id: string;
  deliverable_id: string;
  criterion_id: string;
  outcome: Outcome;
  reference: string;
  recorded_by: string;
  recorded_at: number;
  detail: string;
}

export interface Waiver {
  criterion_id: string;
  reason: string;
  approver: string;
  waived_at: number;
  expires_at: number | null;
  state: "active" | "expired" | "revoked" | "legacy-inactive";
}

export interface CriterionStatus {
  criterion: Criterion;
  satisfied: boolean;
  waived: boolean;
  evidence: Evidence | null;
  waiver: Waiver | null;
}

export interface GateStatus {
  deliverable_id: string;
  stage: Stage;
  can_advance: boolean;
  unmet: string[];
  criteria: CriterionStatus[];
}

export interface Deliverable {
  id: string;
  title: string;
  kind: DeliverableKind;
  /** The Location (CMDB item name) this deliverable belongs to. */
  location: string;
  stage: Stage;
  requested_by: string;
  created_at: number;
}

export interface DeliverableWithGate extends Deliverable {
  gate: GateStatus;
}

/** One passed or waived gate: the basis of a per-gate sign-off certificate. */
export interface GateDecisionRecord {
  id: string;
  stage: Stage;
  decision: "passed" | "waived";
  approver: string;
  decided_at: number;
  waived_criteria: string[];
}

export interface Health {
  service: string;
  version: string;
  mode: "local" | "offline" | "web";
  writes_enabled: boolean;
}

export class StageGatesClient {
  private readonly baseUrl: string;
  private readonly token: string | null;
  private readonly fetchImpl?: FetchLike;

  constructor(baseUrl: string, token: string | null, fetchImpl?: FetchLike) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
    this.fetchImpl = fetchImpl;
  }

  private get<T>(path: string): Promise<T> {
    return requestJson<T>({
      service: "Stage Gates",
      url: `${this.baseUrl}${path}`,
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
      fetchImpl: this.fetchImpl,
    });
  }

  health(): Promise<Health> {
    return this.get("/v1/health");
  }

  listDeliverables(stage?: Stage): Promise<Deliverable[]> {
    return this.get(`/townhall/plm/deliverables${stage ? `?stage=${encodeURIComponent(stage)}` : ""}`);
  }

  getDeliverable(id: string): Promise<DeliverableWithGate> {
    return this.get(`/townhall/plm/deliverables/${encodeURIComponent(id)}`);
  }

  history(id: string): Promise<GateDecisionRecord[]> {
    return this.get(`/townhall/plm/deliverables/${encodeURIComponent(id)}/history`);
  }

  verifyLedger(): Promise<{ ok: boolean; [key: string]: unknown }> {
    return this.get("/v1/ledger/verify");
  }
}

/** Index of a stage in the gate sequence, for progress display. */
export function stageProgress(stage: Stage): { index: number; total: number } {
  return { index: STAGE_ORDER.indexOf(stage), total: STAGE_ORDER.length - 1 };
}
