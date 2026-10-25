# Actions log: Management Center desktop

| Date (UTC) | ID | Action | By |
|---|---|---|---|
| 2026-10-25 | ACT-MC-001 | Read Infinity folder (Portal, Gate, One folders empty; auth lives in Tranc3 `workers/infinity-auth`, port 8005) | Claude |
| 2026-10-25 | ACT-MC-002 | Read Stage Gates v1.0.0 and Atlas CMDB v1.0.0 APIs from the project packages | Claude |
| 2026-10-25 | ACT-MC-003 | Added `desktop/` static SPA build and `src-tauri/` Tauri 2 shell (MSI + NSIS targets). Grok web app untouched; nothing deleted, so nothing archived | Claude |
| 2026-10-25 | ACT-MC-004 | Infinity Portal (OIDC + PKCE + loopback) and Gate (Admin only) sign-in; development token sign-in | Claude |
| 2026-10-25 | ACT-MC-005 | Read-only screens: Project Management > Gates with sign-off certificates; Service Management Center > Locations with Network, vulnerabilities, projects | Claude |
| 2026-10-25 | ACT-MC-006 | Verified: 12 unit tests pass, `tsc` clean, `vite build` clean, `cargo check` clean (Linux), Playwright run against real Stage Gates and CMDB (demo data) | Claude |
