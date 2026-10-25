//! Management Center desktop shell.
//!
//! The UI (desktop/) is a static SPA. Rust adds three things the webview
//! cannot do on its own:
//!   * HTTP to the platform services without browser CORS (tauri-plugin-http,
//!     scoped in capabilities/default.json),
//!   * opening the Infinity Portal login page in the system browser
//!     (tauri-plugin-opener),
//!   * a one-shot loopback listener that receives the OAuth redirect
//!     (RFC 8252 section 7.3), written with std only so it adds no dependency.

use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter};

const CALLBACK_EVENT: &str = "infinity://callback";
const DONE_PAGE: &str = "<!doctype html><meta charset=utf-8><title>Signed in</title>\
<body style=\"font-family:system-ui;background:#09090b;color:#eceff2;display:grid;place-items:center;height:100vh;margin:0\">\
<main><h1>Infinity sign-in received</h1><p>You can close this tab and return to the Management Center.</p></main>";

/// Reads the request line and returns the path+query, e.g. "/callback?code=..&state=..".
fn read_target(stream: &TcpStream) -> Option<String> {
    let mut line = String::new();
    BufReader::new(stream).read_line(&mut line).ok()?;
    let mut parts = line.split_whitespace();
    match (parts.next(), parts.next()) {
        (Some("GET"), Some(target)) => Some(target.to_string()),
        _ => None,
    }
}

fn respond(mut stream: TcpStream, status: &str, body: &str) {
    let _ = write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\nCache-Control: no-store\r\n\r\n{body}",
        body.len()
    );
}

/// Binds 127.0.0.1 on a free port, returns the port, and waits in the
/// background for one `GET /callback?...`. Its query string is emitted to the
/// UI as `infinity://callback`. The listener closes after that one redirect
/// or when `timeout_secs` passes.
#[tauri::command]
fn infinity_loopback_listen(app: AppHandle, timeout_secs: u64) -> Result<u16, String> {
    let listener = TcpListener::bind(("127.0.0.1", 0)).map_err(|e| format!("cannot open loopback port: {e}"))?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();
    listener.set_nonblocking(true).map_err(|e| e.to_string())?;
    let deadline = Instant::now() + Duration::from_secs(timeout_secs.clamp(30, 900));

    thread::spawn(move || {
        while Instant::now() < deadline {
            match listener.accept() {
                Ok((stream, _)) => {
                    let _ = stream.set_nonblocking(false);
                    let _ = stream.set_read_timeout(Some(Duration::from_secs(5)));
                    match read_target(&stream) {
                        Some(target) if target.starts_with("/callback?") => {
                            let query = target.trim_start_matches("/callback").to_string();
                            respond(stream, "200 OK", DONE_PAGE);
                            let _ = app.emit(CALLBACK_EVENT, query);
                            return;
                        }
                        _ => respond(stream, "404 Not Found", "Not found"),
                    }
                }
                Err(ref e) if e.kind() == std::io::ErrorKind::WouldBlock => thread::sleep(Duration::from_millis(100)),
                Err(_) => return,
            }
        }
    });
    Ok(port)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![infinity_loopback_listen])
        .run(tauri::generate_context!())
        .expect("error while running the Management Center");
}
