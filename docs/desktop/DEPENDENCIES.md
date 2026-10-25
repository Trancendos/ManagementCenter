# Dependency validation tracker: Management Center desktop

Checked 2026-10-25. Rule: free, open-source licence, no paid tier needed, a named fallback for each.

| ID | Dependency | Version | Licence | Cost | Why | Fallback if it becomes unsuitable |
|---|---|---|---|---|---|---|
| DEP-MC-D01 | Tauri (Rust crate) | 2.12.5 | MIT OR Apache-2.0 | Free | Desktop shell, MSI + exe bundling | Electron (MIT), larger installers |
| DEP-MC-D02 | @tauri-apps/cli | 2.12.4 | MIT OR Apache-2.0 | Free | Build and bundle commands | `cargo tauri` (same project, Rust-installed CLI) |
| DEP-MC-D03 | @tauri-apps/api | 2.12.4 | MIT OR Apache-2.0 | Free | invoke + events from the UI | none needed; part of Tauri |
| DEP-MC-D04 | tauri-plugin-http / @tauri-apps/plugin-http | 2.8.3 | MIT OR Apache-2.0 | Free | HTTP without browser CORS, CMDB cookie jar | A Rust `#[tauri::command]` using `ureq` (MIT/Apache-2.0) |
| DEP-MC-D05 | tauri-plugin-opener / @tauri-apps/plugin-opener | 2.7.2 | MIT OR Apache-2.0 | Free | Open the Infinity login page in the system browser | `open` crate (MIT) in a command |
| DEP-MC-D06 | WiX Toolset v3 (fetched by Tauri at bundle time) | 3.x | MS-RL | Free | MSI installer | NSIS only (exe) |
| DEP-MC-D07 | NSIS (fetched by Tauri at bundle time) | 3.x | zlib/libpng | Free | setup.exe installer | WiX only (MSI) |
| DEP-MC-D08 | Microsoft Edge WebView2 runtime | system | Free redistributable | Free | Webview on Windows | No alternative: Tauri requires WebView2 on Windows. It ships with Windows 10/11, and the embedded bootstrapper installs it when absent. |

The loopback OAuth listener is written with the Rust standard library only (no `tauri-plugin-oauth`), to avoid a
dependency. PKCE uses WebCrypto (built in). No new runtime npm packages beyond the Tauri ones above.

## Notes

- `package-lock.json` was regenerated: `npm ci` on `main` already failed (lock out of sync: `ajv`, `fast-uri`,
  `json-schema-traverse`). `npm install` fixed that alongside adding the Tauri packages.
- Rust crates are pinned by `src-tauri/Cargo.lock` (committed). Update with `cargo update` and re-run `cargo check`.
- Licence of the Management Center itself is `UNLICENSED` (private) in `Cargo.toml` until Drew picks one.
