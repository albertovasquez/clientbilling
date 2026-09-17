import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { cdgClaims, softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Review, Pricing & Merchant Account Guide",
  description:
    "Independent CDG Commerce guide: published volume bands, interchange-plus markups, features, contract terms, and when to check eligibility.",
  alternates: { canonical: "/cdgcommerce" },
  openGraph: {
    title: "CDG Commerce Review, Pricing & Merchant Account Guide",
    description:
      "Compare CDG Commerce pricing bands, features, and fit — then check eligibility when ready.",
    url: "/cdgcommerce",
  },
  robots: { index: true, follow: true },
};

const glanceRows = [
  {
    label: "Best suited",
    value:
      "Online, retail, and hybrid merchants who want a dedicated merchant account (as CDG positions itself)",
  },
  {
    label: "Volume bands (CDG publishes)",
    value: "~$1K–$10K simple · $10K–$200K interchange-plus · $200K+ wholesale",
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
    value: "CDG states no mandatory long-term contract / no termination fee",
  },
  { label: "Typical approval", value: "CDG states ~1–3 business days" },
];

const faqs = [
  {
    q: "Does ClientBilling set CDG’s rates?",
    a: "No. Volume bands and markups here are attributed to what CDG publishes. Confirm current pricing on their application or with their team.",
  },
  {
    q: "What is interchange-plus?",
    a: "You pay card-network interchange plus a published processor markup. CDG publishes online markup of 0.35% + $0.15 and retail of 0.30% + $0.10; interchange/network fees are separate.",
  },
  {
    q: "Should I apply immediately?",
    a: "Only when you have compared fit. Prefer our guide and volume sections first, then use Check eligibility for the tracked application.",
  },
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
            accounts, published pricing bands, and common features — so you can
            decide whether to check eligibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#pricing"
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              {softCtaCopy.seePricing}
            </Link>
            <Link
              href="#fit"
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
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

      <section
        id="pricing"
        className="scroll-mt-24 border-y border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Pricing explained (as CDG publishes)
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            CDG publishes volume-based approaches. Interchange and card-network
            fees are separate from processor markup. Confirm live quotes with
            CDG — we do not invent rates.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {(
              [
                cdgClaims.volumeBands.simple,
                cdgClaims.volumeBands.interchangePlus,
                cdgClaims.volumeBands.wholesale,
              ] as const
            ).map((band) => (
              <article
                key={band.anchor}
                id={band.anchor}
                className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                  {band.model}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {band.label}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{band.range}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {band.note}
                </p>
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
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
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
              title: "Wireless / mobile",
              href: "/cdgcommerce/wireless",
              body: "On-the-go card acceptance for field teams and pop-ups.",
            },
            {
              title: "Gateways",
              href: "/cdgcommerce/online-payments",
              body: "CDG lists Quantum and Authorize.Net gateway options.",
            },
            {
              title: "Invoicing & virtual terminal",
              href: "/cdgcommerce/online-payments",
              body: "Invoice and keyed-entry options as CDG publishes them.",
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
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
            Why merchants consider CDG
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {cdgClaims.trust.map((t) => (
              <li
                key={t}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                {t}
              </li>
            ))}
            <li className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              {cdgClaims.contract.noLongTerm}
            </li>
            <li className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              {cdgClaims.contract.noTerminationFee}
            </li>
            <li className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
              {cdgClaims.approval}
            </li>
          </ul>
        </div>
      </section>

      <section
        id="fit"
        className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      >
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Which plan fits? (volume-based)
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Use these as a research starting point — not a quote. CDG publishes
          the bands; your actual offer depends on underwriting and card mix.
        </p>
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Under ~$10K / month
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              CDG publishes simple pricing in this band. Often a fit for early
              online sellers, service businesses, and teams that want
              predictable markup language without wholesale complexity.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              $10K–$200K / month
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              CDG publishes interchange-plus here. Growing e-commerce, retail,
              and subscription operators often prefer transparency on
              interchange vs processor markup — confirm with CDG for your mix.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">
              $200K+ / month
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              CDG publishes wholesale options for higher volume. Worth a
              conversation if interchange-plus alone may leave money on the
              table — start eligibility to talk with their team.
            </p>
          </div>
        </div>
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
          <h3 className="text-xl font-semibold">
            Check eligibility with CDG Commerce
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Bottom-of-funnel step: open CDG’s secure merchant application
            through our tracked affiliate link. We may earn a commission at no
            extra cost to you.
          </p>
          <TrackedAffiliateLink
            ctaPosition="cdgcommerce_end"
            ctaText={softCtaCopy.checkEligibility}
            ctaType="eligibility"
            className="mt-6 inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300"
          >
            {softCtaCopy.checkEligibility}
          </TrackedAffiliateLink>
        </div>
      </section>
    </>
  );
}
