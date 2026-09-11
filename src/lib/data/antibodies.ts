export type Antibody = {
  id: string;
  name: string;
  role: string;
  cures: string;
  issues: number[];
  playbook: string;
  phase: 0 | 1 | 2 | 3;
  autoMergeSafe: boolean;
};

export const ANTIBODIES: Antibody[] = [
  {
    id: "config-medic",
    name: "ConfigMedic",
    role: "Innate — CI files",
    cures: "Broken workflows, unpinned actions, Ruff gridlock",
    issues: [1180],
    playbook: "pr-autofix",
    phase: 0,
    autoMergeSafe: false,
  },
  {
    id: "asset-guard",
    name: "AssetGuard",
    role: "Innate — binaries",
    cures: "Missing Storybook / referenced assets",
    issues: [990],
    playbook: "asset-manifest",
    phase: 0,
    autoMergeSafe: true,
  },
  {
    id: "gate-truth",
    name: "GateTruth",
    role: "Innate — quality gate",
    cures: "Freshness gate reddened by bot digest bumps",
    issues: [991],
    playbook: "sentinel-formula",
    phase: 0,
    autoMergeSafe: true,
  },
  {
    id: "route-canary",
    name: "RouteCanary",
    role: "Adaptive — contracts",
    cures: "Legacy tranc3-ai routing and silent API drift",
    issues: [284],
    playbook: "route-canary",
    phase: 0,
    autoMergeSafe: false,
  },
  {
    id: "path-lock",
    name: "PathLock",
    role: "Innate — filesystem",
    cures: "Symlink TOCTOU in path_validation.py",
    issues: [337],
    playbook: "path-lock",
    phase: 0,
    autoMergeSafe: false,
  },
  {
    id: "census-keeper",
    name: "CensusKeeper",
    role: "Innate — supply chain",
    cures: "Failing Supply Chain Watch census",
    issues: [969],
    playbook: "census",
    phase: 0,
    autoMergeSafe: true,
  },
  {
    id: "dep-surgeon",
    name: "DepSurgeon",
    role: "Adaptive — dependencies",
    cures: "Aikido/Renovate flood; vulnerable pins with available fixes",
    issues: [174],
    playbook: "dep-surgeon",
    phase: 1,
    autoMergeSafe: true,
  },
  {
    id: "triage",
    name: "Triage",
    role: "Adaptive — classification",
    cures: "Unlabelled backlog, duplicate Bolt PRs, chronic debt",
    issues: [],
    playbook: "taxonomy",
    phase: 1,
    autoMergeSafe: true,
  },
  {
    id: "config-guard",
    name: "ConfigGuard",
    role: "Innate — topology",
    cures: "Sensitive workloads scheduled onto cloud-burst",
    issues: [],
    playbook: "config-guard",
    phase: 2,
    autoMergeSafe: false,
  },
  {
    id: "worker-operator",
    name: "WorkerOperator",
    role: "Innate — runtime",
    cures: "Crash-looping FastAPI workers",
    issues: [],
    playbook: "operator",
    phase: 1,
    autoMergeSafe: false,
  },
  {
    id: "doc-sentinel",
    name: "DocSentinel",
    role: "Adaptive — runbooks",
    cures: "Services with backup config but no tested restore",
    issues: [1146],
    playbook: "dr-runbook",
    phase: 2,
    autoMergeSafe: false,
  },
  {
    id: "ledger-split",
    name: "LedgerSplit",
    role: "Adaptive — data class",
    cures: "Mixed internal/external ledger entries",
    issues: [474],
    playbook: "ledger",
    phase: 2,
    autoMergeSafe: false,
  },
];

export const MUTANTS = [
  {
    id: "missing-asset",
    label: "Missing binary asset",
    antibody: "asset-guard",
    signature: "build: referenced PNG not in tree",
  },
  {
    id: "digest-bump",
    label: "Bot digest bump",
    antibody: "gate-truth",
    signature: "gate: absolute digest drift, no code change",
  },
  {
    id: "ruff-drift",
    label: "Ruff format drift",
    antibody: "config-medic",
    signature: "ci: ruff check non-zero on Python PR",
  },
  {
    id: "legacy-route",
    label: "Legacy AI route",
    antibody: "route-canary",
    signature: "gateway: /api/v1/ai/* → tranc3-ai",
  },
  {
    id: "sensitive-burst",
    label: "Sensitive on cloud-burst",
    antibody: "config-guard",
    signature: "topology: data_class=sensitive AND zone=cloud-burst",
  },
];
