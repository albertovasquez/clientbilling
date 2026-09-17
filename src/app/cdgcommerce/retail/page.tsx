import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Retail & POS Payments",
  description: "When CDG Commerce retail merchant accounts and POS options may fit brick-and-mortar and hybrid sellers.",
  alternates: { canonical: "/cdgcommerce/retail" },
  openGraph: {
    title: "CDG Commerce Retail & POS Payments | ClientBilling",
    description: "When CDG Commerce retail merchant accounts and POS options may fit brick-and-mortar and hybrid sellers.",
    url: "/cdgcommerce/retail",
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
            Retail
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          {siteConfig.partnerName} · Retail
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          CDG Commerce Retail & POS Payments
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          When CDG Commerce retail merchant accounts and POS options may fit brick-and-mortar and hybrid sellers.
        </p>
      </header>

      <div className="mt-8 space-y-5">
          <p className="text-base leading-relaxed text-slate-600">Retail payment needs differ from pure e-commerce: counter speed, tip flows, multi-location reconciliation, and card-present rates matter. CDG Commerce publishes retail-oriented merchant options and POS / mobile capabilities for in-person acceptance.</p>
          <p className="text-base leading-relaxed text-slate-600">CDG publishes a retail interchange-plus markup of 0.30% + $0.10 (interchange and network fees separate). Mid-volume retailers often compare that transparency against flat-rate aggregators — see our pricing explainers for framing.</p>
          <p className="text-base leading-relaxed text-slate-600">Hybrid businesses (showroom + online) should evaluate both retail and online paths on our CDG hub before applying.</p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Retail / card-present merchant accounts (as CDG positions)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Published retail interchange-plus markup: 0.30% + $0.10 (CDG publishes; interchange separate)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />POS options for in-store acceptance (as CDG lists)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Path into mobile / wireless for floor and pop-up selling</li>
      </ul>

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        Features and claims are attributed to how CDG publishes its offerings.
        Confirm current capabilities and pricing directly with CDG.
      </p>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          {softCtaCopy.checkEligibility}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          When you are ready, open CDG&apos;s secure merchant application
          through our tracked affiliate link. We may earn a commission at no
          extra cost to you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <TrackedAffiliateLink
            ctaPosition="subpage_end"
            ctaText={softCtaCopy.checkEligibility}
            ctaType="eligibility"
            className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            {softCtaCopy.checkEligibility}
          </TrackedAffiliateLink>
          <Link
            href="/cdgcommerce"
            className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            {softCtaCopy.seePricing}
          </Link>
        </div>
      </div>
    </article>
  );
}
