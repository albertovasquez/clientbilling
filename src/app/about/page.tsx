import type { Metadata } from "next";
import Link from "next/link";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ClientBilling",
  description:
    "ClientBilling is an independent publication covering payments, merchant accounts, recurring billing, invoicing, and POS — with a transparent CDG Commerce affiliate partnership.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientBilling",
    description:
      "Independent payments and billing guidance with a disclosed CDG Commerce affiliate relationship.",
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
          Independent guidance on payments and billing
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {siteConfig.name} is an editorial site for operators who need to get
          paid reliably — merchant accounts, online payments, recurring billing,
          invoicing, gateways, and POS. We publish practical decision guides,
          not vendor press releases.
        </p>
      </header>

      <div className="prose prose-billing prose-lg mt-10 max-w-none">
        <h2>What we publish</h2>
        <p>
          Long-form explainers and comparisons on processing costs, billing
          operations, and processor fit. Our primary money page is the{" "}
          <Link href="/cdgcommerce">CDG Commerce review &amp; pricing guide</Link>
          , with channel deep-dives for online, retail, mobile, recurring, and
          B2B paths, plus a broader blog on invoicing, dunning, and subscription
          metrics.
        </p>

        <h2>Who it is for</h2>
        <ul>
          <li>Online, retail, and hybrid merchants evaluating processors</li>
          <li>Subscription and services businesses that need recurring charges</li>
          <li>B2B teams that invoice, key cards, or care about Level 2/3 scenarios</li>
          <li>Operators who want attributed pricing claims — not invented stats</li>
        </ul>

        <h2>Our affiliate relationship with CDG Commerce</h2>
        <p>
          ClientBilling is an affiliate partner of {siteConfig.partnerName}. When
          you click certain CTAs — for example a free quote or eligibility check —
          you may land on CDG&apos;s secure application through a tracked affiliate
          link. If you apply through those links, we may earn a commission at no
          additional cost to you.
        </p>
        <p>
          Soft research CTAs keep you on our guides first. We attribute CDG-published
          claims carefully and do not invent commission rates or unpublished
          statistics. Full details live on the{" "}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> page,
          which remains part of how we meet FTC expectations for clear disclosure.
        </p>

        <h2>Editorial standards</h2>
        <p>
          We separate research from conversion. Guides explain volume bands,
          features, and fit using language CDG publishes; bottom-of-funnel CTAs
          are labeled and tracked. When CDG and other processors differ, we say
          so rather than forcing a single recommendation.
        </p>

        <h2>What we are not</h2>
        <p>
          We are not your attorney, accountant, or payment processor. Content is
          educational and general. For tax, contract, underwriting, or compliance
          decisions, consult qualified professionals and confirm current terms
          directly with CDG or whatever provider you choose.
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
