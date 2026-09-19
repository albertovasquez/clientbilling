/**
 * Pure checks for billing canonicalization and event hashes (decision 0025).
 * Run via npm run test:pure.
 */
import { canonicalJson, utcDate, utcTimestamp } from "../src/lib/billing/canonical";
import { eventHash, payloadHash } from "../src/lib/billing/hash";

function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
  console.log("ok:", msg);
}

const a = { b: 2, a: 1, nested: { z: null, y: 3 } };
const json = canonicalJson(a);
assert(json === '{"a":1,"b":2,"nested":{"y":3,"z":null}}', "keys sorted, nulls kept");
assert(canonicalJson(a) === canonicalJson({ a: 1, b: 2, nested: { y: 3, z: null } }), "order-independent");

assert(utcDate(new Date("2026-09-18T15:30:00.000Z")) === "2026-09-18", "date is YYYY-MM-DD UTC");
assert(utcTimestamp(new Date("2026-09-18T15:30:00.000Z")) === "2026-09-18T15:30:00.000Z", "timestamp is ISO UTC");

const nonce = "n1";
const body = canonicalJson({ type: "created", amountCents: 100 });
const p1 = payloadHash(nonce, body);
const p2 = payloadHash(nonce, body);
assert(p1 === p2, "payload hash is stable");
assert(p1 !== payloadHash("n2", body), "nonce changes payload hash");
assert(/^[a-f0-9]{64}$/.test(p1), "payload hash is sha256 hex");

const e1 = eventHash("", p1, 1);
const e2 = eventHash(e1, payloadHash("n2", canonicalJson({ type: "sent" })), 2);
assert(/^[a-f0-9]{64}$/.test(e1) && e1 !== e2, "event hashes chain and differ");
assert(eventHash("", p1, 1) === e1, "event hash is stable");
assert(eventHash("", p1, 2) !== e1, "sequence changes event hash");

console.log("All billing canonical checks passed.");
