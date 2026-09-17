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
          Our primary affiliate partner is {siteConfig.partnerName}. For an
          independent overview of pricing and features, see our{" "}
          <Link href="/cdgcommerce">CDG Commerce guide</Link>. Bottom-of-funnel
          “check eligibility” links go to CDG’s secure application via our
          tracked affiliate URL. We do not invent or publish commission rates;
          compensation terms are set by the partner.
        </p>

        <h2>How we use CTAs</h2>
        <p>
          Soft CTAs (for example “See CDG Commerce Pricing &amp; Options”) keep
          you on ClientBilling guides. Stronger eligibility CTAs appear after
          you have context and use the tracked affiliate application URL.
        </p>

        <h2>Editorial independence</h2>
        <p>
          Affiliate support helps fund this site. It does not mean every article
          is a product pitch. We attribute CDG-published claims carefully and
          encourage you to verify pricing and fit directly with CDG.
        </p>

        <h2>Questions</h2>
        <p>
          See also <Link href="/about">About</Link> and{" "}
          <Link href="/privacy">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
