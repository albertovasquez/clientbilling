import type { Rating } from "@/components/ui/RatingBadge";

/**
 * What we know about CDG Commerce, with the page each fact came from.
 * Every number on the site should trace back to an entry here, and every
 * section that shows numbers ends with a SourceNote citing the right source.
 * See docs/research/2026-09-17-traffic-gap-report.md, section 7.
 */

/** Date the sources below were last checked. */
export const CDG_CHECKED = "2026-09-17";

export const cdgSources = {
  pricing: {
    label: "CDG Commerce pricing",
    href: "https://www.cdgcommerce.com/pricing/",
  },
  flatRate: {
    label: "CDG Commerce flat rate pricing",
    href: "https://www.cdgcommerce.com/pricing/flat-rate-processing/",
  },
  interchangePlus: {
    label: "CDG Commerce interchange plus pricing",
    href: "https://www.cdgcommerce.com/pricing/interchange-plus-processing/",
  },
  wholesale: {
    label: "CDG Commerce wholesale membership pricing",
    href: "https://www.cdgcommerce.com/pricing/wholesale-subscription-processing/",
  },
  about: {
    label: "CDG Commerce about page",
    href: "https://www.cdgcommerce.com/about/",
  },
  bbb: {
    label: "Better Business Bureau profile",
    href: "https://www.bbb.org/us/fl/port-orange/profile/credit-card-processing-services/cdg-commerce-0733-90711547",
  },
  recurringBilling: {
    label: "CDG Commerce recurring billing",
    href: "https://www.cdgcommerce.com/solutions/recurring-billing/",
  },
  merchantMaverick: {
    label: "Merchant Maverick review",
    href: "https://www.merchantmaverick.com/reviews/cdgcommerce-review/",
  },
} as const;

export type CdgPlanKey = "flatRate" | "interchangePlus" | "wholesale";

export type CdgRate = { figure: string; label: string; detail?: string };

export type CdgPlan = {
  key: CdgPlanKey;
  name: string;
  /** Monthly card volume CDG publishes for the plan. */
  band: string;
  bandShort: string;
  summary: string;
  rates: CdgRate[];
  monthlyFee: string;
  notes: string[];
  source: { label: string; href: string };
};

/** The three plans from CDG's pricing pages. Bands are CDG's, not ours. */
export const cdgPlans: CdgPlan[] = [
  {
    key: "flatRate",
    name: "Flat Rate",
    band: "$1,000 to $10,000 a month",
    bandShort: "Under $10K a month",
    summary:
      "One rate per channel, a small monthly fee, and no interchange to read. Simple, and usually the most expensive per dollar once volume grows.",
    rates: [
      { figure: "2.90% + $0.30", label: "Swiped and mobile" },
      { figure: "3.50% + $0.30", label: "Online" },
    ],
    monthlyFee: "$9.95 a month",
    notes: [
      "Keyed transactions carry a 0.60% surcharge.",
      "Mobile card reader $99.",
      "CDG's quote page says flat rate has no fixed monthly fee; the flat-rate page lists $9.95. We cite the flat-rate page.",
    ],
    source: cdgSources.flatRate,
  },
  {
    key: "interchangePlus",
    name: "Interchange Plus",
    band: "$10,000 to $200,000 a month",
    bandShort: "$10K to $200K a month",
    summary:
      "You pay the card networks' interchange at cost, plus CDG's fixed markup. The markup is published, so the bill is auditable.",
    rates: [
      { figure: "0.35% + $0.15", label: "Online, above interchange" },
      { figure: "0.30% + $0.10", label: "Retail, above interchange" },
      { figure: "0.25% + $0.10", label: "Nonprofit, above interchange" },
    ],
    monthlyFee: "None published",
    notes: [
      "Quantum or Authorize.Net gateway included, no per-transaction gateway fee.",
      "Countertop terminal placement $79 a year, no purchase required.",
      "Interchange and card-network fees are separate and set by the networks.",
    ],
    source: cdgSources.interchangePlus,
  },
  {
    key: "wholesale",
    name: "Wholesale Membership",
    band: "$200,000 and up a month",
    bandShort: "$200K+ a month",
    summary:
      "Interchange at cost plus a flat per-transaction fee, with a membership fee billed annually. Four tiers, each with a monthly volume cap.",
    rates: [
      { figure: "Cost + $0.15", label: "Basic", detail: "$49 a month, up to $25K a month" },
      { figure: "Cost + $0.12", label: "Standard", detail: "$79 a month, up to $75K a month" },
      { figure: "Cost + $0.09", label: "Plus", detail: "$99 a month, up to $200K a month" },
      { figure: "Cost + $0.06", label: "Premium", detail: "$199 a month" },
    ],
    monthlyFee: "$49 to $199 a month, billed annually",
    notes: [
      "Membership fees are paid annually, not monthly.",
      "Countertop terminal placement $79 a year, no purchase required.",
    ],
    source: cdgSources.wholesale,
  },
];

export function cdgPlan(key: CdgPlanKey): CdgPlan {
  return cdgPlans.find((p) => p.key === key) as CdgPlan;
}

/** Business types exactly as CDG's quote form lists them. */
export const cdgBusinessTypes = [
  "Retail / Service",
  "Restaurant",
  "E-Commerce",
  "B2B / Industrial",
  "Non-Profit",
  "Specialty / Other",
] as const;

/** Company facts CDG publishes. */
export const cdgCompany = {
  founded: "1998",
  headquarters: "Port Orange, Florida",
  bbb: "A+, accredited since 2020",
  sponsorBanks: "Registered ISO/MSP of Synovus Bank and Citizens Bank N.A.",
  support: "24/7/365, U.S.-based, in-house (CDG's description)",
  gateways: "Quantum and Authorize.Net",
  integrations: "350+ (CDG's count)",
  approval: "About 1 to 3 business days (CDG's estimate)",
  usOnly: "U.S. businesses only",
} as const;

/** Fees CDG does not publish on its own site. Attribute to the third party. */
export const cdgThirdPartyFees = {
  contract: "Month to month, no early termination fee",
  chargeback: "$25",
  retrieval: "$15",
  batch: "$0.10",
  amexSurcharge: "0.25%",
  ach: "0.75% + $0.15",
  source: cdgSources.merchantMaverick,
} as const;

export const cdgFit = {
  forList: [
    "You are a U.S. business taking cards online, in person, or both",
    "You do $10K a month or more and want a published, auditable markup",
    "You want a gateway included instead of paying Authorize.Net separately",
    "You want to talk to a person when something breaks",
    "You bill on a schedule or by invoice and want that from the same account",
  ],
  notForList: [
    "You are outside the U.S.: CDG does not underwrite non-U.S. merchants",
    "You do under $1K a month and want a free, instant, self-serve account",
    "Your category is one CDG excludes, such as adult or gambling; confirm with CDG",
    "You need pricing you can accept online without a phone call",
  ],
} as const;

/**
 * Editorial score, set 2026-09-17. Method: /methodology.
 * Pricing transparency 4.5: every plan's rates, monthly fee, gateway, and terminal
 *   terms are published; minus 0.5 because the flat-rate monthly fee differs between
 *   CDG's pages and chargeback, ACH, and batch fees are not published at all.
 * Contract terms 4.0: month to month with no early termination fee, but only a third
 *   party reports it; wholesale membership is billed annually; the terminal is a
 *   placement, not owned.
 * Support 4.5: 24/7/365 U.S.-based in-house support is CDG's own claim and matches
 *   third-party reviews; minus 0.5 because we have not tested it ourselves.
 * Overall is the mean, 4.3.
 */
export const cdgRating: Rating = {
  overall: 4.3,
  pricing: 4.5,
  contract: 4.0,
  support: 4.5,
};

export const cdgBestFor =
  "U.S. merchants doing $10K to $200K a month who want interchange plus with the gateway included";
