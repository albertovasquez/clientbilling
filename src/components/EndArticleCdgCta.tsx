import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import {
  internalPathForChannel,
  softCtaCopy,
  siteConfig,
  type PartnerChannel,
} from "@/lib/site";

type EndArticleCdgCtaProps = {
  channel?: PartnerChannel;
  articleSlug?: string;
  headline?: string;
  body?: string;
};

export function EndArticleCdgCta({
  channel = "internet",
  articleSlug,
  headline = "Ready to check eligibility?",
  body = `If ${siteConfig.partnerName} looks like a fit after reading our guide, you can check eligibility on their secure application. We may earn a commission if you apply through our link — at no extra cost to you.`,
}: EndArticleCdgCtaProps) {
  const exploreHref = internalPathForChannel(channel);
  const channelMeta = siteConfig.partnerChannels.find((c) => c.id === channel);

  return (
    <aside className="my-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
        {siteConfig.partnerName} partner · bottom of funnel
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
        {headline}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
        {body}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <TrackedAffiliateLink
          ctaPosition="article_end"
          ctaText={softCtaCopy.checkEligibility}
          ctaType="eligibility"
          articleSlug={articleSlug}
          className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {softCtaCopy.checkEligibility}
        </TrackedAffiliateLink>
        <Link
          href={exploreHref}
          className="inline-flex rounded-lg border border-teal-800 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50"
        >
          Explore {channelMeta?.title ?? "CDG"} options
        </Link>
        <Link
          href={siteConfig.partnerInternalPaths.hub}
          className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
        >
          Full CDG Commerce guide
        </Link>
      </div>
    </aside>
  );
}
