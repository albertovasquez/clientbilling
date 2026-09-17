import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import {
  softCtaCopy,
  siteConfig,
  type PartnerChannel,
} from "@/lib/site";

export type EndArticleAngle =
  | "general"
  | "invoicing"
  | "recurring"
  | "pricing"
  | "pos";

type EndArticleCdgCtaProps = {
  channel?: PartnerChannel;
  articleSlug?: string;
  angle?: EndArticleAngle;
  headline?: string;
  body?: string;
  exploreHref?: string;
  exploreLabel?: string;
};

const ANGLE_COPY: Record<
  EndArticleAngle,
  { headline: string; body: string; exploreHref: string; exploreLabel: string }
> = {
  general: {
    headline: "Ready for a free CDG quote?",
    body: `If ${siteConfig.partnerName} looks like a fit after reading, request a free quote on their secure application. We may earn a commission if you apply through our link — at no extra cost to you.`,
    exploreHref: siteConfig.partnerInternalPaths.hub,
    exploreLabel: softCtaCopy.seeOptions,
  },
  invoicing: {
    headline: "Put clearer invoices to work with card acceptance",
    body: `If invoice clarity is only half the problem — and you still need virtual terminal or emailed invoice payments — see how ${siteConfig.partnerName} lists invoicing alongside merchant accounts. Start with our B2B or online guides, then get a free quote.`,
    exploreHref: siteConfig.partnerInternalPaths.b2b,
    exploreLabel: "Explore B2B & invoicing options",
  },
  recurring: {
    headline: "Connect dunning discipline to recurring billing",
    body: `Failed-payment recovery works best when processing and subscription charging are coherent. ${siteConfig.partnerName} lists recurring billing among its merchant features — review our recurring guide, then request a free quote if CDG is on the shortlist.`,
    exploreHref: siteConfig.partnerInternalPaths.recurring,
    exploreLabel: "Explore recurring billing",
  },
  pricing: {
    headline: "Compare CDG pricing structures next",
    body: `CDG offers flat-rate, interchange-plus, and wholesale. The best option depends partly on volume — see our guide, then get a free quote rather than guessing a band.`,
    exploreHref: siteConfig.partnerInternalPaths.hub,
    exploreLabel: softCtaCopy.seeOptions,
  },
  pos: {
    headline: "Looking at in-person or mobile acceptance?",
    body: `CDG publishes retail POS and wireless options for card-present acceptance. Explore the channel guide that matches how you sell, then request a free quote.`,
    exploreHref: siteConfig.partnerInternalPaths.retail,
    exploreLabel: "Explore in-person options",
  },
};

export function EndArticleCdgCta({
  articleSlug,
  angle = "general",
  headline,
  body,
  exploreHref,
  exploreLabel,
}: EndArticleCdgCtaProps) {
  const copy = ANGLE_COPY[angle];
  const href = exploreHref ?? copy.exploreHref;
  const label = exploreLabel ?? copy.exploreLabel;

  return (
    <aside className="my-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
        {siteConfig.partnerName} partner · contextual next step
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        {headline ?? copy.headline}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
        {body ?? copy.body}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <TrackedAffiliateLink
          ctaPosition="article_end"
          ctaText={softCtaCopy.getFreeQuote}
          ctaType="soft"
          articleSlug={articleSlug}
          className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {softCtaCopy.getFreeQuote}
        </TrackedAffiliateLink>
        <Link
          href={href}
          className="inline-flex rounded-lg border border-teal-800 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50"
        >
          {label}
        </Link>
        <TrackedAffiliateLink
          ctaPosition="article_end_hard"
          ctaText={softCtaCopy.checkEligibility}
          ctaType="eligibility"
          articleSlug={articleSlug}
          className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
        >
          {softCtaCopy.checkEligibility}
        </TrackedAffiliateLink>
      </div>
    </aside>
  );
}
