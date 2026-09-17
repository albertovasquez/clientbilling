import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import {
  type PartnerChannel,
  internalPathForChannel,
  softCtaCopy,
  siteConfig,
} from "@/lib/site";

type AffiliateCTAProps = {
  variant?: "inline" | "banner" | "compact";
  headline?: string;
  body?: string;
  /** Maps to internal explore page (not outbound landing by default). */
  channel?: PartnerChannel;
  articleSlug?: string;
};

export function AffiliateCTA({
  variant = "banner",
  headline = "Curious how CDG Commerce options fit your volume?",
  body = `Review our independent CDG Commerce guide for pricing models, features, and fit — then get a free quote when you are ready. We may earn a commission if you apply through our link.`,
  channel,
  articleSlug,
}: AffiliateCTAProps) {
  const exploreHref = channel
    ? internalPathForChannel(channel)
    : siteConfig.partnerInternalPaths.hub;
  const channelMeta = channel
    ? siteConfig.partnerChannels.find((c) => c.id === channel)
    : undefined;

  if (variant === "compact") {
    return (
      <aside className="rounded-xl border border-teal-200 bg-teal-50/80 p-4 sm:p-5">
        <p className="text-sm font-semibold text-teal-950">{headline}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={siteConfig.partnerInternalPaths.hub}
            className="inline-flex rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {softCtaCopy.comparePricing}
          </Link>
          {channelMeta && (
            <Link
              href={exploreHref}
              className="text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
            >
              Explore {channelMeta.title}
            </Link>
          )}
        </div>
      </aside>
    );
  }

  if (variant === "inline") {
    return (
      <aside className="my-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          {siteConfig.partnerName} partner offer
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {headline}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
          {body}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href={exploreHref}
            className="inline-flex rounded-lg border border-teal-800 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {channelMeta
              ? `Explore ${channelMeta.title} options`
              : softCtaCopy.seePricing}
          </Link>
          <TrackedAffiliateLink
            ctaPosition="cta_inline"
            ctaText={softCtaCopy.getFreeQuote}
            ctaType="soft"
            articleSlug={articleSlug}
            className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            {softCtaCopy.getFreeQuote}
          </TrackedAffiliateLink>
          <Link
            href={siteConfig.partnerInternalPaths.hub}
            className="text-sm font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            Full CDG guide
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"
      />
      <p className="relative text-xs font-semibold uppercase tracking-wider text-teal-200">
        Affiliate partner · {siteConfig.partnerName}
      </p>
      <h2 className="relative mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
        {headline}
      </h2>
      <p className="relative mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
        {body}
      </p>
      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={siteConfig.partnerInternalPaths.hub}
          className="inline-flex rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          {softCtaCopy.seePricing}
        </Link>
        <TrackedAffiliateLink
          ctaPosition="cta_banner"
          ctaText={softCtaCopy.getFreeQuote}
          ctaType="soft"
          className="inline-flex rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          {softCtaCopy.getFreeQuote}
        </TrackedAffiliateLink>
      </div>
    </aside>
  );
}
