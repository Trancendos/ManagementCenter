import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as MUTANTS, i as useImmune, l as Button, s as ANTIBODIES } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
import { t as PLAYBOOKS } from "./playbooks-_VSdmcGc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/antibodies-hERZb_HC.js
var import_jsx_runtime = require_jsx_runtime();
function Antibodies() {
	const dispatched = useImmune((s) => s.dispatched);
	const dispatch = useImmune((s) => s.dispatch);
	const vaccinate = useImmune((s) => s.vaccinate);
	const vaccinations = useImmune((s) => s.vaccinations);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Adaptive immunity"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "White cells for a Python body"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Innate responders fire on every PR. Adaptive ones remember a signature. Autoimmune guard: security paths never auto-merge. Dispatching an antibody marks linked issues cured in this console and unlocks its playbook."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: ANTIBODIES.map((ab) => {
					const on = dispatched.includes(ab.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: on ? "border-ok/40" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold",
									children: ab.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] uppercase tracking-wider text-muted",
									children: ab.role
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: on ? "ok" : "muted",
									children: on ? "deployed" : "dormant"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: ab.cures
							}),
							ab.issues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-[11px] text-subtle",
								children: ab.issues.map((n) => `#${n}`).join(" · ")
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: on ? "secondary" : "primary",
									disabled: on,
									onClick: () => {
										dispatch(ab.id);
										toast.success(`${ab.name} deployed`);
									},
									children: on ? "In memory" : "Dispatch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/playbooks",
										children: "Playbook"
									})
								})]
							}),
							!ab.autoMergeSafe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] text-warn",
								children: "Human review required — security-adjacent."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] text-muted",
								children: "Safe to auto-propose after CI green."
							})
						]
					}, ab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Vaccination" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Inject a known mutant. If the matching antibody is in memory, the memory-cell path catches it. If not, the body is still naive." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: MUTANTS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => {
							const r = vaccinate(m.id);
							if (r.caught) toast.success(`Caught by ${r.antibody}`);
							else toast.error(`Naive. Deploy ${r.antibody}.`);
						},
						children: ["Inject ", m.label]
					}, m.id))
				}),
				vaccinations.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-2",
					children: vaccinations.slice(0, 8).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: v.caught ? "ok" : "danger",
								className: "mr-2",
								children: v.caught ? "caught" : "missed"
							}),
							v.mutant,
							" · ",
							v.antibody
						]
					}, `${v.t}-${i}`))
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [PLAYBOOKS.length, " playbooks in the library. Deployed antibodies do not push to GitHub — copy the YAML from Playbooks into Tranc3."]
			})
		]
	});
}
//#endregion
export { Antibodies as component };
