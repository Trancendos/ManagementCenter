import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-BFPabAjf.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		muted: "bg-elevated text-muted border border-border",
		accent: "bg-accent/15 text-accent border border-accent/25",
		danger: "bg-danger/15 text-danger border border-danger/25",
		warn: "bg-warn/15 text-warn border border-warn/25",
		ok: "bg-ok/15 text-ok border border-ok/25"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-panel)] sm:p-5", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mb-4 flex flex-col gap-1", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("font-display text-lg font-semibold tracking-tight text-fg", className),
		...props
	});
}
function CardDesc({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-muted leading-relaxed", className),
		...props
	});
}
//#endregion
export { CardTitle as a, CardHeader as i, Card as n, CardDesc as r, Badge as t };
