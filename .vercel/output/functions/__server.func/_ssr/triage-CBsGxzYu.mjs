import { i as __toESM } from "../_runtime.mjs";
import { a as PR_CLASSES, d as formatRelative, o as PULLS, r as ISSUES, s as REPO, u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useImmune } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/triage-CBsGxzYu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-10 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg placeholder:text-subtle outline-none transition-colors focus:border-accent/50", className),
	...props
}));
Input.displayName = "Input";
function Triage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [klass, setKlass] = (0, import_react.useState)("all");
	const healed = useImmune((s) => s.healed);
	const pulls = (0, import_react.useMemo)(() => {
		return PULLS.filter((p) => {
			const hit = !q || `${p.number} ${p.title} ${p.author}`.toLowerCase().includes(q.toLowerCase());
			const k = klass === "all" || p.klass === klass;
			return hit && k;
		});
	}, [q, klass]);
	const issues = (0, import_react.useMemo)(() => {
		return ISSUES.filter((i) => !q || `${i.number} ${i.title}`.toLowerCase().includes(q.toLowerCase()));
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Triage engine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "Batch the flood. Do not merge it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Thirty most recent PRs — every one labeled blocked. The merge gate is a single lint failure, not thirty unique defects. Issues are the 12 true tickets still open."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: PR_CLASSES.map((c) => {
					const n = PULLS.filter((p) => p.klass === c.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setKlass(klass === c.id ? "all" : c.id),
						className: `rounded-lg border p-3 text-left transition-colors ${klass === c.id ? "border-accent bg-accent/10" : "border-border bg-surface"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xl tabular-nums",
							children: n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: c.label
						})]
					}, c.id);
				})
			}),
			klass !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: PR_CLASSES.find((c) => c.id === klass)?.action
			}) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Filter issues and PRs",
				"aria-label": "Filter issues and PRs"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
				"Pull requests (sample of ",
				PULLS.length,
				")"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
				"Showing ",
				pulls.length,
				". Merge order: #1177 → #1175 → human product PRs → batched Aikido."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: pulls.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "font-medium hover:text-accent",
							href: `${REPO.url}/pull/${p.number}`,
							target: "_blank",
							rel: "noreferrer",
							children: [
								"#",
								p.number,
								" ",
								p.title
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								p.author,
								" · ",
								formatRelative(p.updated),
								p.draft ? " · draft" : ""
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1",
						children: [p.blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "danger",
							children: "blocked"
						}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "muted",
							children: p.klass
						})]
					})]
				}, p.number))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
				"Open issues (",
				issues.length,
				")"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Dimmed rows have been marked cured by a dispatched antibody in this session." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between ${healed[i.number] ? "opacity-45" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "font-medium hover:text-accent",
						href: `${REPO.url}/issues/${i.number}`,
						target: "_blank",
						rel: "noreferrer",
						children: [
							"#",
							i.number,
							" ",
							i.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: formatRelative(i.updated)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: i.severity === "critical" || i.severity === "high" ? "warn" : "muted",
								children: i.severity
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: i.kind }),
							healed[i.number] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: "ok",
								children: "cured"
							}) : null
						]
					})]
				}, i.number))
			})] })
		]
	});
}
//#endregion
export { Triage as component };
