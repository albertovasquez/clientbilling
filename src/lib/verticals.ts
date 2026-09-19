import type { CtaKey } from "@/lib/cta";
import { CDG_CHECKED, cdgPlan, cdgSources } from "@/lib/cdg";

/**
 * Vertical landing kits (roadmap P1). Copy ties free invoicing to existing
 * sourced CDG rates and CTA ladder destinations only. No new fee claims or URLs.
 */

export type VerticalSlug = "contractors" | "agencies" | "consultants" | "wholesale";

export type VerticalKit = {
  slug: VerticalSlug;
  title: string;
  navLabel: string;
  description: string;
  kicker: string;
  audience: string;
  invoiceFit: string[];
  processingFit: string[];
  notFit: string[];
  /** Existing CDG plan key whose published rates we show. */
  planKey: "flatRate" | "interchangePlus" | "wholesale";
  exploreCta: CtaKey;
  channelHref: string;
  channelLabel: string;
};

export const verticals: VerticalKit[] = [
  {
    slug: "contractors",
    title: "Invoicing and card payments for contractors",
    navLabel: "Contractors",
    description:
      "Send job invoices free on ClientBilling, then use published CDG Commerce rates when clients want to pay by card.",
    kicker: "Contractors and trades",
    audience:
      "You bill homeowners and commercial clients for labor and materials, often by the job, and you want a clear invoice today without becoming a payment processor.",
    invoiceFit: [
      "Line items for labor, materials, and tax on one invoice",
      "Payment instructions and an optional pay link on every document",
      "Partial payments when a deposit lands before the final draw",
      "Reminders when a job invoice sits unpaid",
    ],
    processingFit: [
      "Card volume often sits in the mid range where interchange plus is published",
      "Keyed and online invoices are common for deposits and progress payments",
      "You want published markups instead of guessing a flat rate",
    ],
    notFit: [
      "You are under a few thousand dollars a month in cards and a flat rate may still be simpler",
      "You need job costing, payroll, or estimating software",
      "You are outside the U.S.",
    ],
    planKey: "interchangePlus",
    exploreCta: "exploreOnline",
    channelHref: "/cdgcommerce/online-payments",
    channelLabel: "CDG online payments",
  },
  {
    slug: "agencies",
    title: "Invoicing and card payments for agencies",
    navLabel: "Agencies",
    description:
      "Bill retainers and project fees free on ClientBilling, with a path to CDG Commerce when clients pay by card.",
    kicker: "Agencies and studios",
    audience:
      "You invoice brands and businesses for retainers, projects, and monthly services, and you want the invoice tool free while card processing stays on a real merchant account.",
    invoiceFit: [
      "Recurring schedules for retainers and monthly fees",
      "Client statements that show open and paid work",
      "Public invoice links your account managers can send",
      "CSV export for the bookkeeper",
    ],
    processingFit: [
      "Average tickets are often large enough that interchange plus markups matter",
      "Clients may prefer card on the invoice rather than a separate portal",
      "Published online markups are on CDG's pricing pages",
    ],
    notFit: [
      "You need a full agency OS with time tracking and proposals",
      "Most clients pay only by ACH or wire and never ask for card",
      "You are outside the U.S.",
    ],
    planKey: "interchangePlus",
    exploreCta: "exploreB2b",
    channelHref: "/cdgcommerce/b2b",
    channelLabel: "CDG for B2B payments",
  },
  {
    slug: "consultants",
    title: "Invoicing and card payments for consultants",
    navLabel: "Consultants",
    description:
      "Create and send professional invoices free, then compare CDG Commerce when a client asks to pay by card.",
    kicker: "Consultants and freelancers who invoice",
    audience:
      "You bill for advice, implementation, or fractional work, usually net 14 or net 30, and you want unpaid invoices to work even before you have a merchant account.",
    invoiceFit: [
      "Default due days and notes on every new invoice",
      "View tracking when a client opens the link",
      "Reminders, manual or opt-in automatic, to the client on file",
      "No card fields on your invoice page",
    ],
    processingFit: [
      "If card volume is still low, CDG publishes a flat rate band",
      "As volume grows, interchange plus markups are published by channel",
      "You keep settlement on your own merchant account, not ours",
    ],
    notFit: [
      "You only need a personal payment link and never send formal invoices",
      "You want ClientBilling to hold or move funds",
      "You are outside the U.S.",
    ],
    planKey: "flatRate",
    exploreCta: "exploreOnline",
    channelHref: "/cdgcommerce/online-payments",
    channelLabel: "CDG online payments",
  },
  {
    slug: "wholesale",
    title: "Invoicing and wholesale membership processing",
    navLabel: "Wholesale",
    description:
      "Invoice B2B buyers free on ClientBilling, and review CDG Commerce wholesale membership pricing when card volume is high.",
    kicker: "Wholesale and high-volume sellers",
    audience:
      "You invoice other businesses at higher monthly card volume and care about interchange at cost with a membership-style plan CDG publishes.",
    invoiceFit: [
      "Invoices that always work unpaid, with your instructions and pay link",
      "Partial payments and balance due on the document",
      "API keys if an agent or script creates invoices for you",
      "Statements per buyer for open and paid invoices",
    ],
    processingFit: [
      "CDG publishes a wholesale membership plan with interchange plus pricing",
      "B2B invoicing and Level 2 and 3 scenarios are covered on the B2B channel page",
      "Residuals and underwriting stay with CDG, not ClientBilling",
    ],
    notFit: [
      "Your card volume is still in the flat rate or mid interchange-plus bands",
      "You need trade credit or net-terms financing from the processor",
      "You are outside the U.S.",
    ],
    planKey: "wholesale",
    exploreCta: "exploreB2b",
    channelHref: "/cdgcommerce/b2b",
    channelLabel: "CDG for B2B payments",
  },
];

export function getVertical(slug: string): VerticalKit | undefined {
  return verticals.find((v) => v.slug === slug);
}

export function verticalSlugs(): VerticalSlug[] {
  return verticals.map((v) => v.slug);
}

export function ratesForVertical(kit: VerticalKit) {
  const plan = cdgPlan(kit.planKey);
  return {
    plan,
    checked: CDG_CHECKED,
    source: plan.source,
    pricingIndex: cdgSources.pricing,
  };
}
