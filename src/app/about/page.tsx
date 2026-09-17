import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & How it works",
  description:
    "What ClientBilling covers, who it is for, and how our CDG Commerce affiliate partnership works — disclosed clearly.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientBilling",
    description:
      "Merchant-payment decision guides with a transparent CDG Commerce affiliate partnership.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
          About
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          How ClientBilling works
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {siteConfig.name} helps businesses compare merchant accounts,
          processing costs, recurring billing, gateways, invoicing, and POS
          options. We partner with {siteConfig.partnerName} as an affiliate and
          say so when a link is monetized.
        </p>
      </header>

      <div className="prose prose-billing prose-lg mt-10 max-w-none">
        <h2>What we cover</h2>
        <p>
          Decision guides for payment processing and billing operations —
          including our primary{" "}
          <Link href="/cdgcommerce">CDG Commerce review &amp; pricing guide</Link>
          , channel pages for online, retail, recurring, and wireless, plus
          editorial comparisons and billing best-practice posts.
        </p>

        <h2>Who this is for</h2>
        <ul>
          <li>Online and retail merchants evaluating processor options</li>
          <li>Subscription and services businesses needing recurring charges</li>
          <li>Operators who want attributed pricing claims — not invented stats</li>
        </ul>

        <h2>Our affiliate partnership with CDG Commerce</h2>
        <p>
          ClientBilling is an affiliate partner of {siteConfig.partnerName}.
          Money-intent CTAs use a tracked secure application URL. Soft CTAs
          route to our internal guides first. If you apply through those
          affiliate links, we may earn a commission at no additional cost to
          you.
        </p>
        <p>
          Learn more on the{" "}
          <Link href="/cdgcommerce">CDG Commerce guide</Link>, or read the full{" "}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
        </p>

        <h2>What we are not</h2>
        <p>
          We are not your attorney, accountant, or payment processor. Content is
          educational and general. For tax, contract, or compliance decisions,
          consult qualified professionals. We do not invent commission rates or
          unpublished CDG statistics.
        </p>
      </div>

      <div className="mt-12">
        <AffiliateCTA
          headline="Curious about CDG Commerce?"
          body="Start with our independent guide. Affiliate support helps fund this editorial work; it should never replace your diligence."
        />
      </div>
    </div>
  );
}
