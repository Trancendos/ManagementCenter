import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Copy, f as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useImmune, l as Button, s as ANTIBODIES } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
import { t as PLAYBOOKS } from "./playbooks-_VSdmcGc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playbooks-CmDN4YcW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CopyBlock({ title, filename, code, summary }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-elevated p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 font-mono text-[11px] text-muted",
					children: filename
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: async () => {
						await navigator.clipboard.writeText(code);
						setCopied(true);
						toast.success(`Copied ${filename}`);
						window.setTimeout(() => setCopied(false), 1600);
					},
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Copied" : "Copy"]
				})]
			}),
			summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted leading-relaxed",
				children: summary
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 max-h-64 overflow-auto rounded-md bg-bg p-3 font-mono text-[11px] leading-relaxed text-fg",
				children: code
			})
		]
	});
}
function Playbooks() {
	const dispatched = useImmune((s) => s.dispatched);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Playbooks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "Copy into the repo. Do not rent a vendor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Each artifact is $0, self-hosted, and meant to land as a file in Trancendos/Tranc3. Dispatching the matching antibody marks it as in-memory; you still paste the YAML."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How to apply" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Phase 0 is mechanical: autofix workflow, asset manifest, freshness formula, path traversal sketch, canary steps. Do not start Hybrid control-plane work while main is red." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Paste pr-autofix.yml and push to a branch. Confirm it commits lint back." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mass-fix ruff on main once. Rebase the blocked PR queue." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Merge #1177 then #1175. Batch Aikido. Close cosine-similarity duplicates." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contract-test infinity-ai before touching Traefik." })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: PLAYBOOKS.map((p) => {
					const ab = ANTIBODIES.find((a) => a.playbook === p.id);
					const on = ab ? dispatched.includes(ab.id) : false;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [ab ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: on ? "ok" : "muted",
								children: [
									ab.name,
									" ",
									on ? "in memory" : "not dispatched"
								]
							})
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyBlock, {
							title: p.title,
							filename: p.filename,
							code: p.code,
							summary: p.summary
						})]
					}, p.id);
				})
			})
		]
	});
}
//#endregion
export { Playbooks as component };
