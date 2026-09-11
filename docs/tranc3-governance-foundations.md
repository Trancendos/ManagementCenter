# Tranc3 governance control plane — foundation design

**Status:** proposed  
**Version:** 0.1.0  
**Scope:** ManagementCenter governs delivery evidence and GitHub-derived lifecycle data for Tranc3. Tranc3 remains the product repository.

## Problem and outcome

ManagementCenter currently presents simulated Tranc3 delivery data and local-only Kanban state. It cannot safely provide traceability, evidence collection, or automation against the real repository.

The target is a governed, read-first control plane that links a requirement to its scope version, delivery work, GitHub evidence, approval, release candidate, and rollback record. It must make missing evidence visible without autonomously changing Tranc3.

## Non-goals

- No direct push, merge, deletion, workflow mutation, secrets access, or release publication.
- No automatic production repair, migration, or rollback.
- No replacement of GitHub as the source for code, commits, pull requests, checks, or releases.
- No claim that zero-cost includes infrastructure, energy, licences, or operational labour.

## Roles and decisions

| Role | May do | Must not do |
| --- | --- | --- |
| Delivery lead | approve scope, evidence exceptions, release readiness | bypass immutable audit trail |
| Contributor | create/update requirements and artefacts | approve their own exception |
| ManagementCenter service | ingest and correlate source events; calculate gaps | write to Tranc3 in phase 1 |
| Automation service, later phase | propose comments, labels, checks and bot branches | merge, alter `main`, alter workflows/secrets, publish releases |

## Architecture

```text
GitHub App/webhooks + reconciliation poller
                  |
                  v
          ingestion boundary
  signature validation, idempotency, cursor
                  |
                  v
       append-only event and snapshot store
                  |
                  +--> traceability graph
                  |     requirement -> scope -> work -> PR -> commit -> check -> release
                  |
                  +--> policy evaluator
                  |     evidence gaps, stale records, duplicate candidates
                  |
                  v
     ManagementCenter UI + approval workflow
                  |
                  v
      human-approved, bounded proposals (later)
```

- **Source boundaries:** GitHub is authoritative for repository events; ManagementCenter is authoritative for delivery evidence and approval records.
- **Reliability:** webhook delivery is at-least-once. Store the delivery ID and event hash, process idempotently, and reconcile using a per-repository cursor.
- **Integrity:** preserve source URL, source ID, payload hash, observed timestamp, actor, and ingestion timestamp. Never overwrite an evidence record; supersede it with a new version.
- **Data protection:** GitHub App private key and webhook secret are server-only. Encrypt managed secrets; redact them from audit logs.

## Initial GitHub App permission boundary

| Capability | Phase 1 | Later, approval-gated |
| --- | --- | --- |
| Repository metadata, contents, issues, PRs, checks, actions, releases | read | read |
| Webhooks: push, pull request, check, workflow, release | receive | receive |
| Issue/PR comments and labels | none | write |
| Checks/statuses | none | write |
| Bot branches and PRs | none | create under `management-center/` only |
| Direct `main` writes, merge, deletion, settings, secrets, workflows, releases | deny | deny |

## Data model

All tables have `id`, `created_at`, `updated_at`, `created_by`; lifecycle records additionally have `version` and immutable audit linkage.

| Entity | Key fields | Purpose |
| --- | --- | --- |
| `repositories` | provider, owner, name, installation_id, default_branch | controlled repository registration |
| `requirements` | key, title, statement, status, owner | durable requirement baseline |
| `scope_versions` | requirement_id, version, rationale, approved_by, approved_at | controlled scope history |
| `work_items` | provider_ref, title, state, source_url | normalized GitHub/Linear work references |
| `artefacts` | type, version, URL, checksum, status | design, topology, data, accessibility, policy and knowledge artefacts |
| `evidence_records` | category, source_url, checksum, observed_at, verifier, result | test, CI, security, approval and rollback evidence |
| `delivery_links` | from_type/id, to_type/id, relation_type | traceability graph edges |
| `github_events` | repository_id, delivery_id, event_type, payload_hash, received_at | append-only inbound event ledger |
| `sync_cursors` | repository_id, resource, cursor, reconciled_at | replay-safe reconciliation |
| `pull_request_snapshots` | provider_ref, head_sha, base_sha, state, checks_summary | point-in-time review evidence |
| `release_candidates` | version, commit_sha, readiness, approved_by | controlled promotion record |
| `audit_events` | actor, action, object_type/id, rationale, correlation_id | append-only accountability |

Relationships are versioned and append-only. Enforce source uniqueness on `(provider, owner, name)`, event uniqueness on `(repository_id, delivery_id)`, and snapshot uniqueness on `(provider_ref, head_sha, observed_at)`.

## UI component isolation

Each component is independently shippable and must have visual and interaction evidence before code.

| Component | Visual design | Behaviour | Accessibility |
| --- | --- | --- | --- |
| Evidence-gap banner | restrained amber/red severity strip; count plus filtered action | opens pre-filtered gap list | `role=status`; concise live update; non-colour severity text |
| Traceability graph | dark neutral canvas; labelled directional links; detail side panel | keyboard-selectable nodes; filter by relationship | list/table alternative; focus visible; graph not sole information channel |
| Evidence record panel | compact metadata card with source link, checksum, result | append correction/supersession only | semantic headings; copy controls labelled |
| Approval dialog | explicit scope, source evidence, action and rollback | confirm requires typed rationale for exceptions | focus trap, Escape closes, clear error association |
| Automation proposal | read-only diff summary with allow/deny explanation | approve creates proposal only, never merge | status communicated in text; no time-limited controls |

Wireframe (desktop):

```text
+ Sidebar +------------------------------- Delivery workspace ---------------------------+
| Repos   | [Tranc3] [Fresh: 2m] [Read-only]                                            |
| Work    | [Evidence gaps: 7] [Open PRs: n] [Release readiness: blocked]               |
| Evidence+----------------------+-------------------------+-----------------------------+
| Policy  | Requirement / scope  | Traceability graph      | Selected evidence           |
| Audit   | version history      | requirement -> PR -> CI | source, hash, timestamp     |
|         | acceptance criteria | graph/list toggle       | validation / supersession    |
+---------+----------------------+-------------------------+-----------------------------+
```

## Policy rules

1. A delivery item cannot be marked ready until it has a requirement, acceptance criteria, scoped design evidence, architecture/topology evidence, applicable data design, knowledge-base link, operational/ITIL details, validation evidence, version, and rollback detail.
2. UI work also requires component isolation, visual styling, interaction states, and ARIA evidence before implementation.
3. A release candidate is blocked if required checks fail, evidence is stale, the source commit differs, or required approval is missing.
4. Automation may identify and propose; a human must approve scope exceptions, security-sensitive work, migrations, promotion, and rollback.
5. Every completed implementation records created, removed, and replaced code with location, rationale, validation, version, timestamp, and rollback instructions.

## Agile delivery backlog

### MC-01 — Persist governed delivery records
**Story:** As a delivery lead, I need versioned requirements, scope, artefact and evidence records so Tranc3 work has a durable audit trail.

**Acceptance criteria:**
- Migrations create the core entities and uniqueness constraints in this design.
- Records are append-only; supersession is explicit and queryable.
- API/UI display source, verifier, timestamp, version and checksum.
- Tests prove duplicate webhook and evidence submissions are idempotent.

### MC-02 — Register Tranc3 as a read-only repository
**Story:** As a contributor, I need ManagementCenter to ingest Tranc3 repository facts without granting write access.

**Acceptance criteria:**
- GitHub App installation is restricted to ManagementCenter and Tranc3.
- Webhook signatures are validated and deliveries retained idempotently.
- A reconciliation job records cursor/freshness and recovers missed events.
- No write permissions are requested or used.

### MC-03 — Build traceability and evidence-gap views
**Story:** As a delivery lead, I need to see requirement-to-release lineage and missing evidence before approving work.

**Acceptance criteria:**
- Requirement, scope, work item, PR, commit, check and release relationships render as graph and accessible table.
- Gap rules link directly to the absent/failed evidence category.
- Components meet the defined keyboard, focus, textual-status and non-colour requirements.

### MC-04 — Introduce approval-gated automation proposals
**Story:** As a reviewer, I need automation to draft safe remediation proposals without making uncontrolled changes.

**Acceptance criteria:**
- Proposal actions are policy-evaluated, fully audited and idempotent.
- Initial writes are restricted to bot-prefixed branches and comments/labels/checks.
- Scope/security/migration/release/rollback actions require an explicit human approval record.
- No feature can merge or push to protected branches.

### MC-05 — Govern release readiness and rollback evidence
**Story:** As a release owner, I need a release candidate record that proves readiness and rollback before promotion.

**Acceptance criteria:**
- Candidate binds version and commit SHA to tests, SBOM/provenance references, approvals, deployment and health evidence.
- A source change or stale evidence invalidates readiness.
- Rollback target, trigger, owner and validation evidence are mandatory.

## Dependencies and decisions needed

- GitHub App registration, private key storage, webhook endpoint and verification secret.
- Postgres service for durable records; browser-local state is unsuitable as a system of record.
- Background job runner/queue with retries, dead-letter handling and observability.
- Branch protection and CODEOWNERS policy for ManagementCenter and Tranc3.
- Retention, privacy/data classification, backup/restore objectives and access review policy.
- Linear integration is optional and must be designed as an additional source boundary, not assumed.

## Validation plan

- Unit: policy rules, idempotency keys, scope/evidence versioning, permission-denial cases.
- Integration: signed webhook fixture, replay fixture, missed-event reconciliation, GitHub API failure/retry.
- Security: permission contract test, secret redaction test, authorization matrix test.
- Accessibility: keyboard/focus tests, automated accessibility scan, manual screen-reader pass for graph alternative and dialogs.
- Operations: backup/restore drill, reconciliation lag alert, audit-log integrity check, rollback simulation.

## Code-change ledger

No application code changed in this version. This design document was created at 2026-09-11T06:10:31Z as the baseline for MC-01 through MC-05. Validation: editorial review pending. Rollback: revert this documentation-only commit.
