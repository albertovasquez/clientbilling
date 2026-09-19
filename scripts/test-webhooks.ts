/**
 * Pure checks for webhook signing (decision 0026).
 */
import { generateWebhookSecret, signWebhookPayload, verifyWebhookSignature } from "../src/lib/webhooks/sign";
import { hasScope, parseScopes, ALL_SCOPES_STRING } from "../src/lib/api-scopes";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok:", msg);
}

const secret = generateWebhookSecret();
assert(secret.startsWith("whsec_"), "secret prefix");
const body = JSON.stringify({ id: "evt_1", type: "invoice.created" });
const t = 1_700_000_000;
const header = signWebhookPayload(secret, body, t);
assert(header.startsWith(`t=${t},v1=`), "signature header shape");
assert(verifyWebhookSignature(secret, body, header, t), "valid signature verifies");
assert(!verifyWebhookSignature(secret, body + "x", header, t), "tampered body fails");
assert(!verifyWebhookSignature(secret, body, header, t + 400), "stale timestamp fails");
assert(hasScope(parseScopes(ALL_SCOPES_STRING), "invoice:read"), "all scopes parse");
assert(!hasScope(parseScopes("invoice:read"), "payment:record"), "missing scope denied");

console.log("All webhook and scope checks passed.");
