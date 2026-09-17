export type PartnerChannel = "internet" | "retail" | "wireless";

/** Tracked mid-funnel landings — prefer internal /cdgcommerce pages first. */
const LANDING_UTM =
  "utm_source=clientbilling&utm_medium=landing&utm_campaign=get-started";

function landingUrl(type: PartnerChannel, campaign?: string): string {
  const utm = campaign
    ? `utm_source=clientbilling&utm_medium=landing&utm_campaign=${campaign}`
    : LANDING_UTM;
  return `https://www.cdgcommerce.com/my_landing/?R=470&type=${type}&${utm}`;
}

/**
 * CDG-published claims we cite carefully. Do not invent new stats.
 * Always attribute as "CDG publishes…" / "CDG states…" in UI copy.
 */
export const cdgClaims = {
  volumeBands: {
    simple: {
      label: "Under ~$10K / month",
      range: "~$1K–$10K/mo",
      model: "Simple pricing",
      note: "CDG publishes simple pricing for lower monthly volume.",
      anchor: "volume-under-10k",
    },
    interchangePlus: {
      label: "$10K–$200K / month",
      range: "$10K–$200K/mo",
      model: "Interchange-plus",
      note: "CDG publishes interchange-plus for mid-volume merchants.",
      anchor: "volume-10k-200k",
    },
    wholesale: {
      label: "$200K+ / month",
      range: "$200K+/mo",
      model: "Wholesale",
      note: "CDG publishes wholesale options for higher volume.",
      anchor: "volume-200k-plus",
    },
  },
  interchangePlusMarkup: {
    online: { percent: "0.35%", perTxn: "$0.15", label: "Online" },
    retail: { percent: "0.30%", perTxn: "$0.10", label: "Retail" },
    caveat:
      "Interchange and card-network fees are separate from CDG’s published processor markup.",
  },
  features: [
    "Online and retail merchant accounts",
    "Recurring billing",
    "Quantum and Authorize.Net gateways",
    "Invoicing",
    "Virtual terminal",
    "POS and mobile payment options",
  ],
  contract: {
    noLongTerm: "CDG states there is no mandatory long-term contract.",
    noTerminationFee: "CDG states there is no termination fee.",
  },
  approval: "CDG states typical approval is about 1–3 business days.",
  trust: [
    "Founded in 1998 (as CDG states)",
    "Serves thousands of merchants (as CDG states)",
    "U.S.-based support (as CDG states)",
    "350+ integrations (as CDG states)",
    "~97% active-client satisfaction / retention claim (as CDG publishes)",
  ],
} as const;

export const siteConfig = {
  name: "ClientBilling",
  domain: "clientbilling.com",
  url: "https://clientbilling.com",
  description:
    "Compare merchant accounts, processing costs, recurring billing, payment gateways, invoicing, and POS options. Independent guides with a transparent CDG Commerce affiliate partnership.",
  tagline: "Find the right payment processing setup for your business",
  locale: "en_US",
  author: "ClientBilling",
  twitterHandle: "@clientbilling",
  partnerName: "CDG Commerce",
  /** Bottom-of-funnel money CTA — ONLY tracked conversion URL for money intent. */
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL ||
    "https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site",
  /** Optional mid-funnel tracked landings (use only after internal pages). */
  partnerLandings: {
    internet: landingUrl("internet", "get-started-internet"),
    retail: landingUrl("retail", "get-started-retail"),
    wireless: landingUrl("wireless", "get-started-wireless"),
  } as const satisfies Record<PartnerChannel, string>,
  /** Internal explore paths — replace outbound "Explore Internet/Retail/Wireless". */
  partnerInternalPaths: {
    internet: "/cdgcommerce/online-payments",
    retail: "/cdgcommerce/retail",
    wireless: "/cdgcommerce/wireless",
    recurring: "/cdgcommerce/recurring-billing",
    hub: "/cdgcommerce",
    fit: "/cdgcommerce#fit",
  } as const,
  partnerChannels: [
    {
      id: "internet" as const,
      title: "Online / Internet",
      description:
        "Online payments, e-commerce, invoicing, and recurring billing for digital and remote-first businesses.",
      body: "Compare CDG Commerce online merchant options when you sell on the web, invoice remotely, or run subscription software.",
      href: "/cdgcommerce/online-payments",
    },
    {
      id: "retail" as const,
      title: "Retail",
      description:
        "In-store and point-of-sale acceptance for brick-and-mortar and hybrid retailers.",
      body: "Compare CDG Commerce retail / POS options when you take payments at a counter, on the floor, or across multiple locations.",
      href: "/cdgcommerce/retail",
    },
    {
      id: "wireless" as const,
      title: "Wireless / Mobile",
      description:
        "Mobile and on-the-go card acceptance for field teams and pop-up sellers.",
      body: "Compare CDG Commerce wireless / mobile payment options when your team closes deals away from a fixed register.",
      href: "/cdgcommerce/wireless",
    },
  ],
  nav: [
    { href: "/", label: "Home" },
    { href: "/cdgcommerce", label: "CDG Commerce" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ],
  footerNav: [
    { href: "/cdgcommerce", label: "CDG Commerce guide" },
    { href: "/cdgcommerce/online-payments", label: "Online payments" },
    { href: "/cdgcommerce/retail", label: "Retail & POS" },
    { href: "/cdgcommerce/recurring-billing", label: "Recurring billing" },
    { href: "/cdgcommerce/wireless", label: "Wireless / mobile" },
    { href: "/blog", label: "Blog & reviews" },
    { href: "/about", label: "About" },
    { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;

/**
 * Map blog topics/tags to a mid-funnel channel for internal explore links.
 */
export function channelForTags(tags: string[]): PartnerChannel {
  const haystack = tags.map((t) => t.toLowerCase()).join(" ");
  if (
    /\b(pos|point[- ]of[- ]sale|in[- ]store|retail|brick)\b/.test(haystack)
  ) {
    return "retail";
  }
  if (/\b(mobile|wireless|field|on[- ]the[- ]go)\b/.test(haystack)) {
    return "wireless";
  }
  return "internet";
}

export function internalPathForChannel(channel: PartnerChannel): string {
  return siteConfig.partnerInternalPaths[channel];
}

/** Soft CTA copy helpers — avoid cold "Apply for a merchant account" as first interaction. */
export const softCtaCopy = {
  seePricing: "See CDG Commerce Pricing & Options",
  isRightFit: "Is CDG Right for My Business?",
  checkEligibility: "Check eligibility with CDG Commerce",
  comparePricing: "Compare CDG Pricing",
  seeIfFits: "See if CDG fits",
  checkCdgOptions: "Check CDG Options",
} as const;

export type SiteConfig = typeof siteConfig;
