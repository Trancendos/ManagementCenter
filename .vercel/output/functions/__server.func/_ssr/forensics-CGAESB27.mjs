import { c as SWOT, n as GAPS, s as REPO } from "./catalog-DLKkkm-g.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useImmune } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forensics-CGAESB27.js
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	critical: "danger",
	high: "warn",
	medium: "muted",
	low: "ok"
};
function Forensics() {
	const healed = useImmune((s) => s.healed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Forensic assessment"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "What the tree actually contains"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: [
						"Census taken against the public GitHub API on 11 Sep 2026. Earlier reports citing 863 issues were stale — GitHub now shows 12 true open issues and ~83 pull requests, all of the sampled PRs labeled blocked. The README still advertises 29 workers; ",
						REPO.workersActual,
						" ",
						"directories sit under workers/."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swot, {
						title: "Strengths",
						items: SWOT.strengths
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swot, {
						title: "Weaknesses",
						items: SWOT.weaknesses
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swot, {
						title: "Opportunities",
						items: SWOT.opportunities
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swot, {
						title: "Threats",
						items: SWOT.threats
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Root causes — no blame" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Illnesses the body never cleared. The cure is adaptive memory plus automated clearance, not more scanners." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cause, {
						t: "Dual runway",
						b: "Legacy Cloudflare path and 89 FastAPI workers coexist. Routing and config drift is structural, not accidental."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cause, {
						t: "Gates on absolute state",
						b: "The freshness gate measures the body’s surface, not the change. Bot bumps look like disease."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cause, {
						t: "Detection without thymus",
						b: "Aikido, Bolt, Renovate, CodeFactor all shout. Nothing trains tolerance or batches clearance."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cause, {
						t: "Docs lag the constellation",
						b: "29 vs 89 workers. Spark phases, Infinity Void internals, and DR are underspecified."
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Gap register" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Mapped to phases. Cured rows dim once the matching antibody has fired." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[11px] uppercase tracking-[0.14em] text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Domain"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Finding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Sev"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Phase"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: GAPS.map((g) => {
						const cured = Boolean(g.issue && healed[g.issue]);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `border-b border-border/70 ${cured ? "opacity-45" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-3 font-mono text-xs",
									children: [g.id, g.issue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "ml-2 text-accent hover:underline",
										href: `${REPO.url}/issues/${g.issue}`,
										target: "_blank",
										rel: "noreferrer",
										children: ["#", g.issue]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3 text-muted",
									children: g.domain
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3 leading-relaxed",
									children: g.finding
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: TONE[g.severity],
										children: g.severity
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 tabular-nums text-muted",
									children: g.phase
								})
							]
						}, g.id);
					}) })]
				})
			})] })
		]
	});
}
function Swot({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: title }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "text-sm leading-relaxed text-muted",
			children: it
		}, it))
	})] });
}
function Cause({ t, b }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-medium",
		children: t
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 text-sm text-muted leading-relaxed",
		children: b
	})] });
}
//#endregion
export { Forensics as component };
