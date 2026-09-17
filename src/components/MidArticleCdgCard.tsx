import Link from "next/link";
import { softCtaCopy, siteConfig } from "@/lib/site";

type MidArticleCdgCardProps = {
  topic?:
    | "pricing"
    | "recurring"
    | "invoicing"
    | "fees"
    | "general"
    | "gateway"
    | "pos";
  articleSlug?: string;
  exploreHref?: string;
};

const TOPIC_COPY: Record<
  NonNullable<MidArticleCdgCardProps["topic"]>,
  { headline: string; body: string; soft: string; href: string }
> = {
  pricing: {
    headline: "Comparing processor markups?",
    body: "CDG offers flat-rate, interchange-plus, and wholesale. See published options — then get a free quote for your volume.",
    soft: softCtaCopy.seeOptions,
    href: siteConfig.partnerInternalPaths.hub,
  },
  recurring: {
    headline: "Evaluating recurring billing options?",
    body: "CDG Commerce lists recurring billing among its merchant features. Compare fit on our recurring guide before you apply.",
    soft: "Explore recurring billing",
    href: siteConfig.partnerInternalPaths.recurring,
  },
  invoicing: {
    headline: "Need invoicing plus virtual terminal?",
    body: "CDG publishes invoicing and virtual terminal options alongside merchant accounts — useful when clearer invoices still need a card path.",
    soft: "Explore B2B & invoicing",
    href: siteConfig.partnerInternalPaths.b2b,
  },
  fees: {
    headline: "Trying to understand processing fees?",
    body: "We summarize CDG-published pricing models carefully — not invented rates. Volume matters; a free quote beats guessing.",
    soft: softCtaCopy.seeOptions,
    href: siteConfig.partnerInternalPaths.hub,
  },
  gateway: {
    headline: "Looking at payment gateways?",
    body: "CDG lists Quantum and Authorize.Net gateway options. See the online-payments guide for context.",
    soft: softCtaCopy.seeIfFits,
    href: siteConfig.partnerInternalPaths.internet,
  },
  pos: {
    headline: "Retail or mobile POS on your checklist?",
    body: "CDG publishes POS and mobile options for in-person acceptance. Explore the retail or wireless guides.",
    soft: softCtaCopy.seeIfFits,
    href: siteConfig.partnerInternalPaths.retail,
  },
  general: {
    headline: "Considering CDG Commerce?",
    body: "Start with our independent guide to pricing models, features, and fit — soft next step, not a hard sell.",
    soft: softCtaCopy.seeOptions,
    href: siteConfig.partnerInternalPaths.hub,
  },
};

export function MidArticleCdgCard({
  topic = "general",
  exploreHref,
}: MidArticleCdgCardProps) {
  const copy = TOPIC_COPY[topic];
  const href = exploreHref ?? copy.href;

  return (
    <aside className="my-10 rounded-2xl border border-teal-200 bg-teal-50/70 p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
        {siteConfig.partnerName} · mid-article
      </p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
        {copy.headline}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Link
          href={href}
          className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          {copy.soft}
        </Link>
        <Link
          href="/affiliate-disclosure"
          className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline"
        >
          Affiliate disclosure
        </Link>
      </div>
    </aside>
  );
}
