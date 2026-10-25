/**
 * Static SPA build for the Management Center desktop app (Tauri 2).
 *
 * Separate from the root vite.config.ts on purpose: the Grok web app (TanStack
 * Start + Nitro/Vercel + server auth) is left untouched, while this build
 * emits plain static files into ../dist-desktop for Tauri to bundle.
 *
 * In `npm run desktop:dev` (plain browser) the services are proxied because
 * they do not enable CORS. Override targets with MC_STAGE_GATES_URL / MC_CMDB_URL.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const stageGates = process.env.MC_STAGE_GATES_URL ?? "http://127.0.0.1:8705";
const cmdb = process.env.MC_CMDB_URL ?? "http://127.0.0.1:8765";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  clearScreen: false,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
      "@desktop": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [tailwindcss(), viteReact()],
  server: {
    host: "127.0.0.1",
    port: 1420,
    strictPort: true,
    proxy: {
      "/__svc/stage-gates": { target: stageGates, changeOrigin: true, rewrite: (p) => p.replace(/^\/__svc\/stage-gates/, "") },
      "/__svc/cmdb": {
        target: cmdb,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/__svc\/cmdb/, ""),
        // The CMDB refuses writes (including login) whose Origin is not its own.
        // Dev only: drop the dev server's Origin so the proxied login is same-origin to the CMDB.
        configure: (proxy) => proxy.on("proxyReq", (req) => req.removeHeader("origin")),
      },
    },
  },
  build: {
    outDir: fileURLToPath(new URL("../dist-desktop", import.meta.url)),
    emptyOutDir: true,
    target: "es2022",
  },
});
