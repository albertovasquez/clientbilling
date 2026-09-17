import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CDG Commerce Wireless & Mobile Payments",
  description: "When CDG Commerce wireless / mobile payment options may fit field teams, pop-ups, and on-the-go card acceptance.",
  alternates: { canonical: "/cdgcommerce/wireless" },
  openGraph: {
    title: "CDG Commerce Wireless & Mobile Payments | ClientBilling",
    description: "When CDG Commerce wireless / mobile payment options may fit field teams, pop-ups, and on-the-go card acceptance.",
    url: "/cdgcommerce/wireless",
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
            Wireless / Mobile
          </li>
        </ol>
      </nav>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          {siteConfig.partnerName} · Wireless / Mobile
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          CDG Commerce Wireless & Mobile Payments
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          When CDG Commerce wireless / mobile payment options may fit field teams, pop-ups, and on-the-go card acceptance.
        </p>
      </header>

      <div className="mt-8 space-y-5">
          <p className="text-base leading-relaxed text-slate-600">Field sales, delivery, markets, and event pop-ups need card acceptance away from a fixed register. CDG Commerce positions wireless / mobile payment options for merchants who close deals on the go.</p>
          <p className="text-base leading-relaxed text-slate-600">Mobile acceptance still requires underwriting, hardware or app choices, and clear settlement expectations. Treat this page as a channel overview — confirm devices, connectivity, and fees with CDG during eligibility.</p>
          <p className="text-base leading-relaxed text-slate-600">If you also sell online or in a storefront, start from the main CDG guide so you do not optimize for only one channel.</p>
      </div>

      <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Wireless / mobile merchant options (as CDG positions)</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Useful for field teams, markets, and pop-up retail</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Complements retail POS when staff leave the counter</li>
            <li className="flex gap-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-700" />Confirm hardware and fee details directly with CDG</li>
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
