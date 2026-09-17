import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Online Payments",
  description: "When CDG Commerce online / internet merchant accounts may fit e-commerce, invoicing, and remote-first businesses.",
  alternates: { canonical: "/cdgcommerce/online-payments" },
  openGraph: {
    title: "CDG Commerce Online Payments | ClientBilling",
    description: "When CDG Commerce online / internet merchant accounts may fit e-commerce, invoicing, and remote-first businesses.",
    url: "/cdgcommerce/online-payments",
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
            Online / Internet
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          {siteConfig.partnerName} · Online / Internet
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          CDG Commerce Online Payments
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          When CDG Commerce online / internet merchant accounts may fit e-commerce, invoicing, and remote-first businesses.
        </p>
      </header>

      <div className="mt-8 space-y-5">
          <p className="text-base leading-relaxed text-slate-600">If most of your revenue arrives through a website, customer portal, or emailed invoice, an online-first merchant account is usually the right research path. CDG Commerce positions internet merchant accounts for digital sellers who need card acceptance without standing up a full in-house payments stack.</p>
          <p className="text-base leading-relaxed text-slate-600">For SaaS and subscription operators, online acceptance often pairs with recurring billing and a payment gateway. CDG lists Quantum and Authorize.Net among gateway options, alongside invoicing and virtual terminal capabilities — useful when finance still keys occasional cards.</p>
          <p className="text-base leading-relaxed text-slate-600">Use this page as a fit check, not a quote. Review volume bands on our main CDG guide, then check eligibility when you want CDG to evaluate your business.</p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Online / internet merchant accounts (as CDG positions)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Payment gateways: Quantum and Authorize.Net (as CDG lists)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Invoicing and virtual terminal options (as CDG lists)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Recurring billing for subscriptions (as CDG lists)</li>
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
