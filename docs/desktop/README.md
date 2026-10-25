# Management Center desktop (Windows exe + MSI)

Product: Management Center (MC) · Release: desktop 0.1.0 (read-only) · Date: 2026-10-25

The Management Center desktop client is a static single-page app (`desktop/`) wrapped by Tauri 2 (`src-tauri/`).
The existing Grok web app (`src/`, TanStack Start + Nitro) is unchanged; the desktop build only reuses its design
tokens and UI components.

## What this release does

| Area | Status | Source |
|---|---|---|
| Infinity Portal sign-in (OIDC + PKCE, loopback redirect) | Built, not yet tested against a live issuer | `desktop/src/lib/infinity/` |
| Development sign-in (paste a token) | Built and tested | same |
| Infinity Gate: rights navigator, Admin-only entry | Built and tested | `gate.ts` |
| Project Management > Gates (projects by stage, criteria, sign-off certificates, print) | Built and tested against Stage Gates v1.0.0 | `project-gates.tsx` |
| Service Management Center > Locations (CMDB items, Network, vulnerabilities, projects) | Built and tested against Atlas CMDB v1.0.0 demo data | `locations.tsx` |
| Incidents, Service Requests, Changes, Problems, Knowledge Base, Agile, Network Topology | Planned placeholders only; no backing service yet | `planned.tsx` |
| Black and White modes | Built | `desktop.css` |

Everything is read-only. Writes (evidence, waivers, advancing a gate, editing CMDB records) stay in TownHall and the
CMDB until the read-only release has been reviewed.

## Sign-in flow

1. **Infinity Portal** — `Sign in with Infinity` opens the issuer's login page in the system browser. Rust listens once
   on `127.0.0.1:<random port>/callback` (RFC 8252). The code is exchanged with PKCE (RFC 7636); state and nonce are checked.
2. **Infinity Gate** — reads `role`, `roles`, `groups` and per-location `permissions` from the token. The Management
   Center opens only for `admin` (a per-location grant for `management-center` overrides platform-wide levels).
3. **Infinity-One** — the account behind the issuer. Not called directly yet (its repo is a README only).

The Gate check is a UI decision. Stage Gates verifies the Infinity bearer token itself before acting. The Atlas CMDB
does not accept Infinity tokens: it checks its own cookie session, opened with a separate CMDB sign-in on the Locations
screen (it has no SSO yet).

The Gate re-checks expiry against the clock: when the token's `exp` passes, the app returns to the Gate. A token without
an `exp` is refused.

The desktop app can only reach the origins in `src-tauri/capabilities/default.json`: ports 8705 (Stage Gates), 8765
(CMDB) and 8005 (Infinity auth) on `127.0.0.1`/`localhost`, plus `https://auth.trancendos.com`. Settings refuses any
other URL. To use a different port, add it to both the capability file and `ALLOWED_ORIGINS` in `desktop/src/lib/config.ts`.

Tokens live in `sessionStorage` only; closing the app signs you out. The CMDB password is never stored.

## Run it

```bash
npm install
npm run desktop:dev        # browser preview on http://127.0.0.1:1420 (services proxied)
npm run desktop:test       # unit tests (node:test, no extra packages)
npm run desktop:typecheck
npm run desktop:build      # static files in dist-desktop/
```

Desktop app (needs Rust stable and, on Windows, WebView2 which ships with Windows 10/11):

```bash
npm run desktop:app        # Tauri dev window
npm run desktop:bundle     # Windows: MSI (WiX) + setup.exe (NSIS) in src-tauri/target/release/bundle/
```

MSI and NSIS installers can only be produced on Windows. Tauri downloads WiX and NSIS automatically on first bundle.

Local services for testing:

```bash
TOWNHALL_JWT_SECRET=<secret> stage-gates serve --port 8705
stage-gates token --sub you --role admin --minutes 60     # paste into Development sign-in
python -m cmdb serve --port 8765                          # needs a viewer account: python -m cmdb user-add
```

## Known gaps (honest list)

- **Infinity issuer not confirmed.** The Infinity-Portal, Infinity-Gate and Infinity-One repos are empty or README only.
  The live auth is Tranc3 `workers/infinity-auth` (port 8005, issuer `https://auth.trancendos.com`, HS256 today).
  Whether it serves OIDC discovery and accepts a public PKCE client with a loopback redirect has not been verified.
- **CMDB has its own login.** Atlas CMDB v1.0.0 only accepts its cookie session, so the MC asks for a CMDB viewer
  account. Fix: let the CMDB accept Infinity tokens.
- **Projects match Locations by name** (`deliverable.location == CMDB item name`) until deliverables carry a `cmdb_id`.
- **Reference numbers (PRN, PID, SID, AIRN) are provisional.** PID and SID already mean Location and agent in the
  existing platform docs (`PID-INF`, `SID-INF-01`). `desktop/src/lib/ids.ts` reports both meanings until decided.
- **Icons are placeholders** generated for the build; swap in brand icons with `npx tauri icon <1024px png>`.
- **No code signing.** Windows SmartScreen will warn on unsigned installers.

Screenshots from the end-to-end run are in `screenshots/`.
