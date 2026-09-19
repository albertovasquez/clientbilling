import { siteConfig } from "@/lib/site";

/**
 * The CTA ladder. Every button label and destination on the site comes from
 * here so pages cannot invent their own. See docs/STYLE_GUIDE.md, "CTA ladder".
 */
export type CtaKey =
  | "compare"
  | "fit"
  | "quote"
  | "apply"
  | "exploreOnline"
  | "exploreRetail"
  | "exploreMobile"
  | "exploreRecurring"
  | "exploreB2b"
  | "compareCosts"
  | "signUp"
  | "createInvoice"
  | "api"
  | "apiReference"
  | "apiKey";

export type CtaType = "compare" | "fit" | "quote" | "apply" | "explore" | "product";

export type CtaPosition =
  | "hero"
  | "after_pricing"
  | "inline"
  | "verdict"
  | "end"
  | "footer"
  | "nav"
  | "card";

export type Cta = {
  key: CtaKey;
  label: string;
  href: string;
  type: CtaType;
  external: boolean;
};

export const ctas: Record<CtaKey, Cta> = {
  compare: {
    key: "compare",
    label: "Compare CDG pricing",
    href: "/cdgcommerce",
    type: "compare",
    external: false,
  },
  fit: {
    key: "fit",
    label: "See if CDG fits",
    href: "/cdgcommerce#fit",
    type: "fit",
    external: false,
  },
  quote: {
    key: "quote",
    label: "Get a free quote from CDG",
    href: siteConfig.quoteUrl,
    type: "quote",
    external: true,
  },
  apply: {
    key: "apply",
    label: "Start a CDG application",
    href: siteConfig.affiliateSignupUrl,
    type: "apply",
    external: true,
  },
  exploreOnline: {
    key: "exploreOnline",
    label: "Explore CDG online payments",
    href: siteConfig.partnerLandings.internet,
    type: "explore",
    external: true,
  },
  exploreRetail: {
    key: "exploreRetail",
    label: "Explore CDG in-person payments",
    href: siteConfig.partnerLandings.retail,
    type: "explore",
    external: true,
  },
  exploreMobile: {
    key: "exploreMobile",
    label: "Explore CDG mobile payments",
    href: siteConfig.partnerLandings.wireless,
    type: "explore",
    external: true,
  },
  exploreRecurring: {
    key: "exploreRecurring",
    label: "Read the recurring billing guide",
    href: "/cdgcommerce/recurring-billing",
    type: "explore",
    external: false,
  },
  exploreB2b: {
    key: "exploreB2b",
    label: "Read the B2B payments guide",
    href: "/cdgcommerce/b2b",
    type: "explore",
    external: false,
  },
  /**
   * The homepage Payments section (ticket #45, decision 0021). Same quote
   * destination and the same quote type as the `quote` rung, so attribution
   * and click recording are unchanged; the label is the one the merchant is
   * reading at that moment, which is about their card costs and not about
   * CDG's form. The founder specified this label in issue #45.
   */
  compareCosts: {
    key: "compareCosts",
    label: "Compare your card costs",
    href: siteConfig.quoteUrl,
    type: "quote",
    external: true,
  },
  signUp: {
    key: "signUp",
    label: "Create an invoice, free",
    href: "/app/sign-up",
    type: "product",
    external: false,
  },
  /**
   * The header button (decision 0021, ticket #46). It goes to sign-up, whose
   * heading and product paragraph sit above the form, so the click still lands
   * on context. 0021 superseded 0001's navigation clause; the Invoices nav item
   * is what carries the product page.
   */
  createInvoice: {
    key: "createInvoice",
    label: "Create an invoice",
    href: "/app/sign-up",
    type: "product",
    external: false,
  },
  api: {
    key: "api",
    label: "See the API",
    href: "/docs/api",
    type: "product",
    external: false,
  },
  /**
   * The homepage Developers section (ticket #45). Same destination as `api`,
   * worded for a reader who has just seen the JSON and wants the reference
   * rather than an introduction. The founder specified this label in #45.
   */
  apiReference: {
    key: "apiReference",
    label: "Read the API reference",
    href: "/docs/api",
    type: "product",
    external: false,
  },
  /** The agents landing's primary action: a key is what a developer needs first. */
  apiKey: {
    key: "apiKey",
    label: "Create an API key",
    href: "/app/settings/api",
    type: "product",
    external: false,
  },
};

export function cta(key: CtaKey): Cta {
  return ctas[key];
}

/** Pick the explore rung that matches an article's tags. Defaults to online. */
export function exploreCtaForTags(tags: string[]): CtaKey {
  const haystack = tags.map((t) => t.toLowerCase()).join(" ");
  if (/\b(pos|point[- ]of[- ]sale|in[- ]store|retail|restaurant)\b/.test(haystack)) {
    return "exploreRetail";
  }
  if (/\b(mobile|wireless|field|on[- ]the[- ]go)\b/.test(haystack)) {
    return "exploreMobile";
  }
  if (/\b(recurring|subscription|dunning|invoic)/.test(haystack)) {
    return "exploreRecurring";
  }
  if (/\bb2b\b/.test(haystack)) {
    return "exploreB2b";
  }
  return "exploreOnline";
}
