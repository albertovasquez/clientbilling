import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & How it works",
  description:
    "What ClientBilling covers, who it is for, and how affiliate partnerships work — disclosed clearly.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientBilling",
    description:
      "Independent billing best practices for B2B SaaS, with transparent affiliate partner links.",
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
          {siteConfig.name} publishes practical guidance on customer billing for
          B2B SaaS and subscription businesses. We also introduce readers to
          partner products when those products are a reasonable fit—and we say
          so when a link is monetized.
        </p>
      </header>

      <div className="prose prose-billing prose-lg mt-10 max-w-none">
        <h2>What we cover</h2>
        <p>
          Our editorial focus is operational: invoice clarity, collections and
          dunning, subscription metrics, usage-based pricing pitfalls, and how
          to evaluate billing software. We write for founders, finance
          operations, customer success, and revenue teams who own the customer
          bill—not for abstract growth theory.
        </p>

        <h2>Who this is for</h2>
        <ul>
          <li>B2B SaaS teams running subscriptions, seats, or usage pricing</li>
          <li>Services firms that invoice on milestones or retainers</li>
          <li>Operators improving cash collection without burning goodwill</li>
        </ul>

        <h2>How affiliate partnerships work</h2>
        <p>
          Some calls-to-action on this site link to a partner signup URL
          configured via{" "}
          <code>NEXT_PUBLIC_AFFILIATE_SIGNUP_URL</code>. If you sign up through
          those links, we may earn a commission at no additional cost to you.
        </p>
        <p>
          That relationship does not mean every article is a product pitch. We
          aim for checklists and frameworks you can use even if you never click
          a partner link. When we recommend evaluating software, we encourage
          you to run your own scorecard—pricing model fit, tax readiness,
          finance handoff, and implementation risk.
        </p>
        <p>
          Full details live on our{" "}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> page.
          Privacy practices are summarized in{" "}
          <Link href="/privacy">Privacy</Link>.
        </p>

        <h2>What we are not</h2>
        <p>
          We are not your attorney, accountant, or payment processor. Content is
          educational and general in nature. For tax, contract, or compliance
          decisions, consult qualified professionals and your own counsel.
        </p>

        <h2>Contact</h2>
        <p>
          For editorial or partnership questions related to{" "}
          {siteConfig.domain}, use the contact channel published when the site
          goes fully live on production hosting. Until then, treat this page as
          the source of truth for how the product and affiliate model work.
        </p>
      </div>

      <div className="mt-12">
        <AffiliateCTA
          headline="Curious about the partner platform?"
          body="Review the signup flow yourself. Affiliate support helps fund this editorial work; it should never replace your diligence."
        />
      </div>
    </div>
  );
}
