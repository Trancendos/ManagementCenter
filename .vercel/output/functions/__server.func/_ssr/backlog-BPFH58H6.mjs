import { i as __toESM } from "../_runtime.mjs";
import { u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as EPICS, i as useImmune, l as Button, o as STORIES, r as phaseProgress } from "./router-B1BTcNy8.mjs";
import { n as Card, t as Badge } from "./card-BFPabAjf.mjs";
import { t as Progress } from "./progress-Dj8rbQiP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backlog-BPFH58H6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed left-1/2 top-1/2 z-50 w-[min(560px,calc(100vw-1.5rem))] max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-panel)]", className),
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
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-semibold pr-8", className),
		...props
	});
}
function DialogDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
		className: cn("mt-2 text-sm text-muted leading-relaxed", className),
		...props
	});
}
var COLS = [
	{
		id: "backlog",
		label: "Backlog"
	},
	{
		id: "ready",
		label: "Ready"
	},
	{
		id: "doing",
		label: "Doing"
	},
	{
		id: "done",
		label: "Done"
	}
];
var NEXT = {
	backlog: "ready",
	ready: "doing",
	doing: "done",
	done: null
};
function Backlog() {
	const storyStatus = useImmune((s) => s.storyStatus);
	const setStory = useImmune((s) => s.setStory);
	const [open, setOpen] = (0, import_react.useState)(null);
	const totalSp = STORIES.reduce((a, s) => a + s.sp, 0);
	const doneSp = STORIES.filter((s) => storyStatus[s.id] === "done").reduce((a, s) => a + s.sp, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted",
					children: "Agile board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-tight",
					children: "Four epics. One maintainer. No theatre."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
					children: "Definition of Ready: AC written, dependencies listed, sized ≤ 8 SP or split. Definition of Done: CI green, docs updated, playbook in git, branch deleted. Advance cards in this session — they persist locally."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: EPICS.map((e) => {
					const p = phaseProgress(storyStatus, e.phase);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-wider text-muted",
								children: e.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-display font-semibold",
								children: e.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-3",
								value: p.pct
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-xs text-muted",
								children: [
									p.done,
									"/",
									p.total
								]
							})
						]
					}, e.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Velocity budget ~13 SP / 2-week sprint. Board total ",
					totalSp,
					" SP · done ",
					doneSp,
					" SP."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: COLS.map((col) => {
					const items = STORIES.filter((s) => (storyStatus[s.id] ?? "backlog") === col.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-surface/60 p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mb-3 text-[11px] uppercase tracking-[0.16em] text-muted",
							children: [col.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 font-mono text-fg",
								children: items.length
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen(s),
								className: "w-full rounded-md border border-border bg-elevated p-3 text-left hover:border-border-strong",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] text-muted",
										children: s.id
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										tone: "muted",
										children: [s.sp, " SP"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-snug",
									children: s.title
								})]
							}) }, s.id))
						})]
					}, col.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(open),
				onOpenChange: (v) => !v && setOpen(null),
				children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						open.id,
						" · ",
						open.title
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDesc, { children: [
						open.kind,
						" · ",
						open.sp,
						" SP · ~",
						open.days,
						"d · phase ",
						open.phase,
						open.issues.length ? ` · issues ${open.issues.map((n) => `#${n}`).join(", ")}` : ""
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Acceptance",
						items: open.ac
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Ready",
						items: open.dor
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Done",
						items: open.dod
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [COLS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: storyStatus[open.id] === c.id ? "primary" : "secondary",
							onClick: () => setStory(open.id, c.id),
							children: c.label
						}, c.id)), NEXT[storyStatus[open.id] ?? "backlog"] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => {
								const n = NEXT[storyStatus[open.id] ?? "backlog"];
								if (n) setStory(open.id, n);
							},
							children: "Advance"
						}) : null]
					})
				] }) : null
			})
		]
	});
}
function Block({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-[11px] uppercase tracking-[0.14em] text-muted"),
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 list-disc space-y-1 pl-4 text-sm text-fg",
			children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: it }, it))
		})]
	});
}
//#endregion
export { Backlog as component };
