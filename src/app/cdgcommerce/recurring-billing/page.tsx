import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Recurring Billing",
  description: "How CDG Commerce lists recurring billing for subscriptions and repeat charges — and when to compare alternatives.",
  alternates: { canonical: "/cdgcommerce/recurring-billing" },
  openGraph: {
    title: "CDG Commerce Recurring Billing | ClientBilling",
    description: "How CDG Commerce lists recurring billing for subscriptions and repeat charges — and when to compare alternatives.",
    url: "/cdgcommerce/recurring-billing",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-teal-800">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/cdgcommerce" className="hover:text-teal-800">
              CDG Commerce
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-slate-700" aria-current="page">
            Recurring billing
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          {siteConfig.partnerName} · Recurring billing
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          CDG Commerce Recurring Billing
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          How CDG Commerce lists recurring billing for subscriptions and repeat charges — and when to compare alternatives.
        </p>
      </header>

      <div className="mt-8 space-y-5">
          <p className="text-base leading-relaxed text-slate-600">Recurring billing is where payment processing meets retention operations: failed cards, dunning, proration, and plan changes. CDG Commerce lists recurring billing among its merchant features, which can matter if you want card processing and subscription charging under one partner conversation.</p>
          <p className="text-base leading-relaxed text-slate-600">That does not mean every SaaS should leave Stripe Billing or a dedicated subscription engine. Editorial reality: some teams need deep entitlement metering; others need straightforward monthly or annual card charges. Document your commercial model first, then see if CDG's stack matches.</p>
          <p className="text-base leading-relaxed text-slate-600">Read our recurring-billing processor guide for a broader comparison, then return here when CDG is on the shortlist.</p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Recurring / subscription charging listed by CDG</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Pairs with online merchant accounts and gateways CDG lists</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Useful for memberships, retainers, and SaaS with simpler catalogs</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Still verify tax, dunning, and finance handoff against your requirements</li>
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Features and claims are attributed to how CDG publishes its offerings.
        Confirm current capabilities and pricing directly with CDG.
      </p>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          {softCtaCopy.getFreeQuote}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          If recurring billing plus card acceptance is on your shortlist, request
          a free CDG quote through our tracked affiliate link. Check eligibility
          remains available as a secondary hard convert.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackedAffiliateLink
            ctaPosition="subpage_end"
            ctaText={softCtaCopy.getFreeQuote}
            ctaType="soft"
            className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            {softCtaCopy.getFreeQuote}
          </TrackedAffiliateLink>
          <Link
            href="/cdgcommerce"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            {softCtaCopy.seeOptions}
          </Link>
          <TrackedAffiliateLink
            ctaPosition="subpage_end_hard"
            ctaText={softCtaCopy.checkEligibility}
            ctaType="eligibility"
            className="inline-flex px-2 py-2.5 text-xs font-semibold text-slate-500 underline-offset-2 hover:text-teal-800 hover:underline"
          >
            {softCtaCopy.checkEligibility}
          </TrackedAffiliateLink>
        </div>
      </div>
    </article>
  );
}
