export type Severity = "critical" | "high" | "medium" | "low";
export type IssueKind = "bug" | "debt" | "ops" | "security" | "ci";

export const REPO = {
  owner: "Trancendos",
  name: "Tranc3",
  url: "https://github.com/Trancendos/Tranc3",
  language: "Python",
  license: "MIT (README also claims proprietary — conflict)",
  created: "2026-04-21",
  pushed: "2026-09-11T02:37:50Z",
  stars: 2,
  forks: 0,
  openIssuesCount: 95,
  trueOpenIssues: 12,
  openPrsApprox: 83,
  sampledPrs: 30,
  blockedPrsSampled: 30,
  contributors: 1,
  testsClaimed: 966,
  workersClaimed: 29,
  workersActual: 89,
  mcpToolsClaimed: 45,
} as const;

export type Gap = {
  id: string;
  issue?: number;
  domain: string;
  finding: string;
  severity: Severity;
  phase: 0 | 1 | 2 | 3;
};

export const GAPS: Gap[] = [
  {
    id: "G-ROUTE",
    issue: 284,
    domain: "Routing",
    finding:
      "api-gateway still sends /api/v1/ai/* to legacy tranc3-ai, not infinity-ai. Surfaces differ — swap without a contract is an auth-bypass path.",
    severity: "critical",
    phase: 0,
  },
  {
    id: "G-TOCTOU",
    issue: 337,
    domain: "Security",
    finding:
      "path_validation.py has a symlink TOCTOU on intermediate path components. Needs dir_fd + O_NOFOLLOW traversal.",
    severity: "high",
    phase: 0,
  },
  {
    id: "G-CI",
    issue: 1180,
    domain: "CI/CD",
    finding:
      "GitHub Actions need review. Dual GitHub + Forgejo + Woodpecker + CircleCI. Every sampled open PR is labeled blocked (Ruff/lint gridlock).",
    severity: "high",
    phase: 0,
  },
  {
    id: "G-FRESH",
    issue: 991,
    domain: "CI/CD",
    finding:
      "Freshness gate scores absolute state. Bot digest bumps redden main and tax the next unrelated PR.",
    severity: "high",
    phase: 0,
  },
  {
    id: "G-ASSETS",
    issue: 990,
    domain: "Build",
    finding:
      "Storybook Configure.mdx imports nine PNGs that were never committed. Text review cannot see missing binaries.",
    severity: "medium",
    phase: 0,
  },
  {
    id: "G-CODEQL",
    issue: 995,
    domain: "Security",
    finding: "CodeQL never loads the repo's own barrier models, so none of them apply.",
    severity: "high",
    phase: 0,
  },
  {
    id: "G-CENSUS",
    issue: 969,
    domain: "Supply chain",
    finding: "Scheduled Supply Chain Watch census is failing. Unknown vulnerability window.",
    severity: "medium",
    phase: 0,
  },
  {
    id: "G-DI",
    issue: 336,
    domain: "Architecture",
    finding:
      "the-grid GridDatabase / WorkflowEngineRouter are module globals — not injectable, blocking isolated tests.",
    severity: "high",
    phase: 1,
  },
  {
    id: "G-DUCK",
    issue: 334,
    domain: "Data",
    finding: "analytics-service DuckDB needs sequence reseeding and ambiguous-write dedup.",
    severity: "high",
    phase: 1,
  },
  {
    id: "G-DR",
    issue: 1146,
    domain: "Ops",
    finding: "misp-db (Cryptex MISP) has no backup, restore, or DR runbook.",
    severity: "high",
    phase: 2,
  },
  {
    id: "G-LEDGER",
    issue: 474,
    domain: "Governance",
    finding: "ledger-service must partition INTERNAL vs EXTERNAL entries for capital governance.",
    severity: "medium",
    phase: 2,
  },
  {
    id: "G-SCOPE",
    domain: "Scope",
    finding:
      "README claims 29 workers. The workers/ tree currently holds 89 directories. Documentation and failure domains have not caught up to the constellation.",
    severity: "high",
    phase: 1,
  },
  {
    id: "G-BUS",
    domain: "Bus factor",
    finding:
      "One human contributor, 2 stars, 0 forks. Truck factor = 1. Automation is generating more surface than one person can review.",
    severity: "high",
    phase: 1,
  },
  {
    id: "G-CF",
    domain: "Legacy",
    finding:
      "cloudflare/ legacy fallback still sits beside the self-hosted workers. Dual-runtime drift.",
    severity: "medium",
    phase: 2,
  },
];

export type Issue = {
  number: number;
  title: string;
  labels: string[];
  updated: string;
  kind: IssueKind;
  severity: Severity;
};

export const ISSUES: Issue[] = [
  {
    number: 969,
    title: "Supply Chain Watch: a scheduled census is failing",
    labels: ["supply-chain-watch"],
    updated: "2026-09-10T09:26:00Z",
    kind: "ci",
    severity: "medium",
  },
  {
    number: 1180,
    title: "GitHub Actions need review and fixing before this goes forward",
    labels: [],
    updated: "2026-09-09T22:23:32Z",
    kind: "ci",
    severity: "high",
  },
  {
    number: 1146,
    title: "misp-db (Cryptex MISP) has no backup, restore, or DR runbook coverage",
    labels: [],
    updated: "2026-09-06T20:29:12Z",
    kind: "ops",
    severity: "high",
  },
  {
    number: 995,
    title: "CodeQL never loads the repo's own barrier models, so none of them apply",
    labels: ["security"],
    updated: "2026-09-06T20:29:12Z",
    kind: "security",
    severity: "high",
  },
  {
    number: 991,
    title: "Service review freshness gate goes red on main whenever a bot bumps a docker digest",
    labels: [],
    updated: "2026-09-06T20:29:11Z",
    kind: "ci",
    severity: "high",
  },
  {
    number: 990,
    title: "npm run build-storybook is broken on main: Configure.mdx imports nine uncommitted PNGs",
    labels: [],
    updated: "2026-09-06T20:29:11Z",
    kind: "bug",
    severity: "medium",
  },
  {
    number: 174,
    title: "Dependency Dashboard",
    labels: [],
    updated: "2026-08-31T19:29:52Z",
    kind: "ops",
    severity: "low",
  },
  {
    number: 337,
    title: "path_validation.py: close intermediate-component symlink race with dir_fd traversal",
    labels: [],
    updated: "2026-08-28T05:26:59Z",
    kind: "security",
    severity: "high",
  },
  {
    number: 474,
    title: "ledger-service: partition INTERNAL vs EXTERNAL entries (Stage 7.x)",
    labels: ["worker", "tech-debt", "compliance", "infrastructure"],
    updated: "2026-08-18T16:52:14Z",
    kind: "debt",
    severity: "medium",
  },
  {
    number: 336,
    title: "the-grid: make GridDatabase/WorkflowEngineRouter injectable per-app",
    labels: ["worker", "tech-debt"],
    updated: "2026-08-18T16:52:13Z",
    kind: "debt",
    severity: "high",
  },
  {
    number: 334,
    title: "Harden analytics-service DuckDB backend: sequence reseeding and write dedup",
    labels: ["worker", "tech-debt"],
    updated: "2026-08-18T16:52:12Z",
    kind: "debt",
    severity: "high",
  },
  {
    number: 284,
    title: "api-gateway routes AI traffic to legacy tranc3-ai, not infinity-ai",
    labels: [],
    updated: "2026-08-18T16:52:12Z",
    kind: "bug",
    severity: "critical",
  },
];

export type PrClass =
  | "ci"
  | "bolt-perf"
  | "aikido-dep"
  | "aikido-sast"
  | "feat"
  | "other";

export type Pull = {
  number: number;
  title: string;
  author: string;
  labels: string[];
  updated: string;
  draft: boolean;
  klass: PrClass;
  blocked: boolean;
};

export const PULLS: Pull[] = [
  { number: 1182, title: "Bolt: Vector math map(operator.mul) optimization", author: "Trancendos", labels: ["blocked", "size/S"], updated: "2026-09-10T21:37:39Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1181, title: "Palette: Add confirmation dialog for deleting workflow nodes", author: "Trancendos", labels: ["blocked", "size/M"], updated: "2026-09-10T20:52:48Z", draft: false, klass: "feat", blocked: true },
  { number: 1179, title: "Bolt: performance improvement", author: "Trancendos", labels: ["ci", "blocked", "size/XL"], updated: "2026-09-09T21:22:25Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1178, title: "Bolt: Optimize cosine similarity calculations for ~30% speedup", author: "Trancendos", labels: ["ci", "blocked", "size/L"], updated: "2026-09-08T21:49:54Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1177, title: "ci: consolidate GitHub Actions and add health recovery", author: "Trancendos", labels: ["worker", "ci", "blocked", "size/XXL"], updated: "2026-09-09T22:39:10Z", draft: false, klass: "ci", blocked: true },
  { number: 1176, title: "Bolt: Optimize cosine similarity for faster model evaluation", author: "Trancendos", labels: ["ci", "blocked", "size/XL"], updated: "2026-09-07T22:00:30Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1175, title: "Remove unconfigured blocking security workflows", author: "Trancendos", labels: ["ci", "blocked", "size/XL"], updated: "2026-09-07T00:23:34Z", draft: false, klass: "ci", blocked: true },
  { number: 1174, title: "Add isolated internal PR Pages previews", author: "Trancendos", labels: ["ci", "blocked", "size/L"], updated: "2026-09-07T00:05:21Z", draft: false, klass: "ci", blocked: true },
  { number: 1173, title: "Bolt: Optimize pure Python cosine similarity by 30%", author: "Trancendos", labels: ["ci", "blocked", "size/L"], updated: "2026-09-06T23:32:01Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1172, title: "feat: add Tranc3 ECC bundle", author: "ecc-tools[bot]", labels: ["ci", "blocked", "size/XL"], updated: "2026-09-06T23:16:06Z", draft: false, klass: "feat", blocked: true },
  { number: 1171, title: "[Aikido] Fix rand 0.8.8 → 0.10.2 in aeonmind", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T20:11:09Z", draft: false, klass: "aikido-dep", blocked: true },
  { number: 1170, title: "[Aikido] Fix dompurify 3.4.13 → 3.4.15 in web", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T20:10:37Z", draft: false, klass: "aikido-dep", blocked: true },
  { number: 1169, title: "[Aikido] Fix rand 0.8.8 → 0.10.2 in rust_extensions", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T20:10:52Z", draft: false, klass: "aikido-dep", blocked: true },
  { number: 1168, title: "[Aikido] Fix tokenizers 0.22.2 → 0.23.1", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T20:09:23Z", draft: false, klass: "aikido-dep", blocked: true },
  { number: 1167, title: "[Aikido] Potential file inclusion via reading file", author: "aikido-autofix[bot]", labels: ["worker", "ci", "blocked"], updated: "2026-09-07T19:53:48Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1166, title: "[Aikido] Potential SSRF via user input in HTTP request", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-06T20:24:15Z", draft: true, klass: "aikido-sast", blocked: true },
  { number: 1165, title: "[Aikido] Dangerous use of assert", author: "aikido-autofix[bot]", labels: ["security", "worker", "ci", "blocked"], updated: "2026-09-07T19:48:36Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1164, title: "[Aikido] Express is not emitting security headers", author: "aikido-autofix[bot]", labels: ["worker", "ci", "blocked"], updated: "2026-09-07T19:48:24Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1163, title: "[Aikido] document.write can lead to XSS", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:47:42Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1162, title: "[Aikido] Potential SQL injection via string concatenation", author: "aikido-autofix[bot]", labels: ["worker", "ci", "blocked"], updated: "2026-09-07T19:47:29Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1161, title: "[Aikido] Overly broad permissions in GitHub Actions", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:47:15Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1160, title: "[Aikido] Potential file inclusion via reading file", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:46:18Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1159, title: "[Aikido] HTTP request might enable SSRF", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-06T20:10:30Z", draft: true, klass: "aikido-sast", blocked: true },
  { number: 1158, title: "[Aikido] 3rd party GitHub Actions should be pinned", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:45:52Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1157, title: "[Aikido] Dockerfile missing binary integrity check", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:45:29Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1156, title: "[Aikido] Potential file inclusion via reading file", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-08T20:09:20Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1155, title: "[Aikido] Potential XSS via window.location.href", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-06T20:04:44Z", draft: true, klass: "aikido-sast", blocked: true },
  { number: 1154, title: "[Aikido] Template injection in GitHub Workflows Action", author: "aikido-autofix[bot]", labels: ["ci", "blocked"], updated: "2026-09-07T19:44:33Z", draft: false, klass: "aikido-sast", blocked: true },
  { number: 1153, title: "Bolt: Optimize cosine similarity calculation", author: "Trancendos", labels: ["ci", "blocked", "size/L"], updated: "2026-09-06T23:22:54Z", draft: false, klass: "bolt-perf", blocked: true },
  { number: 1151, title: "Bolt: Optimize pure-Python vector math operations", author: "Trancendos", labels: ["ci", "blocked", "size/L"], updated: "2026-09-07T21:43:43Z", draft: false, klass: "bolt-perf", blocked: true },
];

export const PR_CLASSES: { id: PrClass; label: string; action: string }[] = [
  { id: "ci", label: "CI / merge gate", action: "Merge #1177 then #1175 first. They unblock the pipeline." },
  { id: "bolt-perf", label: "Bolt performance", action: "Deduplicate cosine-similarity PRs. Keep one, close the rest as duplicates." },
  { id: "aikido-dep", label: "Aikido dependencies", action: "Batch by package. One PR per library, not per workspace copy." },
  { id: "aikido-sast", label: "Aikido SAST", action: "Group SSRF / SQLi / XSS / file-inclusion. Human-review security-critical paths." },
  { id: "feat", label: "Product / feat", action: "Rebase onto a green main after lint gridlock clears." },
];

export type WorkerZone = "local-only" | "cloud-burst" | "either";
export type Pillar =
  | "ingress"
  | "security"
  | "model"
  | "creative"
  | "commercial"
  | "knowledge"
  | "wellbeing"
  | "devops"
  | "infra";

export type Worker = {
  name: string;
  pillar: Pillar;
  zone: WorkerZone;
  sensitive: boolean;
  note?: string;
};

export const WORKERS: Worker[] = [
  { name: "api-gateway", pillar: "ingress", zone: "either", sensitive: false, note: "Currently routes AI to legacy tranc3-ai" },
  { name: "gateway-service", pillar: "ingress", zone: "either", sensitive: false },
  { name: "infinity-ws", pillar: "ingress", zone: "either", sensitive: false },
  { name: "nexus-ws-rs", pillar: "ingress", zone: "either", sensitive: false },
  { name: "topology-service", pillar: "ingress", zone: "local-only", sensitive: true },
  { name: "hive-service", pillar: "ingress", zone: "either", sensitive: false },
  { name: "dimensional-nexus-service", pillar: "ingress", zone: "either", sensitive: false },
  { name: "the-grid", pillar: "ingress", zone: "either", sensitive: false, note: "Module globals block tests" },
  { name: "workflow-engine-service", pillar: "ingress", zone: "either", sensitive: false },
  { name: "infinity-void", pillar: "security", zone: "local-only", sensitive: true },
  { name: "infinity-auth", pillar: "security", zone: "local-only", sensitive: true },
  { name: "identity-service", pillar: "security", zone: "local-only", sensitive: true },
  { name: "vault-service", pillar: "security", zone: "local-only", sensitive: true },
  { name: "vault-service-rs", pillar: "security", zone: "local-only", sensitive: true },
  { name: "cryptex", pillar: "security", zone: "local-only", sensitive: true, note: "MISP DB has no DR" },
  { name: "ice-box-service", pillar: "security", zone: "local-only", sensitive: true },
  { name: "warp-tunnel", pillar: "security", zone: "either", sensitive: true },
  { name: "infinity-ai", pillar: "model", zone: "either", sensitive: false, note: "Documented 5-tier gateway" },
  { name: "tranc3-ai", pillar: "model", zone: "either", sensitive: false, note: "Legacy — retire after canary" },
  { name: "model-router-service", pillar: "model", zone: "either", sensitive: false },
  { name: "litellm-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "llamaindex-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "langchain-integration-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "dspy-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "haystack-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "mlflow-service", pillar: "model", zone: "cloud-burst", sensitive: false },
  { name: "deepagents-orchestrator-service", pillar: "model", zone: "either", sensitive: false },
  { name: "swarm-coordinator-service", pillar: "model", zone: "either", sensitive: false },
  { name: "gbrain-bridge", pillar: "model", zone: "either", sensitive: false },
  { name: "the-studio", pillar: "creative", zone: "either", sensitive: false },
  { name: "sashas-photo-studio", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "tranceflow", pillar: "creative", zone: "either", sensitive: false },
  { name: "tateking", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "fabulousa-service", pillar: "creative", zone: "either", sensitive: false },
  { name: "imaginarium", pillar: "creative", zone: "either", sensitive: false },
  { name: "blender-worker", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "ffmpeg-worker", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "remotion-render-service", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "triposr-worker", pillar: "creative", zone: "cloud-burst", sensitive: false },
  { name: "ledger-service", pillar: "commercial", zone: "local-only", sensitive: true },
  { name: "artifactory-service", pillar: "commercial", zone: "either", sensitive: false },
  { name: "payments-service", pillar: "commercial", zone: "local-only", sensitive: true },
  { name: "orders-service", pillar: "commercial", zone: "local-only", sensitive: true },
  { name: "products-service", pillar: "commercial", zone: "either", sensitive: false },
  { name: "warp-radio", pillar: "commercial", zone: "cloud-burst", sensitive: false },
  { name: "observatory", pillar: "knowledge", zone: "either", sensitive: false },
  { name: "library-service", pillar: "knowledge", zone: "either", sensitive: false },
  { name: "the-academy", pillar: "knowledge", zone: "either", sensitive: false },
  { name: "basement", pillar: "knowledge", zone: "local-only", sensitive: true },
  { name: "audit-service", pillar: "knowledge", zone: "local-only", sensitive: true },
  { name: "search-service", pillar: "knowledge", zone: "either", sensitive: false },
  { name: "tranquility", pillar: "wellbeing", zone: "local-only", sensitive: true },
  { name: "imind", pillar: "wellbeing", zone: "local-only", sensitive: true },
  { name: "taimra", pillar: "wellbeing", zone: "local-only", sensitive: true },
  { name: "vrar3d", pillar: "wellbeing", zone: "either", sensitive: false },
  { name: "resonate", pillar: "wellbeing", zone: "either", sensitive: false },
  { name: "devocity", pillar: "devops", zone: "cloud-burst", sensitive: false },
  { name: "chaos-party", pillar: "devops", zone: "cloud-burst", sensitive: false },
  { name: "the-lab", pillar: "devops", zone: "either", sensitive: false },
  { name: "lab-service", pillar: "devops", zone: "either", sensitive: false },
  { name: "monitoring", pillar: "devops", zone: "either", sensitive: false },
  { name: "health-aggregator", pillar: "devops", zone: "either", sensitive: false },
  { name: "backup-service", pillar: "devops", zone: "local-only", sensitive: true },
  { name: "cron-service", pillar: "devops", zone: "either", sensitive: false },
  { name: "config-service", pillar: "devops", zone: "local-only", sensitive: true },
  { name: "the-dutchy", pillar: "devops", zone: "cloud-burst", sensitive: false },
  { name: "turings-hub-service", pillar: "devops", zone: "either", sensitive: false },
  { name: "sentinel-station-service", pillar: "devops", zone: "either", sensitive: false },
  { name: "cache-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "cdn-service", pillar: "infra", zone: "cloud-burst", sensitive: false },
  { name: "files-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "storage-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "queue-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "bullmq-queue-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "rate-limit-service", pillar: "infra", zone: "either", sensitive: false },
  { name: "rate-limit-service-rs", pillar: "infra", zone: "either", sensitive: false },
  { name: "notifications", pillar: "infra", zone: "either", sensitive: false },
  { name: "email-service", pillar: "infra", zone: "cloud-burst", sensitive: false },
  { name: "sms-service", pillar: "infra", zone: "cloud-burst", sensitive: false },
  { name: "analytics-service", pillar: "infra", zone: "local-only", sensitive: true, note: "DuckDB write-dedup needed" },
  { name: "users-service", pillar: "infra", zone: "local-only", sensitive: true },
];

export const PILLAR_LABEL: Record<Pillar, string> = {
  ingress: "Ingress & mesh",
  security: "Security & vault",
  model: "Model & agents",
  creative: "Creative studios",
  commercial: "Commercial",
  knowledge: "Knowledge",
  wellbeing: "Wellbeing",
  devops: "DevOps",
  infra: "Infra",
};

export const SWOT = {
  strengths: [
    "Genuine zero-cost, self-hosted ethos — no paid API lock-in.",
    "Owns the transformer, not a wrapper around a vendor model.",
    "Security tooling is already present: ruff, bandit, semgrep, gitleaks, trivy, pre-commit, Mergify.",
    "Active development — last push 11 Sep 2026.",
  ],
  weaknesses: [
    "Truck factor 1. Zero forks, two stars. No external review.",
    "README says 29 workers; tree has 89. The map is lying to the operators.",
    "Every sampled open PR is blocked. Detection without clearance.",
    "Infinity Void, Spark phases, and the security framework are under-specified in public docs.",
  ],
  opportunities: [
    "A single green main + autofix bot unfreezes ~83 PRs.",
    "GGUF + Ollama would put this in front of the local-LLM community at $0.",
    "Sentinel (new-code-only grading) retires CodeFactor without rent.",
  ],
  threats: [
    "Maintainer burnout from bot PR flood (Aikido, Bolt, Renovate).",
    "Custom crypto and inference paths will not be crowd-reviewed.",
    "Scope of 89 workers is unmaintainable by one human — CVEs will rot.",
  ],
};

export const CHECKLIST = [
  { id: "c1", label: "Mass-fix Ruff on main so the lint gate can turn green" },
  { id: "c2", label: "Land PR autofix workflow so lint never blocks again" },
  { id: "c3", label: "Merge #1177 (CI consolidation) then #1175 (dead scanners)" },
  { id: "c4", label: "Rebase remaining open PRs onto the green main" },
  { id: "c5", label: "Batch Aikido PRs by class; close cosine-similarity duplicates" },
  { id: "c6", label: "Contract-test infinity-ai, then flip api-gateway (#284)" },
  { id: "c7", label: "Close path_validation TOCTOU with dir_fd (#337)" },
  { id: "c8", label: "Commit or inline the nine Storybook PNGs (#990)" },
];
