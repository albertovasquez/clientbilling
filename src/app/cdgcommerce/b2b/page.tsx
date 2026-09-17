import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce for B2B Payments",
  description:
    "When CDG Commerce may fit B2B invoicing, virtual terminal, and Level 2/3 card scenarios — then get a free quote.",
  alternates: { canonical: "/cdgcommerce/b2b" },
  openGraph: {
    title: "CDG Commerce for B2B Payments | ClientBilling",
    description:
      "B2B invoicing, virtual terminal, and Level 2/3 scenarios with CDG Commerce — research first, then free quote.",
    url: "/cdgcommerce/b2b",
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
            B2B payments
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          {siteConfig.partnerName} · B2B payments
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          CDG Commerce for B2B Payments
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Invoicing, virtual terminal, and Level 2/3 scenarios common when
          businesses sell to other businesses — researched on ClientBilling,
          then a free quote when you are ready.
        </p>
      </header>

      <div className="mt-8 space-y-5">
        <p className="text-base leading-relaxed text-slate-600">
          B2B payments rarely look like one-click consumer checkout. Finance
          teams email invoices, key cards over the phone, chase purchase orders,
          and sometimes qualify for Level 2/3 interchange when enough line-item
          and tax data travels with the authorization.
        </p>
        <p className="text-base leading-relaxed text-slate-600">
          CDG Commerce lists invoicing and virtual terminal among its merchant
          features, alongside online acceptance and gateway options. That
          combination can matter if you want card processing plus billed
          receivables under one partner conversation — without inventing a
          fake CDG &quot;B2B landing type.&quot;
        </p>
        <p className="text-base leading-relaxed text-slate-600">
          Level 2/3 outcomes depend on card type, data quality, and
          underwriting — treat them as a research topic, not a promised rate.
          Confirm eligibility and pricing with CDG directly.
        </p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-slate-700">
        <li className="flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
          />
          Invoicing listed by CDG among merchant features
        </li>
        <li className="flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
          />
          Virtual terminal for keyed / remote card entry (as CDG lists)
        </li>
        <li className="flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
          />
          Online merchant accounts and gateways CDG lists (Quantum, Authorize.Net)
        </li>
        <li className="flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700"
          />
          Level 2/3 scenarios: research with CDG — do not assume automatic qualification
        </li>
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
          Ready for numbers on invoicing and virtual-terminal acceptance? Open
          CDG&apos;s secure flow through our tracked affiliate link. Check
          eligibility / apply remains available as a secondary hard convert.
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
