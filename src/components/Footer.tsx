import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { softCtaCopy, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-base font-semibold text-slate-900">
              {siteConfig.name}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
              Independent guides to merchant accounts, processing costs, and
              billing operations. We may earn a commission when you apply
              through our {siteConfig.partnerName} affiliate links.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Explore
            </p>
            <ul className="mt-3 space-y-2">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-700 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Partner · {siteConfig.partnerName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Compare pricing and features on our CDG Commerce guide, then check
              eligibility when you are ready.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/cdgcommerce"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
              >
                {softCtaCopy.seePricing}
              </Link>
              <TrackedAffiliateLink
                ctaPosition="footer"
                ctaText={softCtaCopy.checkEligibility}
                ctaType="footer"
                className="inline-flex rounded-lg bg-teal-800 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                {softCtaCopy.checkEligibility}
              </TrackedAffiliateLink>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            <Link
              href="/affiliate-disclosure"
              className="underline-offset-2 hover:text-slate-700 hover:underline"
            >
              Affiliate disclosure
            </Link>
            <span aria-hidden className="mx-2">
              ·
            </span>
            <Link
              href="/privacy"
              className="underline-offset-2 hover:text-slate-700 hover:underline"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
