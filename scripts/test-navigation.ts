/**
 * Pure checks for the site navigation (ticket #46, decisions 0021 and 0001):
 * the header reads Invoices, Payments, For agents, Developers, Guides, Sign in
 * with "Create an invoice" as the button, no header item is a CDG brand page,
 * the header button lands on product context and not a bare form, and every
 * CDG URL that the site linked before is still reachable.
 * Run: npx tsx scripts/test-navigation.ts   (no database needed)
 */
import { readFileSync } from "node:fs";
import { cta, ctas } from "../src/lib/cta";
import { cdgPageUrls, siteConfig } from "../src/lib/site";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    failed++;
    console.error("FAIL:", msg);
    return;
  }
  console.log("ok:", msg);
}

const labels = siteConfig.nav.map((item) => item.label);
assert(
  JSON.stringify(labels) ===
    JSON.stringify(["Invoices", "Payments", "For agents", "Developers", "Guides", "Sign in"]),
  `header reads the six items in order (got ${labels.join(", ")})`,
);

const href = (label: string) => siteConfig.nav.find((item) => item.label === label)?.href;
assert(href("Invoices") === "/invoices", "Invoices goes to the invoice product page");
assert(href("Payments") === "/payments", "Payments goes to the payments guide hub");
assert(
  href("For agents") === "/developers/invoicing-api-for-agents",
  "For agents goes to the agent landing",
);
assert(href("Developers") === "/docs/api", "Developers goes to the API reference");
assert(
  href("For agents") !== href("Developers"),
  "For agents and Developers are distinct destinations",
);
assert(href("Guides") === "/blog", "Guides goes to the posts index");
assert(href("Sign in") === "/app/sign-in", "Sign in goes to the app");

// Decision 0021: CDG is not a brand in the hero or the nav.
assert(
  siteConfig.nav.every((item) => !/cdg/i.test(item.label) && !item.href.startsWith("/cdgcommerce")),
  "no header item names CDG or points at a CDG page",
);

// Decision 0021 and ticket #46: the button goes to sign-up, which carries a
// heading and a product paragraph above the form, and it does not repeat a
// destination the nav already has.
const headerCta = cta(siteConfig.headerCta);
assert(headerCta.label === "Create an invoice", `header button reads "Create an invoice" (got "${headerCta.label}")`);
assert(headerCta.href === "/app/sign-up", "header button goes to sign-up");
assert(!headerCta.external, "header button is internal navigation");
assert(
  !siteConfig.nav.some((item) => item.href === headerCta.href),
  "header button does not duplicate a nav item's destination",
);

// The CDG pages keep their URLs and stay linked from the footer or the hub.
const footerHrefs = new Set<string>(siteConfig.footerNav.map((item) => item.href));
assert(cdgPageUrls.length === 6, `six CDG page URLs are inventoried (got ${cdgPageUrls.length})`);
for (const url of cdgPageUrls) {
  assert(footerHrefs.has(url), `${url} is still linked from the footer`);
}
assert(footerHrefs.has("/tools/fee-calculator"), "the calculator is still linked from the footer");
assert(footerHrefs.has("/payments"), "the payments hub is linked from the footer");

// The style guide's CTA table is the ladder a reader is told to pick from, so
// a rung that exists only in code is a rung nobody knows to use. Adding one
// without its row is easy to miss, and nothing caught it before this check.
const styleGuide = readFileSync(new URL("../docs/STYLE_GUIDE.md", import.meta.url), "utf8");
for (const key of Object.keys(ctas)) {
  // Rungs sharing a row are listed comma-separated, so match the key itself.
  const listed = new RegExp(`^\\|[^|]*\\b${key}\\b`, "m").test(styleGuide);
  assert(listed, `the CTA ladder table lists the ${key} rung`);
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall navigation checks passed");
