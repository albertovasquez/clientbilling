import Link from "next/link";
import { SoftCdgCta } from "@/components/SoftCdgCta";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { PostCard } from "@/components/PostCard";
import { getFeaturedPosts } from "@/lib/posts";
import { cdgClaims, softCtaCopy, siteConfig } from "@/lib/site";

const volumeCards = [
  {
    ...cdgClaims.volumeBands.simple,
    href: `/cdgcommerce#${cdgClaims.volumeBands.simple.anchor}`,
  },
  {
    ...cdgClaims.volumeBands.interchangePlus,
    href: `/cdgcommerce#${cdgClaims.volumeBands.interchangePlus.anchor}`,
  },
  {
    ...cdgClaims.volumeBands.wholesale,
    href: `/cdgcommerce#${cdgClaims.volumeBands.wholesale.anchor}`,
  },
];

const businessChips = [
  { label: "Online", href: "/cdgcommerce/online-payments" },
  { label: "Retail", href: "/cdgcommerce/retail" },
  { label: "B2B", href: "/cdgcommerce#fit" },
  { label: "Service", href: "/cdgcommerce#fit" },
  { label: "Subscription", href: "/cdgcommerce/recurring-billing" },
];

const faqs = [
  {
    q: "Is ClientBilling a payment processor?",
    a: "No. We publish independent guides and partner with CDG Commerce as an affiliate. You apply and contract directly with CDG if you choose them.",
  },
  {
    q: "Where do the pricing numbers come from?",
    a: "Volume bands and interchange-plus markups on this site are attributed to what CDG publishes. Interchange and card-network fees are separate. Always confirm current rates with CDG.",
  },
  {
    q: "What should I do first?",
    a: "Start with our CDG Commerce guide and volume selector, then check eligibility on CDG’s secure application when you are ready.",
  },
];

export default function HomePage() {
  const featured = getFeaturedPosts(3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,118,110,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(217,119,6,0.06),_transparent_50%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center lg:px-8 lg:py-24">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
              Merchant payment decision guide
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Find the Right Payment Processing Setup for Your Business
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Compare merchant accounts, processing costs, recurring billing,
              payment gateways, invoicing and POS options — then decide whether
              CDG Commerce is worth a closer look.
            </p>
            <div className="mt-8">
              <SoftCdgCta />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Affiliate disclosure: we may earn a commission from{" "}
              {siteConfig.partnerName} applications.{" "}
              <Link
                href="/affiliate-disclosure"
                className="underline underline-offset-2 hover:text-slate-700"
              >
                Details
              </Link>
              .
            </p>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-7">
              <p className="text-sm font-semibold text-slate-900">
                Why look at {siteConfig.partnerName}
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                {cdgClaims.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                Features listed as CDG publishes / states them. Confirm current
                capabilities directly with CDG.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Start with your monthly volume
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          CDG publishes different pricing approaches by volume band. Pick the
          range that matches you to jump into the guide.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {volumeCards.map((card) => (
            <Link
              key={card.anchor}
              href={card.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                {card.model}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-teal-800">
                {card.label}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{card.note}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-teal-800">
                See details →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-sm font-semibold text-slate-800">
            Business type
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {businessChips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Trust signals (as CDG states)
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            We attribute these claims to CDG’s own published messaging — we do
            not invent independent statistics.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cdgClaims.trust.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm"
              >
                {item}
              </li>
            ))}
            <li className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm">
              {cdgClaims.contract.noLongTerm}
            </li>
            <li className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm">
              {cdgClaims.approval}
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Featured guides
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              High-intent reviews and pricing explainers to help you decide.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-teal-800 hover:text-teal-700"
          >
            View all posts
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <PostCard key={post.slug} post={post} featured />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
            FAQ
          </h2>
          <dl className="mt-8 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="text-base font-semibold text-slate-900">
                  {item.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Next step
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Prefer to research first? Open the CDG Commerce guide. Ready to
              see if you qualify? Check eligibility on CDG’s secure application.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/cdgcommerce"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                {softCtaCopy.seePricing}
              </Link>
              <TrackedAffiliateLink
                ctaPosition="home_faq"
                ctaText={softCtaCopy.checkEligibility}
                ctaType="eligibility"
                className="inline-flex rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                {softCtaCopy.checkEligibility}
              </TrackedAffiliateLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
