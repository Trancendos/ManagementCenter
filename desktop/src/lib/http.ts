/**
 * One fetch for every service call.
 *
 * Inside the desktop app (Tauri) requests go through the Rust HTTP plugin, so
 * they are not subject to browser CORS. That matters because neither Stage
 * Gates nor the CMDB enables CORS, by design. The plugin only reaches the
 * hosts listed in src-tauri/capabilities/default.json.
 *
 * In a plain browser (`npm run desktop:dev`) the Vite dev server proxies the
 * services instead; see desktop/vite.config.ts.
 */

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

let cached: FetchLike | null = null;

export async function getFetch(): Promise<FetchLike> {
  if (cached) return cached;
  if (isTauri()) {
    const mod = await import("@tauri-apps/plugin-http");
    cached = mod.fetch as FetchLike;
  } else {
    cached = (input, init) => globalThis.fetch(input, init);
  }
  return cached;
}

/** Thrown for every failed call. Status 0 means the request never reached the service. */
export class ServiceError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly service: string;

  constructor(service: string, status: number, body: unknown, message: string) {
    super(message);
    this.name = "ServiceError";
    this.service = service;
    this.status = status;
    this.body = body;
  }
}

function explain(status: number, body: unknown): string {
  if (body && typeof body === "object") {
    const b = body as { detail?: unknown; error?: unknown; unmet?: unknown };
    if (b.error === "gate blocked" && Array.isArray(b.unmet)) return `Gate blocked, still needed: ${b.unmet.join(", ")}`;
    if (typeof b.error === "string") return b.error;
    if (typeof b.detail === "string") return b.detail;
  }
  return `The service answered HTTP ${status}.`;
}

export interface JsonRequest {
  service: string;
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
}

export async function requestJson<T>({
  service,
  url,
  method = "GET",
  body,
  headers = {},
  timeoutMs = 8000,
  fetchImpl,
}: JsonRequest): Promise<T> {
  const doFetch = fetchImpl ?? (await getFetch());
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const allHeaders: Record<string, string> = { Accept: "application/json", ...headers };
  if (body !== undefined) allHeaders["Content-Type"] = "application/json";
  let res: Response;
  let text: string;
  try {
    res = await doFetch(url, {
      method,
      headers: allHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      credentials: "include",
    });
    // Read the body inside the timed block too: a service that sends headers then stalls must still time out.
    text = await Promise.race([
      res.text(),
      new Promise<never>((_, reject) => {
        if (controller.signal.aborted) reject(new DOMException("Aborted", "AbortError"));
        controller.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      }),
    ]);
  } catch (e) {
    const reason = e instanceof Error && e.name === "AbortError" ? "timed out" : "is unreachable";
    throw new ServiceError(service, 0, null, `${service} ${reason} at ${url}`);
  } finally {
    clearTimeout(timer);
  }
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      parsed = text;
    }
  }
  if (!res.ok) throw new ServiceError(service, res.status, parsed, explain(res.status, parsed));
  return parsed as T;
}
