export type PartnerChannel = "internet" | "retail" | "wireless";

/** Tracked mid-funnel landings (R=470) — use for Online / Retail / Wireless Explore CTAs. */
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
  /** Soft volume selector bands — do not assert an exact wholesale cutoff. */
  volumeBands: {
    under10k: {
      label: "Under $10K / month",
      range: "Under $10K/mo",
      model: "Volume band",
      note: "Often a starting point when comparing flat-rate simplicity to other structures.",
      anchor: "volume-under-10k",
    },
    from10kTo25k: {
      label: "$10K–$25K / month",
      range: "$10K–$25K/mo",
      model: "Volume band",
      note: "A common range where merchants start comparing flat-rate vs interchange-plus.",
      anchor: "volume-10k-25k",
    },
    from25kTo200k: {
      label: "$25K–$200K / month",
      range: "$25K–$200K/mo",
      model: "Volume band",
      note: "Mid-volume merchants often weigh interchange-plus transparency against other offers.",
      anchor: "volume-25k-200k",
    },
    over200k: {
      label: "$200K+ / month",
      range: "$200K+/mo",
      model: "Volume band",
      note: "Higher volume may open wholesale conversations — confirm with CDG, not a hard cutoff.",
      anchor: "volume-200k-plus",
    },
  },
  pricingModelsNote:
    "CDG offers flat-rate, interchange-plus, and wholesale pricing. The best option depends partly on your monthly volume and card mix — get a free quote rather than assuming a published band is a quote.",
  interchangePlusMarkup: {
    online: { percent: "0.35%", perTxn: "$0.15", label: "Online" },
    retail: { percent: "0.30%", perTxn: "$0.10", label: "Retail" },
    caveat:
      "Interchange and card-network fees are separate from CDG’s published processor markup.",
  },
  features: [
    "Online, retail, and mobile payments",
    "Recurring billing and invoicing",
    "Quantum and Authorize.Net gateways (as CDG lists)",
    "Virtual terminal",
    "POS and mobile payment options",
    "Multiple pricing structures (flat-rate, interchange-plus, wholesale)",
  ],
  whyConsider: [
    "~28 years in payments / founded 1998 (as CDG states)",
    "24/7/365 U.S.-based support (as CDG states)",
    "350+ integrations (as CDG states)",
    "Recurring billing and invoicing (as CDG lists)",
    "Online, retail, and mobile payment options (as CDG lists)",
    "Multiple pricing structures — flat-rate, interchange-plus, and wholesale (as CDG publishes)",
    "No mandatory long-term contract / no termination fee on Interchange Plus (as CDG states)",
  ],
  contract: {
    noLongTerm: "CDG states there is no mandatory long-term contract.",
    noTerminationFee:
      "CDG states there is no termination fee on Interchange Plus.",
  },
  approval: "CDG states typical approval is about 1–3 business days.",
  trust: [
    "Founded in 1998 / ~28 years (as CDG states)",
    "24/7/365 U.S.-based support (as CDG states)",
    "350+ integrations (as CDG states)",
    "Serves thousands of merchants (as CDG states)",
    "~97% active-client satisfaction / retention claim (as CDG publishes)",
  ],
  fitIf: [
    "You are U.S.-based",
    "You accept (or plan to accept) cards online, in person, and/or remotely",
    "You need recurring billing or invoicing alongside card acceptance",
    "You want gateway flexibility (CDG lists Quantum and Authorize.Net)",
    "You prefer U.S.-based human support",
    "You care about how processing is structured — not only a headline rate",
  ],
  notFitIf: [
    "You are not U.S.-based — CDG states they cannot accept internationally based / non-U.S. merchants",
    "Your business is in adult, gambling, or other categories CDG excludes (confirm current restricted categories directly with CDG)",
    "You need a processor that primarily underwrites non-U.S. entities",
  ],
} as const;

export const siteConfig = {
  name: "ClientBilling",
  domain: "clientbilling.com",
  url: "https://clientbilling.com",
  description:
    "Payments and billing guidance for businesses that want to get paid better — merchant accounts, online payments, recurring billing, invoicing, and POS. Independent editorial with a transparent CDG Commerce affiliate partnership.",
  tagline: "Payments and billing guidance for businesses that want to get paid better",
  subtitle:
    "Merchant accounts · online payments · recurring billing · invoicing · POS",
  locale: "en_US",
  author: "ClientBilling",
  twitterHandle: "@clientbilling",
  partnerName: "CDG Commerce",
  /** Bottom-of-funnel money CTA — ONLY tracked conversion URL for money intent. */
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL ||
    "https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site",
  /** Mid-funnel tracked landings (R=470) for Online / Retail / Wireless Explore. */
  partnerLandings: {
    internet: landingUrl("internet", "get-started-internet"),
    retail: landingUrl("retail", "get-started-retail"),
    wireless: landingUrl("wireless", "get-started-wireless"),
  } as const satisfies Record<PartnerChannel, string>,
  partnerInternalPaths: {
    internet: "/cdgcommerce/online-payments",
    retail: "/cdgcommerce/retail",
    wireless: "/cdgcommerce/wireless",
    recurring: "/cdgcommerce/recurring-billing",
    b2b: "/cdgcommerce/b2b",
    hub: "/cdgcommerce",
    fit: "/cdgcommerce#fit",
    getStarted: "/get-started",
  } as const,
  partnerChannels: [
    {
      id: "internet" as const,
      title: "Online Payments",
      shortTitle: "Online / Internet",
      description:
        "Ecommerce, websites, virtual terminal, and payment gateways for digital sellers.",
      body: "Compare CDG Commerce online merchant options when you sell on the web, invoice remotely, or run subscription software.",
      href: "/cdgcommerce/online-payments",
      exploreKind: "landing" as const,
      landingKey: "internet" as const,
    },
    {
      id: "retail" as const,
      title: "In-Person Payments",
      shortTitle: "Retail",
      description:
        "Retail, POS, countertop, and NFC acceptance for brick-and-mortar and hybrid sellers.",
      body: "Compare CDG Commerce retail / POS options when you take payments at a counter, on the floor, or across multiple locations.",
      href: "/cdgcommerce/retail",
      exploreKind: "landing" as const,
      landingKey: "retail" as const,
    },
    {
      id: "wireless" as const,
      title: "Mobile Payments",
      shortTitle: "Wireless / Mobile",
      description:
        "Field service, events, markets, and on-the-go card acceptance.",
      body: "Compare CDG Commerce wireless / mobile payment options when your team closes deals away from a fixed register.",
      href: "/cdgcommerce/wireless",
      exploreKind: "landing" as const,
      landingKey: "wireless" as const,
    },
  ],
  intentPaths: [
    {
      id: "online",
      title: "Online Payments",
      description:
        "Ecommerce, websites, virtual terminal, and gateway options for digital and remote-first sales.",
      exploreLabel: "Explore Online Payments",
      exploreKind: "landing" as const,
      landingKey: "internet" as PartnerChannel,
      exploreHref: "/cdgcommerce/online-payments",
    },
    {
      id: "inperson",
      title: "In-Person Payments",
      description:
        "Retail, POS, countertop, and NFC acceptance for stores and hybrid locations.",
      exploreLabel: "Explore In-Person Payments",
      exploreKind: "landing" as const,
      landingKey: "retail" as PartnerChannel,
      exploreHref: "/cdgcommerce/retail",
    },
    {
      id: "mobile",
      title: "Mobile Payments",
      description:
        "Field service, events, markets, and wireless card acceptance on the go.",
      exploreLabel: "Explore Mobile Payments",
      exploreKind: "landing" as const,
      landingKey: "wireless" as PartnerChannel,
      exploreHref: "/cdgcommerce/wireless",
    },
    {
      id: "recurring",
      title: "Recurring & Invoicing",
      description:
        "Subscriptions, scheduled payments, and emailed invoices alongside card acceptance.",
      exploreLabel: "Explore Recurring & Invoicing",
      exploreKind: "internal" as const,
      landingKey: null,
      exploreHref: "/cdgcommerce/recurring-billing",
    },
    {
      id: "b2b",
      title: "B2B Payments",
      description:
        "Invoicing, virtual terminal, and Level 2/3 scenarios common in business-to-business sales.",
      exploreLabel: "Explore B2B Payments",
      exploreKind: "internal" as const,
      landingKey: null,
      exploreHref: "/cdgcommerce/b2b",
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
    { href: "/cdgcommerce/b2b", label: "B2B payments" },
    { href: "/cdgcommerce/wireless", label: "Wireless / mobile" },
    { href: "/get-started", label: "Get started" },
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

export function landingUrlForChannel(channel: PartnerChannel): string {
  return siteConfig.partnerLandings[channel];
}

/** Soft CTA copy — prefer quote/options language before cold Apply. */
export const softCtaCopy = {
  seeOptions: "See CDG Options",
  getFreeQuote: "Get a Free CDG Quote",
  seePricing: "See CDG Options",
  isRightFit: "Is CDG Right for My Business?",
  checkEligibility: "Check eligibility with CDG Commerce",
  applyMerchant: "Apply for a merchant account",
  comparePricing: "See CDG Options",
  seeIfFits: "See if CDG fits",
  checkCdgOptions: "See CDG Options",
} as const;

export type SiteConfig = typeof siteConfig;
