# Actions log: Management Center desktop

| Date (UTC) | ID | Action | By |
|---|---|---|---|
| 2026-10-25 | ACT-MC-001 | Read Infinity folder (Portal, Gate, One folders empty; auth lives in Tranc3 `workers/infinity-auth`, port 8005) | Claude |
| 2026-10-25 | ACT-MC-002 | Read Stage Gates v1.0.0 and Atlas CMDB v1.0.0 APIs from the project packages | Claude |
| 2026-10-25 | ACT-MC-003 | Added `desktop/` static SPA build and `src-tauri/` Tauri 2 shell (MSI + NSIS targets). Grok web app untouched; nothing deleted, so nothing archived | Claude |
| 2026-10-25 | ACT-MC-004 | Infinity Portal (OIDC + PKCE + loopback) and Gate (Admin only) sign-in; development token sign-in | Claude |
| 2026-10-25 | ACT-MC-005 | Read-only screens: Project Management > Gates with sign-off certificates; Service Management Center > Locations with Network, vulnerabilities, projects | Claude |
| 2026-10-25 | ACT-MC-006 | Verified: 12 unit tests pass, `tsc` clean, `vite build` clean, `cargo check` clean (Linux), Playwright run against real Stage Gates and CMDB (demo data) | Claude |
| 2026-10-25 | ACT-MC-007 | Review fixes on PR #3: Gate re-checks token expiry while the app is open and refuses tokens without `exp`; session restore keeps the ID-token fallback; request timeout covers the response body; CMDB lists follow all pages; print uses full width and black on white; theme toggle saves only the theme; loopback listener ignores callbacks with the wrong state; HTTP capability narrowed to ports 8705/8765/8005 plus the issuer, with matching Settings validation; OIDC discovery must name its issuer; docs clarified (CMDB uses its own session, WebView2 has no alternative) | Claude |
| 2026-10-25 | ACT-MC-008 | Verified: 15 unit tests pass, `tsc` clean, `vite build` clean, `cargo test --lib` passes (Linux). Not changed: desktop dev server stays on 127.0.0.1:1420 (Tauri devUrl) | Claude |
| 2026-10-25 | ACT-MC-009 | Matched the Infinity-One contract (Infinity-One PR #1): Gate reads `ext.rights` and, when present, admits the Management Center only for `ext.rights["management-center"] == "admin"`; default scope set to `openid email profile infinity offline_access`; README updated. Verified: 16 unit tests pass, `tsc` clean. Sign-in goes live only after Infinity-One merges and deploys | Claude |
