# Vercel and multi-repository governance topology

**Status:** proposed  
**Version:** 0.1.0  
**Date:** 2026-09-11  
**Applies to:** ManagementCenter, Tranc3, CranBania, Magna-Carta, InfinityStyles

## Decision

Host ManagementCenter on Vercel as a serverless governance control plane. It coordinates delivery evidence across registered repositories; it does not become a product runtime, privileged deployment tool, or unbounded background worker.

The initial portfolio contains:

| Repository | Declared domain | ManagementCenter role |
| --- | --- | --- |
| `Trancendos/Tranc3` | product/platform | code, pull-request, CI and release evidence source |
| `Trancendos/CranBania` | Kanban board | work-management and workflow evidence source |
| `Trancendos/Magna-Carta` | foundation-document framework | requirements, policy and knowledge artefact source |
| `Trancendos/InfinityStyles` | design system | component, styling, accessibility and UI artefact source |
| `Trancendos/ManagementCenter` | governance control plane | portfolio correlation, policy, approvals and evidence system of record |

The declared domains are not proof of executable interfaces. Each integration remains read-only until its repository interface, data classifications and acceptance evidence are validated.

## Vercel topology

```text
Browser
  |
  v
Vercel: ManagementCenter UI and server endpoints
  |-- OAuth / GitHub App authorization callback
  |-- webhook receiver: authenticate -> persist -> enqueue -> 2xx
  |-- policy and approval APIs
  |
  +---------------------> Postgres
  |                         repositories, relationships, evidence,
  |                         OAuth references, policy versions, audit events,
  |                         idempotency keys and sync cursors
  |
  +---------------------> Vercel Queue / Workflow
  |                         event enrichment, correlation, retries,
  |                         bounded reconciliation and proposal generation
  |
  +---------------------> Vercel Cron
                            missed-event reconciliation and freshness checks

GitHub App (installation token): read-only event/snapshot collection
GitHub user authorization: attributable, policy-gated user actions (later)
```

## Runtime boundaries

- Functions authenticate webhooks, perform transactional writes and enqueue work. They must not conduct long reconciliation, bulk imports, migrations or autonomous repairs inline.
- Queue/workflow consumers are idempotent, bounded, observable and retry-limited. Persist retry exhaustion/poison events in Postgres because remediation needs evidence.
- Cron jobs run in UTC and can overlap or duplicate. Acquire a database lease and use a per-repository/resource cursor before work begins.
- Vercel hosts compute. Postgres provides durable state, locking, append-only audit records, backup/restore evidence and retention controls.
- All credentials remain server-only environment configuration. Never expose secrets through browser-visible variables, logs, task payloads or evidence records.

## Portfolio relationship model

ManagementCenter stores relationships as explicit, versioned edges rather than assumed hierarchy.

```text
Magna-Carta --[governs / specifies]--> requirement or policy
CranBania  --[plans / tracks]--------> work item
InfinityStyles --[implements design]--> component evidence
Tranc3 --[implements / validates]----> pull request, commit, check, release
ManagementCenter --[correlates]------> all artefacts and decisions
```

Supported edge types initially:

- `governs`, `specifies`, `depends_on`, `implements`, `designs`, `tracks`
- `validates`, `releases`, `supersedes`, `blocks`, `duplicates`

Every edge records source, creator, rationale, scope version, timestamp and verification status. A relation discovered from GitHub is a candidate until a human verifies it or an agreed deterministic rule proves it.

## Portfolio onboarding protocol

For each repository:

1. Register owner/name/default branch and data classification.
2. Create read-only GitHub App allowlist entry and event subscriptions.
3. Capture baseline: commit, open work, open PRs, checks, releases, owners, licences and deployment references.
4. Define its source contract: authoritative objects, identifiers, inbound events, read cadence, evidence types and non-goals.
5. Map at least one end-to-end trace: Magna-Carta requirement -> CranBania work -> InfinityStyles component artefact -> Tranc3 implementation -> check/release evidence.
6. Run replay, duplicate-delivery, access-denial and recovery validation before enabling user proposals.

## Policy additions

1. A cross-repository delivery item is incomplete until all applicable source artefacts and relationships are recorded or an approved exception exists.
2. ManagementCenter highlights inconsistent scope, version, component or release relationships; it does not silently reconcile them.
3. UI work requires InfinityStyles evidence for intended component, visual tokens, interaction states and ARIA behaviour before Tranc3 implementation begins.
4. Requirement or policy changes originating in Magna-Carta require a new scope version and affected-delivery impact review.
5. CranBania work state may inform ManagementCenter but cannot by itself satisfy implementation, validation or release evidence.
6. All registered repositories are denied mutation by default. Any later user action remains limited by OAuth identity, repository allowlist, policy, approval and audit trail.

## Delivery backlog additions

### MC-02A — Register the portfolio
**Story:** As a delivery lead, I need to register the four interdependent repositories with source contracts so delivery evidence can be correlated safely.

**Acceptance criteria:**
- Each repository has an owner, purpose, default branch, classification, source contract and allowlist record.
- Repository relationships are explicit, versioned and auditable.
- The system renders relationship candidates distinctly from verified relationships.
- Read-only ingestion cannot mutate any registered repository.

### MC-03A — Cross-repository traceability
**Story:** As a reviewer, I need to trace a requirement through CranBania, InfinityStyles and Tranc3 so I can evaluate delivery readiness across the portfolio.

**Acceptance criteria:**
- A trace links requirement, scope version, work item, design artefact, implementation, checks and release evidence.
- The UI provides both graph and accessible tabular relationship views.
- Missing, stale and conflicting evidence has textual explanation and source links.
- No relationship is inferred as verified without source evidence or explicit approval.

### MC-06 — Vercel operations and resilience
**Story:** As an operator, I need a bounded, observable Vercel deployment model so control-plane processing remains reliable and auditable.

**Acceptance criteria:**
- Webhook ingestion persists and acknowledges delivery before asynchronous processing.
- Queue, reconciliation and cron operations have idempotency, bounded retries, lease/lock control and failure evidence.
- Database backup/restore, audit retention, access review and incident procedures are documented and tested.
- Monitoring covers event lag, replay failures, queue retry exhaustion, token failures and stale portfolio data.

## Research tracks

| Track | Question | Deliverable |
| --- | --- | --- |
| Repository contracts | What real interfaces and shared identifiers exist across the four repositories? | verified integration map and data classification |
| Identity and access | Is GitHub App user authorization or a separate OAuth App the best supported user-action model? | ADR, threat model and permission matrix |
| Vercel resilience | Which queues/workflows, database region, backup and observability settings meet the required recovery evidence? | topology, runbook, RPO/RTO proposal and validation plan |
| Traceability | What minimum record/edge model traces a requirement to a rollback without duplicate data ownership? | schema and representative end-to-end trace |
| Design governance | How should InfinityStyles component contracts, visual tokens and ARIA evidence gate Tranc3 UI work? | component contract template and accessibility test plan |
| Automation safety | Which recurring evidence gaps can be detected or proposed without unsafe autonomous mutations? | allow/deny catalogue, approval workflow and rollback criteria |

## Code-change ledger

No application code changed. This document was created at 2026-09-11T06:27:51Z. It adds Vercel topology, portfolio onboarding, relationship controls and delivery stories MC-02A, MC-03A and MC-06. Validation: editorial review pending. Rollback: revert this documentation-only commit.
