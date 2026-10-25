import { test } from "node:test";
import assert from "node:assert/strict";
import { classify, formatRef } from "../src/lib/ids.ts";
import { networkView, type Relationship } from "../src/lib/services/cmdb.ts";
import { StageGatesClient } from "../src/lib/services/stage-gates.ts";
import { ServiceError } from "../src/lib/http.ts";

test("reference numbers classify, including the PID/SID clash", () => {
  assert.equal(classify("PRN-0042"), "project");
  assert.equal(classify("airn-0001"), "ai");
  assert.equal(classify("PID-INF"), "product-or-location");
  assert.equal(classify("SID-INF-01"), "service-or-agent");
  assert.equal(classify("INC-1234"), "incident");
  assert.equal(classify("nonsense"), null);
  assert.equal(formatRef("PRN", 42), "PRN-0042");
  assert.throws(() => formatRef("INC", 0));
});

test("network view keeps only links with a port or protocol, sorted by port", () => {
  const rel = (o: Partial<Relationship>): Relationship => ({ id: "r", source_id: "me", target_id: "x", kind: "connects_to", label: "", protocol: "", port: null, ...o });
  const view = networkView("me", [
    rel({ id: "1", port: 8765, protocol: "HTTP" }),
    rel({ id: "2", kind: "documents" }),
    rel({ id: "3", source_id: "peer", target_id: "me", port: 22, protocol: "SSH" }),
  ]);
  assert.equal(view.length, 2);
  assert.deepEqual(view.map((v) => [v.port, v.direction]), [[22, "inbound"], [8765, "outbound"]]);
});

test("Stage Gates client sends the bearer token and surfaces service errors", async () => {
  const seen: { url: string; auth: string | undefined }[] = [];
  const fake = async (url: string, init?: RequestInit) => {
    seen.push({ url, auth: (init?.headers as Record<string, string>).Authorization });
    if (url.endsWith("/v1/health")) return new Response(JSON.stringify({ service: "stage-gates", version: "1.0.0", mode: "local", writes_enabled: true }));
    return new Response(JSON.stringify({ detail: "this action needs the admin role" }), { status: 403 });
  };
  const client = new StageGatesClient("http://127.0.0.1:8705", "tok", fake);
  assert.equal((await client.health()).version, "1.0.0");
  assert.equal(seen[0].auth, "Bearer tok");
  await assert.rejects(client.listDeliverables(), (e: unknown) => e instanceof ServiceError && e.status === 403 && /admin role/.test(e.message));
});

test("unreachable service becomes status 0", async () => {
  const client = new StageGatesClient("http://127.0.0.1:1", null, async () => { throw new TypeError("fetch failed"); });
  await assert.rejects(client.health(), (e: unknown) => e instanceof ServiceError && e.status === 0);
});
