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
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL ||
    "https://secure.cdgcommerce.com/onlineapp/onlineapp-ht-newV2.php?agentid=470&appcode=CLIENTBILLING&utm_source=clientbilling&utm_medium=cta&utm_campaign=site",
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

export type SiteConfig = typeof siteConfig;
