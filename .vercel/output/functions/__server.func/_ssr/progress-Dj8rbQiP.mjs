import { u as cn } from "./catalog-DLKkkm-g.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-Dj8rbQiP.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className, tone = "accent" }) {
	const pct = Math.max(0, Math.min(100, value));
	const fill = tone === "ok" ? "bg-ok" : tone === "warn" ? "bg-warn" : tone === "danger" ? "bg-danger" : "bg-accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-elevated", className),
		role: "progressbar",
		"aria-valuenow": Math.round(pct),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full transition-[width] duration-500", fill),
			style: { width: `${pct}%` }
		})
	});
}
//#endregion
export { Progress as t };
