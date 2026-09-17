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
  affiliateSignupUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_SIGNUP_URL || "https://example.com/signup",
  nav: [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ],
  footerNav: [
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About & How it works" },
    { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
