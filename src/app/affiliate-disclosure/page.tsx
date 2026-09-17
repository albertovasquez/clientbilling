import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How ClientBilling uses CDG Commerce affiliate links and commissions — plain-language, FTC-friendly disclosure.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <h1 className="font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Affiliate Disclosure
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          We believe readers deserve a clear explanation of how this site is
          funded.
        </p>
      </header>

      <div className="prose prose-billing prose-lg mt-8 max-w-none">
        <h2>The short version</h2>
        <p>
          Some links on {siteConfig.name} are affiliate links to{" "}
          <strong>{siteConfig.partnerName}</strong>. If you click through and
          apply for a merchant account or otherwise sign up, we may receive a
          commission. You do not pay more because you used our link.
        </p>

        <h2>Our partner</h2>
        <p>
          Our primary affiliate partner is {siteConfig.partnerName}. You can
          learn more on their site (
          <a
            href={siteConfig.partnerLinks.home}
            rel="noopener noreferrer"
            target="_blank"
          >
            cdgcommerce.com
          </a>
          ) or on our{" "}
          <Link href="/get-started">Get started</Link> page. We do not invent
          or publish commission rates; compensation terms are set by the
          partner.
        </p>

        <h2>Where you will see them</h2>
        <ul>
          <li>Primary calls-to-action in the header, footer, and homepage</li>
          <li>The Get started page and related partner modules</li>
          <li>End-of-article partner CTAs on blog posts</li>
        </ul>
        <p>
          Affiliate destinations are configured with the environment variable{" "}
          <code>NEXT_PUBLIC_AFFILIATE_SIGNUP_URL</code>. The default points to
          the {siteConfig.partnerName} merchant application for ClientBilling.
        </p>

        <h2>How we try to stay honest</h2>
        <ul>
          <li>
            Editorial guides focus on practices you can apply with any stack
          </li>
          <li>
            We encourage independent evaluation (see{" "}
            <Link href="/blog/choosing-billing-software-for-b2b-saas">
              Choosing Billing Software for B2B SaaS
            </Link>
            )
          </li>
          <li>
            We name {siteConfig.partnerName}, label partner CTAs, and maintain
            this disclosure page in line with FTC endorsement guidance
          </li>
        </ul>

        <h2>Your responsibility</h2>
        <p>
          Always review {siteConfig.partnerName}&apos;s pricing, terms,
          security posture, and data processing agreements yourself. Affiliate
          compensation is not a substitute for due diligence.
        </p>

        <h2>Questions</h2>
        <p>
          More context on our model is on the{" "}
          <Link href="/about">About &amp; How it works</Link> page and{" "}
          <Link href="/get-started">Get started with CDG Commerce</Link>. This
          disclosure may be updated as partnerships change.
        </p>

        <p className="text-sm text-slate-500">
          Last updated: September 17, 2026
        </p>
      </div>
    </div>
  );
}
