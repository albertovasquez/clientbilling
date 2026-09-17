import type { Metadata } from "next";
import Link from "next/link";
import { FitNotFit } from "@/components/FitNotFit";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { cdgClaims, softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get started with CDG Commerce",
  description:
    "Why businesses consider CDG Commerce — then explore Online, In-Person, Mobile, Recurring & Invoicing, or B2B paths and request a free quote.",
  alternates: { canonical: "/get-started" },
  openGraph: {
    title: "Get started with CDG Commerce | ClientBilling",
    description:
      "Five intent paths into CDG Commerce options, with free-quote and eligibility CTAs.",
    url: "/get-started",
  },
};

export default function GetStartedPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
            Partner with {siteConfig.partnerName}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Get started with CDG Commerce
          </h1>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
            <h2 className="text-lg font-semibold text-slate-900">
              Why businesses consider CDG Commerce
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Attributed to CDG&apos;s published claims — we do not invent
              independent statistics.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700">
              {cdgClaims.whyConsider.map((item) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            Choose the path that matches how you get paid. Explore mid-funnel
            options first; request a free quote when you want numbers. Apply /
            check eligibility stays secondary.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/cdgcommerce"
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {softCtaCopy.seeOptions}
            </Link>
            <TrackedAffiliateLink
              ctaPosition="get_started_hero"
              ctaText={softCtaCopy.getFreeQuote}
              ctaType="soft"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              {softCtaCopy.getFreeQuote}
            </TrackedAffiliateLink>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Affiliate disclosure: ClientBilling may earn a commission if you
            apply through our link.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              Learn more
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Choose your path
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Online, In-Person, and Mobile Explore links use CDG&apos;s tracked
          R=470 landings. Recurring &amp; Invoicing and B2B stay on ClientBilling
          guides that end with free-quote CTAs.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.intentPaths.map((path) => {
            const landingHref =
              path.landingKey != null
                ? siteConfig.partnerLandings[path.landingKey]
                : null;

            return (
              <article
                key={path.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {path.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {path.description}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {landingHref ? (
                    <TrackedAffiliateLink
                      href={landingHref}
                      ctaPosition="get_started_explore"
                      ctaText={path.exploreLabel}
                      ctaType="mid"
                      className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                    >
                      {path.exploreLabel}
                    </TrackedAffiliateLink>
                  ) : (
                    <Link
                      href={path.exploreHref}
                      className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                    >
                      {path.exploreLabel}
                    </Link>
                  )}
                  <TrackedAffiliateLink
                    ctaPosition="get_started_card_quote"
                    ctaText={softCtaCopy.getFreeQuote}
                    ctaType="soft"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                  >
                    {softCtaCopy.getFreeQuote}
                  </TrackedAffiliateLink>
                  <TrackedAffiliateLink
                    ctaPosition="get_started_card"
                    ctaText={softCtaCopy.checkEligibility}
                    ctaType="eligibility"
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-teal-800"
                  >
                    {softCtaCopy.checkEligibility}
                  </TrackedAffiliateLink>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <FitNotFit id="prequalify" />
          <div className="mt-10 flex flex-wrap gap-3">
            <TrackedAffiliateLink
              ctaPosition="get_started_fit_quote"
              ctaText={softCtaCopy.getFreeQuote}
              ctaType="soft"
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {softCtaCopy.getFreeQuote}
            </TrackedAffiliateLink>
            <TrackedAffiliateLink
              ctaPosition="get_started_fit_apply"
              ctaText={softCtaCopy.applyMerchant}
              ctaType="eligibility"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              {softCtaCopy.applyMerchant}
            </TrackedAffiliateLink>
          </div>
        </div>
      </section>
    </>
  );
}
