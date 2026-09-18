export type PartnerChannel = "internet" | "retail" | "wireless";

/** CDG's agent-attributed solution pages, used by the explore CTAs. */
function landingUrl(type: PartnerChannel, campaign: string): string {
  return `https://www.cdgcommerce.com/my_landing/?R=470&type=${type}&utm_source=clientbilling&utm_medium=landing&utm_campaign=${campaign}`;
}

export const siteConfig = {
  name: "ClientBilling",
  domain: "clientbilling.com",
  url: "https://www.clientbilling.com",
  description:
    "Plain-language guides to merchant accounts, processing fees, recurring billing, invoicing, and POS for U.S. businesses. Independent editorial with a disclosed CDG Commerce affiliate partnership.",
  tagline: "Get paid better",
  locale: "en_US",
  twitterHandle: "@clientbilling",
  partnerName: "CDG Commerce",
  /** "Start a CDG application": CDG's secure merchant application, agent 470. */
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL ||
    "https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site",
  /** "Get a free quote from CDG": CDG's quote form (name, email, phone, business type), agent 470. */
  quoteUrl:
    process.env.NEXT_PUBLIC_CDG_QUOTE_URL ||
    "https://www.cdgcommerce.com/applynow/?R=470&utm_source=clientbilling&utm_medium=cta&utm_campaign=quote",
  partnerLandings: {
    internet: landingUrl("internet", "explore-online"),
    retail: landingUrl("retail", "explore-retail"),
    wireless: landingUrl("wireless", "explore-mobile"),
  } as const satisfies Record<PartnerChannel, string>,
  nav: [
    { href: "/cdgcommerce", label: "CDG Commerce" },
    { href: "/blog", label: "Guides" },
    { href: "/about", label: "About" },
  ],
  footerNav: [
    { href: "/cdgcommerce", label: "CDG Commerce review" },
    { href: "/cdgcommerce/online-payments", label: "Online payments" },
    { href: "/cdgcommerce/retail", label: "In-person and POS" },
    { href: "/cdgcommerce/wireless", label: "Mobile payments" },
    { href: "/cdgcommerce/recurring-billing", label: "Recurring billing" },
    { href: "/cdgcommerce/b2b", label: "B2B payments" },
    { href: "/get-started", label: "Get started" },
    { href: "/blog", label: "All guides" },
    { href: "/about", label: "About" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
