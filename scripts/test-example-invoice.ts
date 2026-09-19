/**
 * Pure checks for the homepage example invoice (ticket #44): the amount the
 * visitor types is parsed and bounded, and the cost rows come from the
 * calculator with the CDG and example ACH snapshots.
 * Run: npx tsx scripts/test-example-invoice.ts   (no database needed)
 */
import { formatCents } from "../src/lib/money";
import {
  AMOUNT_MAX_CENTS,
  AMOUNT_MIN_CENTS,
  exampleInvoice,
  exampleInvoiceCosts,
  parseAmountInput,
} from "../src/lib/example-invoice";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
    return;
  }
  console.log("ok:", msg);
}

assert(exampleInvoice.number === "1042", "example invoice is #1042");
assert(exampleInvoice.amountCents === 250000, "default amount is $2,500.00");
assert(exampleInvoice.from === "Northgate Plumbing" && exampleInvoice.to === "Harbor Lane Dental", "fictional parties");

assert(parseAmountInput("2,500") === 250000, "parses a grouped whole number");
assert(parseAmountInput("$1,000.00") === 100000, "parses a dollar sign and cents");
assert(parseAmountInput(" 12.5 ") === 1250, "trims and parses a half dollar");
assert(parseAmountInput("0.004") === null, "rejects an amount below the minimum");
assert(parseAmountInput("1000001") === null, "rejects an amount above the maximum");
assert(parseAmountInput("abc") === null, "rejects letters");
assert(parseAmountInput("") === null, "rejects an empty string");
assert(parseAmountInput("-5") === null, "rejects a negative amount");
assert(parseAmountInput("1e3") === null, "rejects exponent notation");
assert(parseAmountInput(String(AMOUNT_MIN_CENTS / 100)) === AMOUNT_MIN_CENTS, "accepts the minimum");
assert(parseAmountInput(String(AMOUNT_MAX_CENTS / 100)) === AMOUNT_MAX_CENTS, "accepts the maximum");

const rows = exampleInvoiceCosts(250000);
assert(rows.length === 3, "three rails: flat card, interchange-plus card, ACH");
const [flat, icp, ach] = rows;
assert(flat.label === "Card, flat rate" && formatCents(flat.knownFeeCents) === "$87.80", "flat fee $87.80 on $2,500");
assert(flat.netCents !== null && formatCents(flat.netCents) === "$2,412.20", "flat net $2,412.20");
assert(icp.label === "Card, interchange-plus" && formatCents(icp.knownFeeCents) === "$8.90", "interchange-plus markup $8.90");
assert(icp.netCents === null && icp.variableComponents[0]?.label === "varies by card", "interchange-plus net unknown, varies by card");
assert(ach.rail === "bank_transfer" && formatCents(ach.knownFeeCents) === "$1.00", "ACH example fee $1.00");
assert(ach.netCents !== null && formatCents(ach.netCents) === "$2,499.00", "ACH net $2,499.00");
assert(ach.source.name === "Your setting, example", "ACH source says it is an example setting");
assert(flat.source.name.includes("CDG") && /^\d{4}-\d{2}-\d{2}$/.test(flat.source.checkedAt), "card source names CDG with a checked date");

const thousand = exampleInvoiceCosts(100000);
assert(formatCents(thousand[0].knownFeeCents) === "$35.30" && formatCents(thousand[0].netCents ?? 0) === "$964.70", "$1,000 flat: $35.30 fee, $964.70 net");
assert(formatCents(thousand[1].knownFeeCents) === "$3.65", "$1,000 interchange-plus markup $3.65");
assert(formatCents(thousand[2].netCents ?? 0) === "$999.00", "$1,000 ACH net $999.00");

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall example invoice checks passed");
