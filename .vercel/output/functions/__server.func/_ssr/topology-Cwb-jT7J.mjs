import { i as PILLAR_LABEL, l as WORKERS, u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useImmune, l as Button } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/topology-Cwb-jT7J.js
var import_jsx_runtime = require_jsx_runtime();
var MODES = [
	{
		id: "local",
		title: "Local only",
		ready: "~60%",
		blurb: "Single host, zero egress after image pull. Needs GGUF, offline TOTP, Shamir vault backup, bounded Loki retention, local OCI mirror."
	},
	{
		id: "hybrid",
		title: "Hybrid",
		ready: "~35%",
		blurb: "Core stays local. Burst is tagged. Without a sovereignty scheduler this collapses into cloud-default with local leftovers."
	},
	{
		id: "cloud",
		title: "Cloud only",
		ready: "~55%",
		blurb: "Still vendor-agnostic — no RDS/S3/Lambda. Needs multi-node, MinIO, distributed secrets, automated DR, spend-guard."
	}
];
function allowed(zone, topology) {
	if (topology === "local") return true;
	if (topology === "cloud") return zone !== "local-only";
	return true;
}
function TopologyPage() {
	const topology = useImmune((s) => s.topology);
	const setTopology = useImmune((s) => s.setTopology);
	const violations = WORKERS.filter((w) => topology === "hybrid" && w.sensitive && w.zone === "cloud-burst");
	const blocked = WORKERS.filter((w) => !allowed(w.zone, topology));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Topology orchestrator"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "One click. Three sovereignties."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Local first. Hybrid only with tags and a mesh. Cloud only still means self-hosted containers — never a managed AWS/Azure brain."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTopology(m.id),
					className: cn("rounded-xl border p-5 text-left transition-colors", topology === m.id ? "border-accent bg-accent/10" : "border-border bg-surface"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg font-semibold",
							children: m.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: topology === m.id ? "accent" : "muted",
							children: m.ready
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: m.blurb
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scheduler view" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: topology === "hybrid" ? `${violations.length} sensitive workers are tagged cloud-burst — ConfigGuard must block these.` : topology === "cloud" ? `${blocked.length} local-only workers would refuse to schedule. Keep vaults off rented disks or wrap them in sealed snapshots.` : "All workers may run. Watch RAM: Prometheus+Grafana+Loki will starve the model on a hobby box." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[560px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-[11px] uppercase tracking-[0.14em] text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Worker"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Pillar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Zone"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Decision"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: WORKERS.map((w) => {
						const ok = allowed(w.zone, topology) && !(topology === "hybrid" && w.sensitive && w.zone === "cloud-burst");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 pr-3 font-mono text-xs",
									children: [w.name, w.sensitive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "ml-2",
										tone: "warn",
										children: "sensitive"
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 text-muted",
									children: PILLAR_LABEL[w.pillar]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-3 text-muted",
									children: w.zone
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: ok ? "ok" : "danger",
										children: ok ? "schedule" : "block"
									})
								})
							]
						}, w.name);
					}) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => setTopology("local"),
					children: "Force local"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-center text-xs text-muted",
					children: "Switching modes is a simulation. Wire the same tags into topology-service before a real cutover."
				})]
			})
		]
	});
}
//#endregion
export { TopologyPage as component };
