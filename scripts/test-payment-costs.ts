/**
 * Pure checks for the payment-cost calculator (ticket #43, decision 0021).
 * Run: npx tsx scripts/test-payment-costs.ts   (no database needed)
 */
import { CDG_CHECKED } from "../src/lib/cdg";
import {
  bankTransferSnapshot,
  cdgOnlineSnapshots,
  formulaLabel,
  parseFigure,
  paymentCosts,
  percentFeeCents,
  type RateSnapshot,
} from "../src/lib/payment-costs";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
    return;
  }
  console.log("ok:", msg);
}

const cdg = cdgOnlineSnapshots();
const flat = cdg.find((s) => s.id === "cdg_flat_online")!;
const icp = cdg.find((s) => s.id === "cdg_interchange_plus_online")!;
assert(cdg.length === 2 && flat && icp, "two CDG online snapshots seeded from the rates module");
assert(flat.percentBps === 350 && flat.fixedCents === 30, "flat online parses to 3.50% + $0.30");
assert(icp.percentBps === 35 && icp.fixedCents === 15 && icp.variable[0]?.type === "interchange", "interchange-plus online parses to 0.35% + $0.15 with interchange variable");
assert(flat.source.checkedAt === CDG_CHECKED && flat.source.href?.includes("cdgcommerce.com"), "source name, URL, and checked date pass through");
assert(formulaLabel(flat) === "3.50% + $0.30" && formulaLabel(icp) === "0.35% + $0.15", "formula labels read as published");

const ach = bankTransferSnapshot(100, { example: true, asOf: "2026-09-18" });
const rows = paymentCosts(250000, [flat, icp, ach]);
const byId = Object.fromEntries(rows.map((r) => [r.rateId, r]));
assert(byId.cdg_flat_online.knownFeeCents === 8780 && byId.cdg_flat_online.netCents === 241220, "$2,500 flat: fee $87.80, net $2,412.20");
assert(byId.cdg_interchange_plus_online.knownFeeCents === 890 && byId.cdg_interchange_plus_online.netCents === null && byId.cdg_interchange_plus_online.variableComponents[0]?.amountCents === null, "$2,500 interchange-plus: known $8.90, one variable component, null net");
assert(byId.ach_example.knownFeeCents === 100 && byId.ach_example.netCents === 249900 && byId.ach_example.source.name === "Your setting, example", "$2,500 ACH example: fee $1.00, net $2,499.00, labelled as example");

const cent = paymentCosts(1, [flat]);
assert(cent[0].knownFeeCents === 30 && cent[0].netCents === -29, "one cent on flat rate: fee is the fixed $0.30, net is negative and honest");

assert(percentFeeCents(1000, 350) === 35, "3.50% of $10.00 is exactly $0.35");
assert(percentFeeCents(15, 350) === 1, "3.50% of $0.15 is 0.525 cents and rounds half-up to 1");
assert(percentFeeCents(14, 350) === 0, "3.50% of $0.14 is 0.49 cents and rounds to 0");
assert(percentFeeCents(100, 50) === 1, "0.50% of $1.00 is 0.5 cents and rounds half-up to 1");

assert(paymentCosts(250000, []).length === 0, "empty snapshot list returns empty");
const fixedOnly: RateSnapshot = { id: "wire", rail: "bank_transfer", label: "Wire", percentBps: 0, fixedCents: 2500, variable: [], source: { name: "Your setting", checkedAt: "2026-09-18" } };
assert(paymentCosts(250000, [fixedOnly])[0].knownFeeCents === 2500 && formulaLabel(fixedOnly) === "$25.00 flat", "fixed-fee-only snapshot");
assert(paymentCosts(Number.NaN, [flat])[0].knownFeeCents === 30, "non-numeric amount is treated as zero");
assert(parseFigure("Cost + $0.15") !== null && parseFigure("Cost + $0.15")!.percentBps === 0, "a figure without a percent parses to fixed only");
assert(parseFigure("None published") === null, "a figure without numbers returns null");

if (failed) {
  console.error(`${failed} check(s) failed`);
  process.exit(1);
}
console.log("all payment-cost checks passed");
