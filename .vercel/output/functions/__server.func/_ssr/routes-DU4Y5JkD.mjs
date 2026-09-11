import { n as GAPS, o as PULLS, s as REPO, t as CHECKLIST } from "./catalog-DLKkkm-g.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as ArrowRight, o as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as EPICS, i as useImmune, l as Button, n as gradeFromState, r as phaseProgress, s as ANTIBODIES } from "./router-B1BTcNy8.mjs";
import { a as CardTitle, i as CardHeader, n as Card, r as CardDesc, t as Badge } from "./card-BFPabAjf.mjs";
import { t as Progress } from "./progress-Dj8rbQiP.mjs";
import { a as Tooltip, i as ResponsiveContainer, n as XAxis, r as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DU4Y5JkD.js
var import_jsx_runtime = require_jsx_runtime();
function Command() {
	const dispatched = useImmune((s) => s.dispatched);
	const healed = useImmune((s) => s.healed);
	const events = useImmune((s) => s.events);
	const checks = useImmune((s) => s.checks);
	const storyStatus = useImmune((s) => s.storyStatus);
	const toggleCheck = useImmune((s) => s.toggleCheck);
	const reset = useImmune((s) => s.reset);
	const { letter, score } = gradeFromState(dispatched, healed);
	const p0 = phaseProgress(storyStatus, 0);
	const criticalOpen = GAPS.filter((g) => g.severity === "critical" && !(g.issue && healed[g.issue])).length;
	const blocked = PULLS.filter((p) => p.blocked).length;
	const nextAb = ANTIBODIES.find((a) => !dispatched.includes(a.id));
	const checked = CHECKLIST.filter((c) => checks[c.id]).length;
	const trend = Array.from({ length: 12 }, (_, i) => {
		const t = 32 + (score - 32) * (i / 11);
		return {
			d: `D${i + 1}`,
			v: Math.round(t)
		};
	});
	const inflammation = score < 50 ? "Chronic inflammation" : score < 75 ? "Recovery in progress" : "Adaptive clearance";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-[0.18em] text-muted",
						children: "Live snapshot · 11 Sep 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl",
						children: [
							"The body detects.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"It does not yet clear."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 max-w-xl text-sm leading-relaxed text-muted",
						children: [
							REPO.owner,
							"/",
							REPO.name,
							" is a self-hosted AI platform with a green idea and a red pipeline. This console turns the forensic work into bounded antibodies, a sequenced backlog, and copy-ready playbooks — still zero cost, still independent."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: reset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), " Reset sim"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col items-center justify-center py-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative size-40 rounded-full",
							style: { background: `conic-gradient(var(--color-accent) ${score}%, var(--color-elevated) 0)` },
							role: "img",
							"aria-label": `Immune score ${score}, grade ${letter}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-[14px] flex flex-col items-center justify-center rounded-full bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-4xl font-semibold tabular-nums",
									children: letter
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs tabular-nums text-muted",
									children: score
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: inflammation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: score < 50 ? "danger" : score < 75 ? "warn" : "ok",
							className: "mt-2",
							children: "Sentinel"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Host vitals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "GitHub census, not README marketing. Open issue count on GitHub includes pull requests — 95 combined, 12 true issues, ~83 PRs, 30 sampled all labeled blocked." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "True issues",
							v: String(REPO.trueOpenIssues)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Open PRs ~",
							v: String(REPO.openPrsApprox),
							warn: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Sample blocked",
							v: `${blocked}/${REPO.sampledPrs}`,
							warn: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Workers claimed",
							v: String(REPO.workersClaimed)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Workers in tree",
							v: String(REPO.workersActual),
							warn: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Bus factor",
							v: "1",
							warn: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Stars / forks",
							v: `${REPO.stars} / ${REPO.forks}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Critical gaps",
							v: String(criticalOpen),
							warn: criticalOpen > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							k: "Antibodies up",
							v: `${dispatched.length}/${ANTIBODIES.length}`
						})
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Phase 0 — sterilise the host" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDesc, { children: [
						p0.done,
						"/",
						p0.total,
						" stories done. Main must stay green for seven days before topology work."
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: p0.pct,
						tone: p0.pct === 100 ? "ok" : "accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-5 space-y-3",
						children: CHECKLIST.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								id: c.id,
								checked: Boolean(checks[c.id]),
								onChange: () => toggleCheck(c.id),
								className: "mt-1 size-4 accent-[var(--color-accent)]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: c.id,
								className: "text-sm leading-snug text-fg",
								children: c.label
							})]
						}, c.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-muted",
						children: [
							checked,
							" of ",
							CHECKLIST.length,
							" cleared in this session"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Immune trend" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Projected recovery if dispatched antibodies stay in place." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: trend,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "d",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-elevated)",
										border: "1px solid var(--color-border)",
										fontSize: 12,
										color: "var(--color-fg)"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "v",
										stroke: "var(--color-accent)",
										fill: "var(--color-accent)",
										fillOpacity: .18,
										strokeWidth: 1.6
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: EPICS.map((e) => {
							const p = phaseProgress(storyStatus, e.phase);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md bg-elevated p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] uppercase tracking-wider text-muted",
									children: e.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-sm tabular-nums",
									children: [Math.round(p.pct), "%"]
								})]
							}, e.id);
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Next antibody" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Antibodies propose fixes. They never silent-merge security paths. Dispatch here unlocks the matching playbook." })] }), nextAb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: nextAb.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: nextAb.cures
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/antibodies",
							children: ["Open antibodies ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ok",
					children: "All antibodies deployed. Run vaccination on the Antibodies board."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Event lymph" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDesc, { children: "Session log. Newest first." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-48 space-y-2 overflow-auto pr-1",
					"aria-live": "polite",
					children: events.slice(0, 8).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-2 font-mono text-[11px] text-subtle",
							children: e.t ? new Date(e.t).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit"
							}) : "t0"
						}), e.msg]
					}, `${e.t}-${i}`))
				})] })]
			})
		]
	});
}
function Stat({ k, v, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[11px] uppercase tracking-[0.14em] text-muted",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: `mt-1 font-display text-2xl font-semibold tabular-nums ${warn ? "text-warn" : "text-fg"}`,
		children: v
	})] });
}
//#endregion
export { Command as component };
