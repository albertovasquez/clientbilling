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
  | "signUp"
  | "createInvoice"
  | "api";

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
  signUp: {
    key: "signUp",
    label: "Create an invoice, free",
    href: "/app/sign-up",
    type: "product",
    external: false,
  },
  /**
   * The header button (decision 0001: navigation never lands on a bare form).
   * It goes to the product page, which carries the context and its own sign-up
   * action, not to /app/sign-up.
   */
  createInvoice: {
    key: "createInvoice",
    label: "Create an invoice",
    href: "/invoices",
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
