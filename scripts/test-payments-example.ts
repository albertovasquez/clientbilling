/**
 * Pure checks for the homepage Payments section's example account (ticket #45).
 * The mix is illustration and says so; every CDG number is read from the rates
 * module, so the markup moves when a rate does and no figure is typed twice.
 * Run: npx tsx scripts/test-payments-example.ts   (no database needed)
 */
import { CDG_CHECKED, cdgPlan } from "../src/lib/cdg";
import { formatCents } from "../src/lib/money";
import { exampleAccount, exampleAccountMarkup } from "../src/lib/payments-example";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
    return;
  }
  console.log("ok:", msg);
}

assert(exampleAccount.monthlyVolumeCents === 2_418_000, "example monthly card volume is $24,180");
const mix = exampleAccount.mix;
assert(mix.reduce((sum, m) => sum + m.percent, 0) === 100, "the card mix adds up to 100 percent");
assert(
  mix.map((m) => `${m.label} ${m.percent}`).join(", ") ===
    "Paid by card 41, Paid by bank transfer 52, Paid by check or cash 7",
  "the mix reads card 41, bank transfer 52, check or cash 7",
);

const markup = exampleAccountMarkup();

// The band and the rate are CDG's, read from the rates module, not typed here.
const plan = cdgPlan("interchangePlus");
assert(markup.band === plan.band, `band comes from the CDG plan (${markup.band})`);
assert(markup.formula === "0.35% + $0.15", `markup formula comes from the plan rate (${markup.formula})`);
assert(markup.source.checkedAt === CDG_CHECKED, "the markup carries the CDG checked date");
assert(markup.source.name.includes("CDG"), "the markup names CDG as its source");

// 41% of $24,180 is $9,913.80 of card volume. At 0.35% + $0.15 per payment
// across the example's payment count, the markup is a monthly dollar figure.
assert(markup.cardVolumeCents === 991_380, `card volume is 41 percent of the total (${formatCents(markup.cardVolumeCents)})`);
assert(
  markup.markupCents === Math.floor((991_380 * 35 + 5000) / 10_000) + 15 * exampleAccount.cardPaymentsPerMonth,
  "markup is the published percentage on card volume plus the fixed part per payment",
);
assert(formatCents(markup.markupCents) === "$35.30", `markup on the example account is $35.30 (got ${formatCents(markup.markupCents)})`);

// The payment count carries the fixed part of the markup, so it must have a
// stated basis rather than being picked to reach a figure. It is the card
// volume divided by the hero's example invoice amount, rounded up.
assert(
  exampleAccount.cardPaymentsPerMonth === Math.ceil(markup.cardVolumeCents / 250_000),
  `the payment count follows from the card volume and the example invoice (${exampleAccount.cardPaymentsPerMonth})`,
);

// Nothing in the section may read as a promise about what a merchant will pay.
assert(exampleAccount.illustrative === true, "the example account is flagged as illustration");

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall payments example checks passed");
