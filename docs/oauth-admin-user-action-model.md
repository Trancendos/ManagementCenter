# OAuth admin and user action model

**Status:** proposed  
**Version:** 0.1.0  
**Applies to:** ManagementCenter governance control plane

## Decision

ManagementCenter has two deliberately separate surfaces:

1. **Administration** configures ManagementCenter policy and integrations. It does not initiate Tranc3 delivery actions.
2. **Delivery workspace** lets an authenticated user perform permitted, attributable actions through their own OAuth grant.

A separate GitHub App remains read-only and installation-scoped to receive repository events and reconcile repository facts. OAuth is used for user-initiated actions, not for organisation-wide event ingestion.

## Administration surface

Administrators can manage:

- OAuth provider configuration and allowed callback origins
- repository allowlist and GitHub App installation boundary
- roles, permission policies, action limits and approval rules
- evidence retention, data classification, audit retention and access reviews
- automation proposal rules and emergency disable switch

Administrators cannot use this surface to create Tranc3 branches, pull requests, comments, labels, releases, merges, workflow changes, secret changes, or direct commits. This removes a high-privilege bypass path.

## Delivery workspace

A user explicitly connects their GitHub account through OAuth, selects an allowed repository, and performs an action within their granted GitHub permissions and ManagementCenter policy.

Initial allowed user actions:

- view repository, pull request, issue, check and release facts
- create/update governed requirements, scope versions, artefacts and evidence
- draft a branch-scoped pull-request proposal
- create a branch under `management-center/<user>/<work-item>/`
- create a pull request, comment, or label only after policy evaluation and recorded evidence

Always denied:

- direct writes to protected branches
- merge, delete, repository settings, secret access, workflow mutation and release publication

## Authorization model

Authorization is enforced server-side for every mutation:

```text
OAuth identity -> internal user -> role bindings -> policy evaluation
              -> repository allowlist -> GitHub token scope check
              -> approval check -> idempotent execution -> audit event
```

- Do not rely on a client-side role flag.
- Tokens are encrypted server-side; never return them to the browser or audit logs.
- Use minimally scoped grants and refresh/revoke handling. Require re-consent when scopes expand.
- Record the GitHub actor, internal actor, requested action, evaluated policy, evidence references, resulting source URL, timestamp and correlation ID.
- Users cannot approve their own scope exception or security-sensitive action.

## Core records

| Entity | Key fields |
| --- | --- |
| `users` | provider subject, display name, status |
| `oauth_connections` | user_id, provider, provider_subject, encrypted credential reference, scopes, expires_at, revoked_at |
| `roles` | key, description |
| `role_bindings` | user_id, role_id, repository_id, granted_by, expires_at |
| `action_requests` | actor_id, repository_id, action_type, payload_hash, policy_result, status, idempotency_key |
| `approvals` | action_request_id, approver_id, decision, rationale, decided_at |
| `audit_events` | actor, action, object, policy result, source URL, correlation ID, timestamp |

## Component design and accessibility

| Component | Visual/interaction specification | Accessibility |
| --- | --- | --- |
| Connection card | provider identity, allowed scopes, repository allowlist, expiry and revoke action | semantic status; revoke has explicit confirmation and focus return |
| Role matrix | policy table by role and repository; no implied permissions | table headings and row labels; text equivalents for allow/deny |
| Action review | source repository, proposed action, required evidence, policy decision, approval state | keyboard-operable; `aria-describedby` ties errors to missing evidence |
| Admin policy editor | versioned policy form with diff preview and publish approval | field labels, inline validation, change summary before commit |

## Wireframes

```text
Admin
+ Settings +---------------- OAuth and policy ----------------+
| Providers | GitHub OAuth     [configured]                    |
| Roles     | Allowed repos    [ManagementCenter] [Tranc3]      |
| Policies  | Admin actions    configuration only               |
| Audit     | Policy version   v0.1 [view diff] [publish]       |
+-----------+---------------------------------------------------+

Delivery workspace
+ Workspace +------------------- Tranc3 ------------------------+
| Work       | Connected as: GitHub identity [manage connection]|
| Evidence   | Requested action: create PR proposal             |
| Repos      | Policy: allowed  Evidence: complete              |
|            | [Submit for approval]                            |
+------------+--------------------------------------------------+
```

## Stories added to the delivery backlog

### MC-00 — OAuth and role baseline
**Story:** As a user, I need to connect my GitHub identity and see my effective permissions, so that actions are accurately attributed and bounded.

**Acceptance criteria:**
- OAuth connection uses authorization-code flow with PKCE and state validation.
- Tokens are encrypted server-side, redacted from logs, revocable, and never browser-readable.
- Effective role, allowed repositories and denied actions are visible to the user.
- Server-side tests deny mutations when role, repository, OAuth scope, policy, or approval is absent.
- Connection/revocation and failed authorization attempts have immutable audit records.

### MC-00A — Administration policy surface
**Story:** As an administrator, I need to configure roles, allowlists and policies without gaining a hidden Tranc3 action path.

**Acceptance criteria:**
- Admin routes require an explicit administrator role server-side.
- Policy changes are versioned, diffable, approved and audited.
- The administration surface exposes no executable Tranc3 mutation action.
- Accessibility requirements above are validated by automated and manual keyboard checks.

## Dependencies and validation

- OAuth application registration, approved callback URLs, key rotation and consent-screen policy.
- Server-side encrypted credential store and key-management decision.
- Postgres migrations for the listed records; backup/restore procedure.
- Threat model covering token theft, CSRF, confused-deputy, privilege escalation, replay and audit tampering.
- Tests for PKCE/state validation, token redaction, revocation, role enforcement, repository isolation and approval separation.

## Code-change ledger

No application code changed. This document was created at 2026-09-11T06:14:27Z. It adds the OAuth/admin-user design baseline for future implementation. Validation: editorial review pending. Rollback: revert this documentation-only commit.
