import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

type SoftCdgCtaProps = {
  variant?: "inline" | "buttons";
  primaryHref?: string;
  /** When true, secondary is a tracked free-quote affiliate link. */
  quoteAsSecondary?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  ctaPosition?: string;
  className?: string;
};

/** Soft mid-funnel CTAs — options first, free quote before cold Apply. */
export function SoftCdgCta({
  variant = "buttons",
  primaryHref = siteConfig.partnerInternalPaths.hub,
  quoteAsSecondary = true,
  primaryLabel = softCtaCopy.seeOptions,
  secondaryLabel = softCtaCopy.getFreeQuote,
  ctaPosition = "soft_cta",
  className = "",
}: SoftCdgCtaProps) {
  if (variant === "inline") {
    return (
      <p className={`text-sm text-slate-600 ${className}`}>
        <Link
          href={primaryHref}
          className="font-semibold text-teal-800 underline-offset-2 hover:underline"
        >
          {primaryLabel}
        </Link>
        {" · "}
        {quoteAsSecondary ? (
          <TrackedAffiliateLink
            ctaPosition={ctaPosition}
            ctaText={secondaryLabel}
            ctaType="soft"
            className="font-semibold text-teal-800 underline-offset-2 hover:underline"
          >
            {secondaryLabel}
          </TrackedAffiliateLink>
        ) : (
          <Link
            href={siteConfig.partnerInternalPaths.fit}
            className="font-semibold text-teal-800 underline-offset-2 hover:underline"
          >
            {secondaryLabel}
          </Link>
        )}
      </p>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={primaryHref}
        className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        {primaryLabel}
      </Link>
      {quoteAsSecondary ? (
        <TrackedAffiliateLink
          ctaPosition={ctaPosition}
          ctaText={secondaryLabel}
          ctaType="soft"
          className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {secondaryLabel}
        </TrackedAffiliateLink>
      ) : (
        <Link
          href={siteConfig.partnerInternalPaths.fit}
          className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}
