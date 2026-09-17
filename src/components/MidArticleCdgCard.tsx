import Link from "next/link";
import { softCtaCopy, siteConfig } from "@/lib/site";

type MidArticleCdgCardProps = {
  topic?: "pricing" | "recurring" | "invoicing" | "fees" | "general" | "gateway" | "pos";
  articleSlug?: string;
  exploreHref?: string;
};

const TOPIC_COPY: Record<
  NonNullable<MidArticleCdgCardProps["topic"]>,
  { headline: string; body: string; soft: string }
> = {
  pricing: {
    headline: "Comparing processor markups?",
    body: "See how CDG Commerce publishes volume bands and interchange-plus rates — then decide if a deeper look makes sense.",
    soft: softCtaCopy.comparePricing,
  },
  recurring: {
    headline: "Evaluating recurring billing options?",
    body: "CDG Commerce lists recurring billing among its merchant features. Compare fit before you apply.",
    soft: softCtaCopy.seeIfFits,
  },
  invoicing: {
    headline: "Need invoicing plus card acceptance?",
    body: "CDG publishes invoicing and virtual terminal options alongside merchant accounts. Review the guide first.",
    soft: softCtaCopy.comparePricing,
  },
  fees: {
    headline: "Trying to understand processing fees?",
    body: "We summarize CDG-published pricing bands and markups — attributed carefully, not invented.",
    soft: softCtaCopy.comparePricing,
  },
  gateway: {
    headline: "Looking at payment gateways?",
    body: "CDG lists Quantum and Authorize.Net gateway options. See the online-payments guide for context.",
    soft: softCtaCopy.seeIfFits,
  },
  pos: {
    headline: "Retail or mobile POS on your checklist?",
    body: "CDG publishes POS and mobile options for in-person acceptance. Explore the retail or wireless guides.",
    soft: softCtaCopy.seeIfFits,
  },
  general: {
    headline: "Considering CDG Commerce?",
    body: "Start with our independent guide to pricing, features, and fit — soft next step, not a hard sell.",
    soft: softCtaCopy.seeIfFits,
  },
};

export function MidArticleCdgCard({
  topic = "general",
  exploreHref = siteConfig.partnerInternalPaths.hub,
}: MidArticleCdgCardProps) {
  const copy = TOPIC_COPY[topic];

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
          href={exploreHref}
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
