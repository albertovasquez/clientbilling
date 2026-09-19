/**
 * MCP refusals must be flagged as errors (issue #66).
 *
 * `isError` is how a client detects a failed tool call, the way a status code
 * does over REST. Without it a missing scope, an exhausted sandbox allowance,
 * and an idempotency conflict all arrive looking like successful writes, and
 * an agent carries on as though a financial action happened.
 *
 * This drives the real endpoint rather than importing the handlers, because
 * `src/lib/mcp/tools.ts` pulls in the PDF renderer through the email module
 * and that subpath does not resolve under tsx. Going over HTTP also tests the
 * transport and the SDK's serialization, which is where the flag has to
 * survive to be worth anything.
 *
 * Usage: npx tsx scripts/test-mcp-deny.ts <origin> <api-key>
 * The key must be a live key with NO scopes, so every tool refuses it.
 * Needs a server already running against a database.
 */
const baseUrl = process.argv[2] ?? "http://localhost:3401";
const apiKey = process.argv[3];

if (!apiKey) {
  console.error("usage: tsx scripts/test-mcp-deny.ts <origin> <zero-scope-api-key>");
  process.exit(1);
}

/** Tool name to arguments that pass schema validation, so execution reaches the scope check. */
const calls: { name: string; args: Record<string, unknown>; scope: string }[] = [
  { name: "list_invoices", args: {}, scope: "invoice:read" },
  { name: "get_payment_costs", args: { amountCents: 250_000 }, scope: "cost:read" },
  {
    name: "create_invoice",
    args: {
      idempotencyKey: "test-deny-1",
      clientName: "Probe",
      lines: [{ description: "a", quantity: 1, unitPrice: 100 }],
    },
    scope: "invoice:write",
  },
  { name: "send_invoice", args: { idempotencyKey: "test-deny-2", id: "inv_probe" }, scope: "invoice:send" },
  { name: "send_reminder", args: { idempotencyKey: "test-deny-3", id: "inv_probe" }, scope: "reminder:send" },
];

let failures = 0;

function check(cond: unknown, msg: string) {
  if (cond) {
    console.log("ok:", msg);
  } else {
    console.error("FAIL:", msg);
    failures += 1;
  }
}

/** The endpoint answers as an SSE stream; the JSON sits on a `data:` line. */
function parseResult(body: string): { isError?: boolean; content?: { text?: string }[] } {
  for (const line of body.split("\n")) {
    if (!line.startsWith("data:")) continue;
    try {
      const msg = JSON.parse(line.slice(5).trim()) as { result?: Record<string, unknown> };
      if (msg.result) return msg.result;
    } catch {
      /* not the line we want */
    }
  }
  return {};
}

async function callTool(name: string, args: Record<string, unknown>) {
  const res = await fetch(`${baseUrl}/api/mcp`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });
  return parseResult(await res.text());
}

async function main() {
  const probe = await fetch(baseUrl).catch(() => null);
  if (!probe?.ok) {
    console.error(`mcp-deny: nothing serving at ${baseUrl}.`);
    process.exit(1);
  }

  for (const { name, args, scope } of calls) {
    const result = await callTool(name, args);
    const text = result.content?.map((c) => c.text ?? "").join("") ?? "";

    // The point of the issue: a refusal a client can actually detect.
    check(result.isError === true, `${name} flags its scope denial with isError`);
    // And one it can still read, so the flag did not cost the reason.
    check(text.includes(scope), `${name} names the missing scope (${scope})`);
  }

  if (failures) {
    console.error(`\nmcp-deny: ${failures} failure(s)`);
    process.exit(1);
  }
  console.log("All MCP denial checks passed.");
}

main().catch((err) => {
  console.error("mcp-deny: error", err);
  process.exit(1);
});
