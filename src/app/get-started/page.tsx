import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get started with CDG Commerce",
  description:
    "Choose Online, Retail, Recurring, or Wireless guides — then check eligibility with CDG Commerce through ClientBilling.",
  alternates: { canonical: "/get-started" },
  openGraph: {
    title: "Get started with CDG Commerce | ClientBilling",
    description:
      "Explore internal CDG Commerce guides, then check eligibility when ready.",
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
            Start with the CDG Commerce guide
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Prefer the full review and pricing hub, or jump into a channel
            guide. Explore stays on ClientBilling; check eligibility only when
            you are ready to convert.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/cdgcommerce"
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {softCtaCopy.seePricing}
            </Link>
            <TrackedAffiliateLink
              ctaPosition="get_started_hero"
              ctaText={softCtaCopy.checkEligibility}
              ctaType="eligibility"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              {softCtaCopy.checkEligibility}
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
          Explore by channel (internal guides)
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          These replace outbound “explore” links. Each page ends with a tracked
          eligibility CTA.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.partnerChannels.map((channel) => (
            <article
              key={channel.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {channel.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {channel.description}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={channel.href}
                  className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Explore {channel.title}
                </Link>
                <TrackedAffiliateLink
                  ctaPosition="get_started_card"
                  ctaText={softCtaCopy.checkEligibility}
                  ctaType="eligibility"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-teal-800"
                >
                  {softCtaCopy.checkEligibility}
                </TrackedAffiliateLink>
              </div>
            </article>
          ))}
          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Recurring billing
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              Subscriptions and repeat charges — how CDG lists recurring
              billing among merchant features.
            </p>
            <Link
              href="/cdgcommerce/recurring-billing"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Explore recurring billing
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
