import type { Metadata } from "next";
import Link from "next/link";
import { FitNotFit } from "@/components/FitNotFit";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { cdgClaims, softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Review, Pricing & Merchant Account Guide",
  description:
    "Independent CDG Commerce guide: who should consider it, pricing models with volume caution, features, FAQ, and how to get a free quote.",
  alternates: { canonical: "/cdgcommerce" },
  openGraph: {
    title: "CDG Commerce Review, Pricing & Merchant Account Guide",
    description:
      "Compare CDG Commerce options, fit, and pricing models — then get a free quote when ready.",
    url: "/cdgcommerce",
  },
  robots: { index: true, follow: true },
};

const glanceRows = [
  {
    label: "Best suited",
    value:
      "U.S. online, retail, mobile, recurring, and B2B merchants who want a dedicated merchant account (as CDG positions itself)",
  },
  {
    label: "Pricing models (CDG publishes)",
    value: "Flat-rate, interchange-plus, and wholesale — best fit depends partly on volume",
  },
  {
    label: "Online markup (published)",
    value: `Interchange-plus ${cdgClaims.interchangePlusMarkup.online.percent} + ${cdgClaims.interchangePlusMarkup.online.perTxn}`,
  },
  {
    label: "Retail markup (published)",
    value: `Interchange-plus ${cdgClaims.interchangePlusMarkup.retail.percent} + ${cdgClaims.interchangePlusMarkup.retail.perTxn}`,
  },
  { label: "Recurring billing", value: "Listed by CDG among merchant features" },
  {
    label: "Gateways",
    value: "Quantum and Authorize.Net (as CDG lists)",
  },
  { label: "Invoicing", value: "Listed by CDG" },
  { label: "POS / mobile", value: "Listed by CDG" },
  {
    label: "Contract",
    value:
      "CDG states no mandatory long-term contract; no termination fee on Interchange Plus",
  },
  { label: "Support", value: "24/7/365 U.S.-based support (as CDG states)" },
  { label: "Typical approval", value: "CDG states ~1–3 business days" },
];

const faqs = [
  {
    q: "Does ClientBilling set CDG’s rates?",
    a: "No. Feature and markup claims here are attributed to what CDG publishes. Confirm current pricing with a free quote or CDG’s team.",
  },
  {
    q: "What is interchange-plus?",
    a: "You pay card-network interchange plus a published processor markup. CDG publishes online markup of 0.35% + $0.15 and retail of 0.30% + $0.10; interchange/network fees are separate.",
  },
  {
    q: "Is there one volume cutoff for wholesale?",
    a: "CDG’s public materials have described volume bands differently over time. We do not assert an exact wholesale threshold. CDG offers flat-rate, interchange-plus, and wholesale — get a quote for your volume.",
  },
  {
    q: "Should I apply immediately?",
    a: "Only when fit looks reasonable. Prefer See CDG Options and a free quote first; Apply / Check eligibility is the harder convert lower on the page.",
  },
];

const volumeCards = [
  cdgClaims.volumeBands.under10k,
  cdgClaims.volumeBands.from10kTo25k,
  cdgClaims.volumeBands.from25kTo200k,
  cdgClaims.volumeBands.over200k,
];

export default function CdgCommercePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,118,110,0.08),_transparent_55%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
            Primary guide · {siteConfig.partnerName}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            CDG Commerce Review, Pricing & Merchant Account Guide
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            An independent overview of how CDG Commerce positions merchant
            accounts, pricing models, and common features — so you can decide
            whether to request a free quote.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedAffiliateLink
              ctaPosition="cdgcommerce_hero"
              ctaText={softCtaCopy.getFreeQuote}
              ctaType="soft"
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {softCtaCopy.getFreeQuote}
            </TrackedAffiliateLink>
            <Link
              href="#pricing"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              {softCtaCopy.seeOptions}
            </Link>
            <Link
              href="#fit"
              className="inline-flex rounded-lg border border-transparent px-3 py-3 text-sm font-semibold text-teal-800 hover:underline"
            >
              {softCtaCopy.isRightFit}
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Affiliate disclosure: we may earn a commission if you apply through
            our links.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              Details
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
          At a glance
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <tbody>
              {glanceRows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800 sm:px-5">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-slate-600 sm:px-5">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <FitNotFit id="fit" />
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Pricing models (with volume caution)
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {cdgClaims.pricingModelsNote}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {volumeCards.map((band) => (
            <article
              key={band.anchor}
              id={band.anchor}
              className="scroll-mt-24 flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                {band.model}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                {band.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{band.range}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {band.note}
              </p>
              <TrackedAffiliateLink
                ctaPosition="cdgcommerce_volume"
                ctaText={softCtaCopy.getFreeQuote}
                ctaType="soft"
                className="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-700"
              >
                {softCtaCopy.getFreeQuote} →
              </TrackedAffiliateLink>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">
            Interchange-plus markup (CDG publishes)
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>
              <strong>Online:</strong>{" "}
              {cdgClaims.interchangePlusMarkup.online.percent} +{" "}
              {cdgClaims.interchangePlusMarkup.online.perTxn}
            </li>
            <li>
              <strong>Retail:</strong>{" "}
              {cdgClaims.interchangePlusMarkup.retail.percent} +{" "}
              {cdgClaims.interchangePlusMarkup.retail.perTxn}
            </li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {cdgClaims.interchangePlusMarkup.caveat}
          </p>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Features deep-dive
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            Capabilities below are drawn from how CDG lists its merchant stack.
            Drill into internal guides for channel-specific fit.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Online payments",
                href: "/cdgcommerce/online-payments",
                body: "Merchant accounts for e-commerce, remote invoicing, and digital sales.",
              },
              {
                title: "Retail & POS",
                href: "/cdgcommerce/retail",
                body: "In-store acceptance and point-of-sale workflows for physical locations.",
              },
              {
                title: "Recurring billing",
                href: "/cdgcommerce/recurring-billing",
                body: "Subscriptions and repeat charges as CDG lists among its features.",
              },
              {
                title: "B2B payments",
                href: "/cdgcommerce/b2b",
                body: "Invoicing, virtual terminal, and Level 2/3 scenarios for business sales.",
              },
              {
                title: "Wireless / mobile",
                href: "/cdgcommerce/wireless",
                body: "On-the-go card acceptance for field teams and pop-ups.",
              },
              {
                title: "Gateways",
                href: "/cdgcommerce/online-payments",
                body: "CDG lists Quantum and Authorize.Net gateway options.",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
                <span className="mt-3 inline-flex text-sm font-semibold text-teal-800">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
          Why merchants consider CDG
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {cdgClaims.whyConsider.map((t) => (
            <li
              key={t}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
            CDG vs alternatives
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            For deeper comparisons, see our editorial posts — they keep
            assumptions documented and CDG positioned as one option.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li>
              <Link
                href="/blog/cdg-commerce-vs-stripe-for-growing-businesses"
                className="font-semibold text-teal-800 hover:text-teal-700"
              >
                CDG Commerce vs Stripe for Growing Businesses
              </Link>
            </li>
            <li>
              <Link
                href="/blog/interchange-plus-vs-flat-rate-payment-processing"
                className="font-semibold text-teal-800 hover:text-teal-700"
              >
                Interchange Plus vs Flat-Rate Payment Processing
              </Link>
            </li>
            <li>
              <Link
                href="/blog/best-payment-processor-for-recurring-billing"
                className="font-semibold text-teal-800 hover:text-teal-700"
              >
                Best Payment Processor for Recurring Billing
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
          FAQ
        </h2>
        <dl className="mt-8 space-y-6">
          {faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-slate-900">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white sm:p-8">
          <h3 className="text-xl font-semibold">{softCtaCopy.getFreeQuote}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Soft next step: open CDG&apos;s secure flow through our tracked
            affiliate link for a free quote. Prefer a harder convert? Check
            eligibility or apply for a merchant account below. We may earn a
            commission at no extra cost to you.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedAffiliateLink
              ctaPosition="cdgcommerce_end"
              ctaText={softCtaCopy.getFreeQuote}
              ctaType="soft"
              className="inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300"
            >
              {softCtaCopy.getFreeQuote}
            </TrackedAffiliateLink>
            <TrackedAffiliateLink
              ctaPosition="cdgcommerce_end_hard"
              ctaText={softCtaCopy.checkEligibility}
              ctaType="eligibility"
              className="inline-flex rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {softCtaCopy.checkEligibility}
            </TrackedAffiliateLink>
          </div>
        </div>
      </section>
    </>
  );
}
