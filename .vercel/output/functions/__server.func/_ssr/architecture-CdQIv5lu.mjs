import { i as PILLAR_LABEL, l as WORKERS, s as REPO } from "./catalog-DLKkkm-g.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/architecture-CdQIv5lu.js
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [
	"ingress",
	"security",
	"model",
	"creative",
	"commercial",
	"knowledge",
	"wellbeing",
	"devops",
	"infra"
];
function Architecture() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Architecture"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "A constellation that outgrew its map"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: [
						"README: ",
						REPO.workersClaimed,
						" workers. Tree: ",
						WORKERS.length,
						" catalogued services (plus a handful of untagged dirs). Treat the 35-realm Universe Bible as product vision. Ship the host first."
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Target data plane" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "LiteFS or single-node Postgres instead of SQLite-per-worker. SOPS+age instead of a unaudited Infinity Void. VictoriaMetrics instead of a hungry Prometheus." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					["Edge UI", "React + optional WASM llama.cpp for 3B local preview"],
					["Ingress", "Traefik · contract-tested routes · no legacy CF default"],
					["Workers", "Stateless FastAPI · topology tags · healthz"],
					["State", "LiteFS / Postgres · MinIO snapshots · SOPS+age secrets"]
				].map(([t, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted leading-relaxed",
						children: b
					})]
				}, t))
			})] }),
			ORDER.map((pillar) => {
				const list = WORKERS.filter((w) => w.pillar === pillar);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-3 font-display text-lg font-semibold",
					children: [PILLAR_LABEL[pillar], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 font-sans text-sm font-normal text-muted",
						children: list.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-2",
					children: list.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border bg-surface px-3 py-2",
						title: w.note,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs",
							children: w.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "muted",
									children: w.zone
								}),
								w.sensitive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "warn",
									children: "sens"
								}) : null,
								w.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "danger",
									children: "gap"
								}) : null
							]
						})]
					}, w.name))
				})] }, pillar);
			})
		]
	});
}
//#endregion
export { Architecture as component };
