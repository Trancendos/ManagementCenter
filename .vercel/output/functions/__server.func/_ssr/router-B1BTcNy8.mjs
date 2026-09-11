import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as ISSUES, s as REPO, u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as ScrollText, c as Menu, h as Activity, i as Search, l as Kanban, n as TriangleAlert, p as Boxes, r as Shield, s as Network, t as X, u as GitPullRequest } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { a as DialogOverlay, l as Slot, n as DialogClose, o as DialogPortal, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B1BTcNy8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className,
		"aria-hidden": "true",
		fill: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "13",
				stroke: "currentColor",
				strokeWidth: "1.2",
				opacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "8",
				stroke: "currentColor",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "2.4",
				fill: "currentColor"
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90 active:scale-[0.98]",
			secondary: "bg-elevated text-fg border border-border hover:border-border-strong",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
			outline: "border border-border text-fg hover:border-accent/50 hover:text-accent"
		},
		size: {
			sm: "h-8 rounded-sm px-3 text-xs",
			md: "h-10 rounded-md px-4 text-sm",
			lg: "h-11 rounded-md px-5 text-sm",
			icon: "size-10 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Sheet = Dialog;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col border-border bg-surface p-4 shadow-[var(--shadow-panel)]", side === "left" ? "left-0 top-0 border-r" : "right-0 top-0 border-l", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-sm p-1 text-muted hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
var ANTIBODIES = [
	{
		id: "config-medic",
		name: "ConfigMedic",
		role: "Innate — CI files",
		cures: "Broken workflows, unpinned actions, Ruff gridlock",
		issues: [1180],
		playbook: "pr-autofix",
		phase: 0,
		autoMergeSafe: false
	},
	{
		id: "asset-guard",
		name: "AssetGuard",
		role: "Innate — binaries",
		cures: "Missing Storybook / referenced assets",
		issues: [990],
		playbook: "asset-manifest",
		phase: 0,
		autoMergeSafe: true
	},
	{
		id: "gate-truth",
		name: "GateTruth",
		role: "Innate — quality gate",
		cures: "Freshness gate reddened by bot digest bumps",
		issues: [991],
		playbook: "sentinel-formula",
		phase: 0,
		autoMergeSafe: true
	},
	{
		id: "route-canary",
		name: "RouteCanary",
		role: "Adaptive — contracts",
		cures: "Legacy tranc3-ai routing and silent API drift",
		issues: [284],
		playbook: "route-canary",
		phase: 0,
		autoMergeSafe: false
	},
	{
		id: "path-lock",
		name: "PathLock",
		role: "Innate — filesystem",
		cures: "Symlink TOCTOU in path_validation.py",
		issues: [337],
		playbook: "path-lock",
		phase: 0,
		autoMergeSafe: false
	},
	{
		id: "census-keeper",
		name: "CensusKeeper",
		role: "Innate — supply chain",
		cures: "Failing Supply Chain Watch census",
		issues: [969],
		playbook: "census",
		phase: 0,
		autoMergeSafe: true
	},
	{
		id: "dep-surgeon",
		name: "DepSurgeon",
		role: "Adaptive — dependencies",
		cures: "Aikido/Renovate flood; vulnerable pins with available fixes",
		issues: [174],
		playbook: "dep-surgeon",
		phase: 1,
		autoMergeSafe: true
	},
	{
		id: "triage",
		name: "Triage",
		role: "Adaptive — classification",
		cures: "Unlabelled backlog, duplicate Bolt PRs, chronic debt",
		issues: [],
		playbook: "taxonomy",
		phase: 1,
		autoMergeSafe: true
	},
	{
		id: "config-guard",
		name: "ConfigGuard",
		role: "Innate — topology",
		cures: "Sensitive workloads scheduled onto cloud-burst",
		issues: [],
		playbook: "config-guard",
		phase: 2,
		autoMergeSafe: false
	},
	{
		id: "worker-operator",
		name: "WorkerOperator",
		role: "Innate — runtime",
		cures: "Crash-looping FastAPI workers",
		issues: [],
		playbook: "operator",
		phase: 1,
		autoMergeSafe: false
	},
	{
		id: "doc-sentinel",
		name: "DocSentinel",
		role: "Adaptive — runbooks",
		cures: "Services with backup config but no tested restore",
		issues: [1146],
		playbook: "dr-runbook",
		phase: 2,
		autoMergeSafe: false
	},
	{
		id: "ledger-split",
		name: "LedgerSplit",
		role: "Adaptive — data class",
		cures: "Mixed internal/external ledger entries",
		issues: [474],
		playbook: "ledger",
		phase: 2,
		autoMergeSafe: false
	}
];
var MUTANTS = [
	{
		id: "missing-asset",
		label: "Missing binary asset",
		antibody: "asset-guard",
		signature: "build: referenced PNG not in tree"
	},
	{
		id: "digest-bump",
		label: "Bot digest bump",
		antibody: "gate-truth",
		signature: "gate: absolute digest drift, no code change"
	},
	{
		id: "ruff-drift",
		label: "Ruff format drift",
		antibody: "config-medic",
		signature: "ci: ruff check non-zero on Python PR"
	},
	{
		id: "legacy-route",
		label: "Legacy AI route",
		antibody: "route-canary",
		signature: "gateway: /api/v1/ai/* → tranc3-ai"
	},
	{
		id: "sensitive-burst",
		label: "Sensitive on cloud-burst",
		antibody: "config-guard",
		signature: "topology: data_class=sensitive AND zone=cloud-burst"
	}
];
var EPICS = [
	{
		id: "E0",
		title: "Platform sterilisation",
		blurb: "Make main green. Close the dangerous correctness and security gaps. Nothing else proceeds while CI is infected.",
		phase: 0
	},
	{
		id: "E1",
		title: "Immune bootstrap",
		blurb: "Detection becomes clearance. Sentinel, triage taxonomy, first antibodies, bounded worker operator.",
		phase: 1
	},
	{
		id: "E2",
		title: "Topology hardening",
		blurb: "Local, Hybrid, and Cloud become first-class, single-command experiences with sovereignty rules.",
		phase: 2
	},
	{
		id: "E3",
		title: "Evolution and release",
		blurb: "Defect memory, vaccination SLOs, community onboarding, tagged v1.0.",
		phase: 3
	}
];
var STORIES = [
	{
		id: "E0-S1",
		epic: "E0",
		title: "Mass-fix Ruff lint/format on main",
		kind: "task",
		sp: 5,
		days: 2,
		phase: 0,
		issues: [1180],
		antibody: "config-medic",
		ac: ["ruff check . and ruff format . pass on main", "No functional diffs in the lint commit"],
		dor: ["Pinned ruff version matches CI", "Working tree clean except lint"],
		dod: ["main green for lint job", "Autofix workflow follows in E0-S2"]
	},
	{
		id: "E0-S2",
		epic: "E0",
		title: "PR autofix workflow so Ruff never blocks again",
		kind: "story",
		sp: 3,
		days: 1,
		phase: 0,
		issues: [1180],
		antibody: "config-medic",
		ac: [".github/workflows/pr-autofix.yml commits --fix on Python PRs", "Merge gate runs after autofix"],
		dor: ["Action SHAs pinned", "Permissions: contents write scoped to PR head"],
		dod: ["Draft PR demonstrates auto-commit", "Playbook copied into repo"]
	},
	{
		id: "E0-S3",
		epic: "E0",
		title: "Merge CI consolidation (#1177) and retire dead scanners (#1175)",
		kind: "story",
		sp: 2,
		days: .5,
		phase: 0,
		issues: [1180],
		antibody: "config-medic",
		ac: ["Single merge gate remains", "Unconfigured security workflows removed"],
		dor: ["Lint green on those branches", "Diff reviewed for accidental deletions"],
		dod: ["Canonical CI documented in README table"]
	},
	{
		id: "E0-S4",
		epic: "E0",
		title: "Flip api-gateway onto infinity-ai with a contract canary",
		kind: "story",
		sp: 8,
		days: 3,
		phase: 0,
		issues: [284],
		antibody: "route-canary",
		ac: [
			"OpenAPI specs for both workers",
			"Adapter for missing endpoints",
			"Canary error rate ≈ baseline",
			"Legacy route removed"
		],
		dor: ["Threat model of the suspected auth-bypass path written"],
		dod: ["Contract tests in CI", "Canary burned in 24h"]
	},
	{
		id: "E0-S5",
		epic: "E0",
		title: "Close path_validation symlink TOCTOU",
		kind: "bug",
		sp: 5,
		days: 2,
		phase: 0,
		issues: [337],
		antibody: "path-lock",
		ac: [
			"os.open + dir_fd + O_NOFOLLOW per component",
			"Adversarial race tests pass",
			"nosec justifications updated"
		],
		dor: ["Reproducer for the race exists"],
		dod: ["Bandit clean on the module", "Security review note attached"]
	},
	{
		id: "E0-S6",
		epic: "E0",
		title: "Diff-based freshness gate (new code only)",
		kind: "story",
		sp: 5,
		days: 2,
		phase: 0,
		issues: [991],
		antibody: "gate-truth",
		ac: ["Gate scores the diff, never absolute repo state", "Bot digest bumps cannot redden main"],
		dor: ["Current freshness script identified"],
		dod: ["Regression test: bump a digest, gate stays green"]
	},
	{
		id: "E0-S7",
		epic: "E0",
		title: "Commit or inline the nine Storybook PNGs",
		kind: "bug",
		sp: 2,
		days: .5,
		phase: 0,
		issues: [990],
		antibody: "asset-guard",
		ac: ["build-storybook succeeds on main", "Asset manifest CI check added"],
		dor: ["List of missing files extracted from Configure.mdx"],
		dod: ["Storybook job in CI so it cannot rot again"]
	},
	{
		id: "E0-S8",
		epic: "E0",
		title: "Restore CodeQL barrier models via an adapter",
		kind: "debt",
		sp: 3,
		days: 1,
		phase: 0,
		issues: [995],
		ac: ["CodeQL loads in-repo models", "One query fires against a fixture"],
		dor: ["Current model path documented"],
		dod: ["Scratch PR validates load"]
	},
	{
		id: "E1-S1",
		epic: "E1",
		title: "tranc3-sentinel: deterministic A–F grader on new code only",
		kind: "story",
		sp: 8,
		days: 5,
		phase: 1,
		antibody: "sentinel",
		issues: [991],
		ac: [
			"Formula versioned in-repo",
			"PR comment posts grade + new-vs-fixed",
			"Replaces CodeFactor badge"
		],
		dor: ["Scoring weights reviewed", "Fixture corpus of diffs"],
		dod: ["Grade job in CI", "Grafana panel for trend"]
	},
	{
		id: "E1-S2",
		epic: "E1",
		title: "taxonomy.yml + classifier for issues and PRs",
		kind: "story",
		sp: 5,
		days: 2,
		phase: 1,
		antibody: "triage",
		issues: [],
		ac: [
			"Labels-as-code merged",
			"New issues labeled within minutes",
			"Confidence <0.7 goes to human queue"
		],
		dor: ["Label set agreed"],
		dod: ["Backlog sweeper nightly job"]
	},
	{
		id: "E1-S3",
		epic: "E1",
		title: "the-grid dependency injection",
		kind: "debt",
		sp: 5,
		days: 2,
		phase: 1,
		issues: [336],
		ac: ["GridDatabase and WorkflowEngineRouter are app-scoped", "Isolated pytest fixtures exist"],
		dor: ["Call-site inventory"],
		dod: ["No module-global remaining in the-grid"]
	},
	{
		id: "E1-S4",
		epic: "E1",
		title: "DuckDB write idempotency",
		kind: "bug",
		sp: 5,
		days: 2,
		phase: 1,
		issues: [334],
		ac: [
			"Sequences reseed on restore",
			"Unique write keys + dedup",
			"Chaos test for duplicate writes"
		],
		dor: ["Reproduce ambiguous write"],
		dod: ["Restore drill passes"]
	},
	{
		id: "E1-S5",
		epic: "E1",
		title: "Bounded worker health operator",
		kind: "story",
		sp: 5,
		days: 2,
		phase: 1,
		antibody: "worker-operator",
		issues: [],
		ac: [
			"Health endpoints watched",
			"Restart cap of 5",
			"Escalate to human after cap",
			"Every action audited"
		],
		dor: ["Health contract per worker listed"],
		dod: ["No restart loops in a 24h soak"]
	},
	{
		id: "E2-S1",
		epic: "E2",
		title: "Local-only production path (GGUF, TOTP, vault backup)",
		kind: "story",
		sp: 8,
		days: 5,
		phase: 2,
		issues: [],
		ac: [
			"Quantized model serves offline",
			"TOTP MFA with no network",
			"Shamir or paper-shard vault backup",
			"Bounded log retention"
		],
		dor: ["VRAM/CPU budget written"],
		dod: ["deploy-local.sh smoke passes disconnected"]
	},
	{
		id: "E2-S2",
		epic: "E2",
		title: "Hybrid sovereignty scheduler + mesh",
		kind: "story",
		sp: 13,
		days: 8,
		phase: 2,
		issues: [],
		antibody: "config-guard",
		ac: [
			"Workers tagged local-only | cloud-burst | either",
			"Sensitive class cannot schedule to cloud",
			"WireGuard mesh sidecar"
		],
		dor: ["Data-class list approved"],
		dod: ["Violation blocked in ConfigGuard tests"]
	},
	{
		id: "E2-S3",
		epic: "E2",
		title: "Cloud-only cattle: MinIO + DR worker + spend-guard",
		kind: "story",
		sp: 8,
		days: 5,
		phase: 2,
		issues: [1146],
		antibody: "doc-sentinel",
		ac: [
			"Named volumes mapped to object storage",
			"Nightly encrypted snapshot",
			"Restore-to-scratch drill",
			"Spend cap quarantines non-essential workers"
		],
		dor: ["RTO/RPO numbers written"],
		dod: ["DR drill issue closed with evidence"]
	},
	{
		id: "E2-S4",
		epic: "E2",
		title: "Ledger INTERNAL/EXTERNAL partition",
		kind: "debt",
		sp: 5,
		days: 2,
		phase: 2,
		issues: [474],
		antibody: "ledger-split",
		ac: [
			"Schema partitioned by data_class",
			"Backfill complete",
			"Checksums match"
		],
		dor: ["Entry inventory"],
		dod: ["Migration rollback tested"]
	},
	{
		id: "E2-S5",
		epic: "E2",
		title: "Retire or explicitly gate cloudflare/ legacy path",
		kind: "debt",
		sp: 3,
		days: 1,
		phase: 2,
		issues: [],
		ac: ["cloudflare/ deleted or behind LEGACY_CF=1", "Compose comments match runtime"],
		dor: ["Parity checklist vs FastAPI workers"],
		dod: ["No default traffic to CF"]
	},
	{
		id: "E3-S1",
		epic: "E3",
		title: "Defect knowledge base (case-based reasoning)",
		kind: "story",
		sp: 8,
		days: 5,
		phase: 3,
		antibody: "immune-core",
		issues: [],
		ac: ["Every verified fix stored as signature → playbook", "Novel failures retrieve top-5 similar cases"],
		dor: ["Signature schema frozen"],
		dod: [">20 verified cases", "Recurrence rate dashboard"]
	},
	{
		id: "E3-S2",
		epic: "E3",
		title: "Vaccination mode and immune-health SLOs",
		kind: "story",
		sp: 5,
		days: 2,
		phase: 3,
		issues: [],
		ac: ["Known mutants injected on a schedule", "MTTD/MTTC/recurrence visible in Grafana"],
		dor: ["Mutant catalog of 5 defect classes"],
		dod: ["MTTC <4h for known classes in a 14-day window"]
	},
	{
		id: "E3-S3",
		epic: "E3",
		title: "Community onboarding and v1.0 tag",
		kind: "story",
		sp: 5,
		days: 2,
		phase: 3,
		issues: [],
		ac: [
			"CONTRIBUTING.md + 5 good-first-issues",
			"Signed SBOM on the release",
			"Rollback plan documented"
		],
		dor: ["Phase 0–2 exit criteria met"],
		dod: ["Tag v1.0.0", "Changelog from classified issues"]
	}
];
var defaultStories = () => Object.fromEntries(STORIES.map((s) => [s.id, "backlog"]));
function pushEvent(events, ev) {
	return [ev, ...events].slice(0, 80);
}
var baselineEvent = {
	t: 0,
	kind: "check",
	msg: "Census complete. Chronic inflammation: detection without clearance."
};
var useImmune = create()(persist((set, get) => ({
	healed: {},
	storyStatus: defaultStories(),
	dispatched: [],
	topology: "local",
	checks: {},
	events: [baselineEvent],
	vaccinations: [],
	dispatch: (id) => {
		const ab = ANTIBODIES.find((a) => a.id === id);
		if (!ab) return;
		if (get().dispatched.includes(id)) return;
		const healed = { ...get().healed };
		for (const n of ab.issues) healed[n] = true;
		const storyStatus = { ...get().storyStatus };
		for (const s of STORIES) if (s.antibody === id && storyStatus[s.id] === "backlog") storyStatus[s.id] = "ready";
		set({
			dispatched: [...get().dispatched, id],
			healed,
			storyStatus,
			events: pushEvent(get().events, {
				t: Date.now(),
				kind: "dispatch",
				msg: `${ab.name} deployed. ${ab.cures}.`
			})
		});
	},
	setStory: (id, status) => {
		const story = STORIES.find((s) => s.id === id);
		set({
			storyStatus: {
				...get().storyStatus,
				[id]: status
			},
			events: pushEvent(get().events, {
				t: Date.now(),
				kind: "story",
				msg: `${id} → ${status}${story ? ` (${story.title})` : ""}`
			})
		});
	},
	setTopology: (t) => set({
		topology: t,
		events: pushEvent(get().events, {
			t: Date.now(),
			kind: "topology",
			msg: `Topology set to ${t}. Sovereignty rules re-evaluated.`
		})
	}),
	toggleCheck: (id) => set({ checks: {
		...get().checks,
		[id]: !get().checks[id]
	} }),
	vaccinate: (mutantId) => {
		const mutant = MUTANTS.find((m) => m.id === mutantId);
		if (!mutant) return {
			caught: false,
			antibody: ""
		};
		const caught = get().dispatched.includes(mutant.antibody);
		const ab = ANTIBODIES.find((a) => a.id === mutant.antibody);
		set({
			vaccinations: [{
				t: Date.now(),
				mutant: mutant.label,
				caught,
				antibody: ab?.name ?? mutant.antibody
			}, ...get().vaccinations].slice(0, 24),
			events: pushEvent(get().events, {
				t: Date.now(),
				kind: "vaccinate",
				msg: caught ? `Mutant “${mutant.label}” caught by ${ab?.name}. Memory cell path.` : `Mutant “${mutant.label}” not recognised. Deploy ${ab?.name} first.`
			})
		});
		return {
			caught,
			antibody: ab?.name ?? mutant.antibody
		};
	},
	reset: () => set({
		healed: {},
		storyStatus: defaultStories(),
		dispatched: [],
		topology: "local",
		checks: {},
		vaccinations: [],
		events: [{
			t: Date.now(),
			kind: "check",
			msg: "Immune memory wiped. Returning to census baseline."
		}]
	})
}), {
	name: "tranc3-immune-v1",
	skipHydration: true
}));
function gradeFromState(dispatched, healed) {
	const issueScore = ISSUES.filter((i) => healed[i.number]).length / ISSUES.length;
	const abScore = dispatched.length / ANTIBODIES.length;
	const raw = 38 + issueScore * 32 + abScore * 30;
	const score = Math.round(Math.min(99, raw));
	return {
		score,
		letter: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F"
	};
}
function phaseProgress(storyStatus, phase) {
	const items = STORIES.filter((s) => s.phase === phase);
	const done = items.filter((s) => storyStatus[s.id] === "done").length;
	return {
		done,
		total: items.length,
		pct: items.length ? done / items.length * 100 : 0
	};
}
var NAV = [
	{
		to: "/",
		label: "Command",
		icon: Activity
	},
	{
		to: "/forensics",
		label: "Forensics",
		icon: Search
	},
	{
		to: "/triage",
		label: "Triage",
		icon: GitPullRequest
	},
	{
		to: "/backlog",
		label: "Backlog",
		icon: Kanban
	},
	{
		to: "/antibodies",
		label: "Antibodies",
		icon: Shield
	},
	{
		to: "/topology",
		label: "Topology",
		icon: Network
	},
	{
		to: "/architecture",
		label: "Architecture",
		icon: Boxes
	},
	{
		to: "/playbooks",
		label: "Playbooks",
		icon: ScrollText
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		"aria-label": "Primary",
		children: NAV.map((item) => {
			const active = pathname === item.to;
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors", active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg"),
				"aria-current": active ? "page" : void 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.to);
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 px-1 pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-8 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-sm font-semibold tracking-tight",
			children: "TRANC3 Immune"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.16em] text-muted",
			children: "Command center"
		})] })]
	});
}
function SentinelCard() {
	const { letter, score } = gradeFromState(useImmune((s) => s.dispatched), useImmune((s) => s.healed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-auto rounded-lg border border-border bg-elevated p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted",
				children: "Sentinel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 font-display text-2xl font-semibold tabular-nums",
				children: [letter, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-sm font-normal text-muted",
					children: score
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-[11px] text-subtle",
				children: [
					REPO.owner,
					"/",
					REPO.name,
					" · 11 Sep 2026"
				]
			})
		]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface/90 px-4 py-6 backdrop-blur-sm lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SentinelCard, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm font-semibold",
						children: "TRANC3 Immune"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Open navigation",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col pt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate: () => setOpen(false) })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:pl-60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "main",
					className: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8",
					children
				})
			})
		]
	});
}
function HydrateImmune() {
	(0, import_react.useEffect)(() => {
		useImmune.persist.rehydrate();
	}, []);
	return null;
}
var TooltipProvider = Provider;
var styles_default = "/assets/styles-Bh7-TPMK.css";
var APP_NAME = "TRANC3 Immune";
var Route$8 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Self-hosted command center for Trancendos/Tranc3: forensic assessment, immune antibodies, agile backlog, and zero-cost playbooks."
			},
			{
				name: "theme-color",
				content: "#09090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Syne:wght@500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateImmune, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
					delayDuration: 250,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "dark",
					position: "bottom-right"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$7 = () => import("./routes-DU4Y5JkD.mjs");
var Route$7 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./antibodies-hERZb_HC.mjs");
var Route$6 = createFileRoute("/antibodies")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./architecture-CdQIv5lu.mjs");
var Route$5 = createFileRoute("/architecture")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./backlog-BPFH58H6.mjs");
var Route$4 = createFileRoute("/backlog")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./forensics-CGAESB27.mjs");
var Route$3 = createFileRoute("/forensics")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./playbooks-CmDN4YcW.mjs");
var Route$2 = createFileRoute("/playbooks")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./topology-Cwb-jT7J.mjs");
var Route$1 = createFileRoute("/topology")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./triage-CBsGxzYu.mjs");
var Route = createFileRoute("/triage")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$7.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$8
	}),
	AntibodiesRoute: Route$6.update({
		id: "/antibodies",
		path: "/antibodies",
		getParentRoute: () => Route$8
	}),
	ArchitectureRoute: Route$5.update({
		id: "/architecture",
		path: "/architecture",
		getParentRoute: () => Route$8
	}),
	BacklogRoute: Route$4.update({
		id: "/backlog",
		path: "/backlog",
		getParentRoute: () => Route$8
	}),
	ForensicsRoute: Route$3.update({
		id: "/forensics",
		path: "/forensics",
		getParentRoute: () => Route$8
	}),
	PlaybooksRoute: Route$2.update({
		id: "/playbooks",
		path: "/playbooks",
		getParentRoute: () => Route$8
	}),
	TopologyRoute: Route$1.update({
		id: "/topology",
		path: "/topology",
		getParentRoute: () => Route$8
	}),
	TriageRoute: Route.update({
		id: "/triage",
		path: "/triage",
		getParentRoute: () => Route$8
	})
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { EPICS as a, MUTANTS as c, useImmune as i, Button as l, gradeFromState as n, STORIES as o, phaseProgress as r, ANTIBODIES as s, router_exports as t };
