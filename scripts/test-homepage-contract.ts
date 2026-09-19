/**
 * Pure checks for the homepage body (ticket #45, spec #41, decision 0021).
 * What a visitor or a machine can observe: the quote link's affiliate
 * reference and its recording, the three browser events the page fires, and
 * the copy rules the page must not break.
 * Run: npx tsx scripts/test-homepage-contract.ts   (no database needed)
 */
import { readFileSync } from "node:fs";
import { browserEventNames } from "../src/lib/browser-events";
import { cta } from "../src/lib/cta";
import { postsBySlug } from "../src/lib/posts";
import { siteConfig } from "../src/lib/site";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
    return;
  }
  console.log("ok:", msg);
}

const homepage = readFileSync("src/app/(marketing)/page.tsx", "utf8");
const footer = readFileSync("src/components/Footer.tsx", "utf8");
const funnel = readFileSync("src/app/app/admin/funnel/page.tsx", "utf8");

// The Payments section's quote link: the affiliate reference comes from the
// site config, and the rung keeps the quote type so recording is unchanged.
const compare = cta("compareCosts");
assert(compare.label === "Compare your card costs", `the quote link reads "${compare.label}"`);
assert(compare.href === siteConfig.quoteUrl, "the quote link's destination comes from the site config");
assert(/[?&]R=470\b/.test(compare.href), "the quote link carries the affiliate reference");
assert(compare.type === "quote", "the rung is a quote rung, so affiliate click recording is unchanged");
assert(compare.external === true, "the quote link is external, so it renders through the tracked affiliate link");

// The page uses the ladder rather than writing its own anchor to CDG.
assert(
  !/cdgcommerce\.com/.test(homepage),
  "the homepage never hand-writes a CDG URL",
);
assert(
  homepage.includes('cta="compareCosts"'),
  "the Payments section reaches CDG through the compareCosts rung",
);

// The disclosure sentence sits beside the quote link, not elsewhere on the page.
const payments = homepage.slice(homepage.indexOf('id="payments"'), homepage.indexOf('id="developers"'));
assert(payments.includes('cta="compareCosts"'), "the quote link is inside the Payments section");
assert(
  /may earn a commission if you sign up with CDG\. Your pricing does not\s+change\./.test(payments),
  "the disclosure sentence sits in the Payments section beside the link",
);

// The three homepage events, and the proof strip's in particular.
for (const name of ["cost_table_edit", "hero_signup_click", "proof_strip_click"]) {
  assert(
    (browserEventNames as readonly string[]).includes(name),
    `the events route accepts ${name}`,
  );
  assert(funnel.includes(`"${name}"`), `the funnel page has a row for ${name}`);
}
assert(
  homepage.includes('event="proof_strip_click"'),
  "the proof strip's verify link records proof_strip_click",
);

// The API reference button is a rung, not a label typed into the page.
const apiRef = cta("apiReference");
assert(apiRef.label === "Read the API reference", `the API rung reads "${apiRef.label}"`);
assert(apiRef.href === "/docs/api", "the API rung goes to the reference");
assert(
  homepage.includes('cta="apiReference"') && !homepage.includes(">\n                  Read the API reference"),
  "the Developers section uses the rung rather than a hand-written label",
);

// Product principle 3: copy never runs ahead of what the code does. The proof
// engine is epic #37, so the strip must not offer a verification today.
assert(
  homepage.includes("Proof is planned."),
  "the proof strip says the proof engine is planned",
);
assert(
  !/how a record is verified|Verified record/.test(homepage),
  "the strip does not claim a verification the code cannot perform",
);
assert(
  homepage.includes('event="hero_signup_click"'),
  "the hero sign-up records hero_signup_click",
);

// Copy the page must carry, from the approved proof.
const mustSay = [
  "One record. Three views. One proof.",
  "The rate is applied to the invoice, not buried in a pricing page.",
  "Processing rates are easy to publish.",
  "The same invoice, readable by software.",
];
for (const phrase of mustSay) {
  assert(homepage.includes(phrase), `the page says "${phrase.slice(0, 48)}"`);
}
for (const label of ["Send", "Collect", "Automate"]) {
  assert(homepage.includes(`title: "${label}"`), `the propositions include ${label}`);
}

// Spec #41 story 39: three guides, and the CDG review among them. postsBySlug
// drops an unknown slug silently, so the page would quietly show fewer rows if
// a post were renamed; assert the three resolve.
const guides = postsBySlug([
  "cdg-commerce-review-2026-pricing-fees-features",
  "cdg-commerce-vs-square",
  "cdg-commerce-pricing-explained",
]);
assert(guides.length === 3, `the three homepage guides all resolve to posts (got ${guides.length})`);
assert(
  guides.every((g) => (g.updated ?? g.date).match(/^\d{4}-\d{2}-\d{2}$/)),
  "every homepage guide has an updated date to show",
);

// The compliance boundary, on every page through the footer.
assert(
  footer.includes("not a payment processor and not the merchant of"),
  "the footer states that ClientBilling is not the processor or the merchant of record",
);
assert(
  footer.includes("Card details are never entered on ClientBilling."),
  "the footer states that card details are never entered here",
);

// Decision 0021: never claim a competitor hides what it publishes. The style
// check enforces this repo-wide; assert it for the homepage copy directly too.
assert(
  !/\bhid(e|es|den|ing)\b/i.test(
    // "hidden" is also a layout utility and an ARIA attribute; neither is a
    // claim. Strip class attributes and aria-hidden before reading the prose.
    homepage
      .replace(/class(?:Name)?=(?:"[^"]*"|'[^']*'|\{`[^`]*`\})/g, "")
      .replace(/aria-hidden(?:=(?:"[^"]*"|\{[^}]*\}))?/g, ""),
  ),
  "no sentence on the page says or implies that anyone hides a fee or a rate",
);

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall homepage contract checks passed");
