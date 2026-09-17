export type PartnerChannel = "internet" | "retail" | "wireless";

const LANDING_UTM =
  "utm_source=clientbilling&utm_medium=landing&utm_campaign=get-started";

function landingUrl(type: PartnerChannel, campaign?: string): string {
  const utm = campaign
    ? `utm_source=clientbilling&utm_medium=landing&utm_campaign=${campaign}`
    : LANDING_UTM;
  return `https://www.cdgcommerce.com/my_landing/?R=470&type=${type}&${utm}`;
}

export const siteConfig = {
  name: "ClientBilling",
  domain: "clientbilling.com",
  url: "https://clientbilling.com",
  description:
    "Practical billing best practices for B2B SaaS, subscription businesses, and teams that invoice customers. Clear guidance on invoicing, collections, and revenue operations.",
  tagline: "Billing best practices for growing B2B teams",
  locale: "en_US",
  author: "ClientBilling",
  twitterHandle: "@clientbilling",
  partnerName: "CDG Commerce",
  /** Primary money CTA — CDG Commerce merchant apply (agent 470). */
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL ||
    "https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site",
  /** Mid-funnel channel landings (agent R=470). */
  partnerLandings: {
    internet: landingUrl("internet", "get-started-internet"),
    retail: landingUrl("retail", "get-started-retail"),
    wireless: landingUrl("wireless", "get-started-wireless"),
  } as const satisfies Record<PartnerChannel, string>,
  partnerChannels: [
    {
      id: "internet" as const,
      title: "Internet",
      description:
        "Online payments, e-commerce, invoicing, and recurring billing for digital and remote-first businesses.",
      body: "Explore CDG Commerce internet / online merchant options when you sell on the web, invoice remotely, or run subscription software.",
    },
    {
      id: "retail" as const,
      title: "Retail",
      description:
        "In-store and point-of-sale acceptance for brick-and-mortar and hybrid retailers.",
      body: "Explore CDG Commerce retail / POS options when you take payments at a counter, on the floor, or across multiple locations.",
    },
    {
      id: "wireless" as const,
      title: "Wireless",
      description:
        "Mobile and on-the-go card acceptance for field teams and pop-up sellers.",
      body: "Explore CDG Commerce wireless / mobile payment options when your team closes deals away from a fixed register.",
    },
  ],
  partnerLinks: {
    home: "https://cdgcommerce.com/",
    solutions: "https://cdgcommerce.com/solutions/",
    industry: "https://cdgcommerce.com/industry/",
    about: "https://cdgcommerce.com/about/",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/get-started", label: "Get started" },
    { href: "/about", label: "About" },
  ],
  footerNav: [
    { href: "/blog", label: "Blog" },
    { href: "/get-started", label: "Get started" },
    { href: "/about", label: "About & How it works" },
    { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;

/**
 * Map blog topics/tags to a mid-funnel landing channel.
 * online / invoicing / ecommerce / SaaS → internet
 * POS / in-store / retail → retail
 * mobile / wireless / field → wireless
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
  // Default: online / invoicing / ecommerce / subscriptions / SaaS
  return "internet";
}

export function landingUrlForChannel(channel: PartnerChannel): string {
  return siteConfig.partnerLandings[channel];
}

export type SiteConfig = typeof siteConfig;
