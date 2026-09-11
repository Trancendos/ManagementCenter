//#region node_modules/.nitro/vite/services/ssr/assets/playbooks-_VSdmcGc.js
var PLAYBOOKS = [
	{
		id: "pr-autofix",
		title: "PR autofix (Ruff)",
		filename: ".github/workflows/pr-autofix.yml",
		summary: "Runs ruff --fix on Python PRs and commits back to the head branch so the merge gate never sees a dirty lint tree. Pin the action SHA before merge.",
		code: `name: PR autofix

on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - "**/*.py"
      - "pyproject.toml"

permissions:
  contents: write

jobs:
  ruff-autofix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.head_ref }}
          token: \${{ secrets.GITHUB_TOKEN }}

      - uses: astral-sh/ruff-action@v3
        with:
          version: "0.11.0"
          args: "check . --fix"

      - uses: astral-sh/ruff-action@v3
        with:
          version: "0.11.0"
          args: "format ."

      - name: Commit fixes if any
        run: |
          git config user.name "tranc3-immune"
          git config user.email "immune@trancendos.local"
          git add -A
          if git diff --cached --quiet; then
            echo "No autofix changes"
          else
            git commit -m "chore: auto-fix ruff lint/format"
            git push
          fi
`
	},
	{
		id: "taxonomy",
		title: "Issue taxonomy as code",
		filename: "taxonomy.yml",
		summary: "Versioned labels. The triage worker applies these; humans review anything below confidence 0.7.",
		code: `version: 1
domain:
  - model
  - platform
  - security
  - infra
  - ci
kind:
  - bug
  - debt
  - story
  - incident
severity:
  - critical
  - high
  - medium
  - low
immune-status:
  - detected
  - quarantined
  - antibody-generated
  - cured
  - chronic
rules:
  - match: "ruff|lint|format"
    labels: [ci, kind:bug]
  - match: "Aikido|CVE|SSRF|SQLi|XSS"
    labels: [security]
  - match: "cosine similarity|Bolt"
    labels: [platform, kind:debt]
    note: "Deduplicate before merge"
`
	},
	{
		id: "sentinel-formula",
		title: "Sentinel new-code grade",
		filename: "docs/sentinel-formula.md",
		summary: "Clean-as-you-code. Grade the diff, never the absolute tree, so bot bumps cannot fail main.",
		code: `# Sentinel grade (new code only)

score = 100
  - 8  * high_severity_findings
  - 3  * medium_findings
  - 1  * low_findings
  - 4  * complexity_delta_over_threshold
  - 5  * duplication_blocks_introduced
  - 10 * coverage_delta_if_negative
  + 2  * findings_fixed_on_this_diff

grade:
  A: score >= 90
  B: score >= 75
  C: score >= 60
  D: score >= 40
  F: else

gate: fail if grade of *changed lines* < B
legacy_debt: recorded, never blocking
`
	},
	{
		id: "path-lock",
		title: "dir_fd path traversal",
		filename: "Dimensional/path_validation.py",
		summary: "Sketch of the closed-form fix. Open each component with O_NOFOLLOW | O_DIRECTORY via dir_fd so a symlink cannot race between lstat and open.",
		code: `import os
from pathlib import Path

_NOFOLLOW_DIR = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW | os.O_CLOEXEC

def resolve_under(root: Path, rel: Path) -> int:
    """Return a dir_fd for rel, never following symlinks. Caller owns close()."""
    fd = os.open(root, _NOFOLLOW_DIR)
    try:
        for part in rel.parts:
            if part in ("", ".", os.sep):
                continue
            if part == "..":
                os.close(fd)
                raise PermissionError("parent traversal denied")
            nxt = os.open(part, _NOFOLLOW_DIR, dir_fd=fd)
            os.close(fd)
            fd = nxt
        return fd
    except FileNotFoundError:
        os.close(fd)
        raise
`
	},
	{
		id: "route-canary",
		title: "infinity-ai canary",
		filename: "docs/route-canary.md",
		summary: "Do not flip the Traefik rule until the contract test is green. The two workers do not share an API surface.",
		code: `# Route canary

1. Export OpenAPI from workers/tranc3-ai and workers/infinity-ai
2. Diff paths + security schemes. Missing endpoints get a shim in infinity-ai
3. Traefik weighted service:
     tranc3-ai: 95%
     infinity-ai: 5%
4. Compare authn/authz on identical fixtures (the suspected bypass)
5. Promote to 50/50 for 24h, then 100%
6. Delete the legacy route and the tranc3-ai Traefik service
`
	},
	{
		id: "asset-manifest",
		title: "Asset manifest CI",
		filename: "scripts/check_asset_manifest.py",
		summary: "Fails the build if MDX/JSX references a binary that is not in the tree.",
		code: `#!/usr/bin/env python3
"""Fail if referenced static assets are missing from the tree."""
from pathlib import Path
import re, sys

ROOT = Path(__file__).resolve().parents[1]
REF = re.compile(r"""(?:src|href|url\\()['"]([^'"]+\\.(?:png|jpg|svg|gif|webp))['"]""")
missing = []
for path in ROOT.rglob("*"):
    if path.suffix.lower() not in {".mdx", ".jsx", ".tsx", ".md"}:
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    for m in REF.finditer(text):
        rel = m.group(1).lstrip("/")
        if not (ROOT / rel).exists() and not (path.parent / rel).exists():
            missing.append(f"{path}: {rel}")
if missing:
    print("Missing assets:")
    print("\\n".join(missing))
    sys.exit(1)
print("Asset manifest clean")
`
	},
	{
		id: "census",
		title: "Supply-chain census keeper",
		filename: ".github/workflows/census-keeper.yml",
		summary: "Self-scheduled SBOM + OSV scan. Opens one issue on true drift; does not spam.",
		code: `name: CensusKeeper
on:
  schedule:
    - cron: "0 4 * * *"
  workflow_dispatch:
jobs:
  census:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate SBOM
        run: syft dir:. -o cyclonedx-json > tranc3-sbom.json
      - name: Grype
        run: grype sbom:tranc3-sbom.json --fail-on high
      - name: OSV
        run: osv-scanner --lockfile=requirements.txt --lockfile=web/package-lock.json
`
	},
	{
		id: "config-guard",
		title: "Topology sovereignty rules",
		filename: "config/topology-rules.yml",
		summary: "ConfigGuard blocks a deploy when a sensitive worker is tagged cloud-burst.",
		code: `rules:
  - id: sensitive-local
    if:
      data_class: sensitive
      topology: cloud-burst
    action: block
    message: "Sensitive workload cannot leave local-only"
  - id: vault-local
    if:
      worker: [infinity-void, vault-service, cryptex, identity-service]
      topology: [cloud-burst, either]
    action: force
    set: local-only
`
	},
	{
		id: "dr-runbook",
		title: "misp-db DR drill",
		filename: "docs/DR_MISP.md",
		summary: "The missing runbook for #1146. Restore is not documented until it has been tested.",
		code: `# Cryptex MISP — backup / restore

RPO: 24h
RTO: 4h

Nightly:
  pg_dump (or sqlite backup) → age-encrypted blob → MinIO/local object dir

Restore drill (quarterly, tracked as an issue):
  1. Provision scratch node
  2. Decrypt snapshot
  3. Restore
  4. Hit health probe
  5. Attach evidence (logs + probe) to the drill issue
  6. Close only if probe is green
`
	},
	{
		id: "ledger",
		title: "Ledger partition",
		filename: "migrations/ledger_partition.sql",
		summary: "INTERNAL vs EXTERNAL entries for #474.",
		code: `CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_class TEXT NOT NULL CHECK (data_class IN ('internal', 'external')),
    payload JSONB NOT NULL,
    source_worker TEXT NOT NULL,
    checksum TEXT NOT NULL
) PARTITION BY LIST (data_class);

CREATE TABLE ledger_entries_internal
  PARTITION OF ledger_entries FOR VALUES IN ('internal');
CREATE TABLE ledger_entries_external
  PARTITION OF ledger_entries FOR VALUES IN ('external');
`
	},
	{
		id: "operator",
		title: "Worker operator bounds",
		filename: "docs/worker-operator.md",
		summary: "Kubernetes-style reconcile, rate-limited, audited. Never a restart storm.",
		code: `policy:
  probe: GET /healthz
  interval: 15s
  restart_limit: 5
  backoff: [5s, 15s, 45s, 2m, 5m]
  after_limit: escalate
  never_auto_restart:
    - infinity-void
    - infinity-auth
    - path_validation-adjacent
  audit: loki + ledger_entries_internal
`
	},
	{
		id: "dep-surgeon",
		title: "Dependency batching",
		filename: "docs/dep-surgeon.md",
		summary: "Stop merging Aikido PRs one-by-one. One PR per library.",
		code: `batches:
  rand: [#1171, #1169]
  dompurify: [#1170]
  tokenizers: [#1168]
  cosine-similarity-duplicates:
    keep: #1178
    close: [#1182, #1179, #1176, #1173, #1153, #1151]
sast_classes:
  ssrf: [#1166, #1159]
  sqli: [#1162]
  xss: [#1163, #1155]
  file-inclusion: [#1167, #1160, #1156]
  gha-pinning: [#1158, #1161, #1154]
`
	}
];
//#endregion
export { PLAYBOOKS as t };
