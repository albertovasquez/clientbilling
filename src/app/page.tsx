import Link from "next/link";
import { AffiliateCTA } from "@/components/AffiliateCTA";
import { PostCard } from "@/components/PostCard";
import { getFeaturedPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

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
              {siteConfig.domain}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Billing best practices for teams that invoice and subscribe
              customers
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Practical guidance on invoicing clarity, subscription metrics,
              dunning, and usage-based pricing—written for B2B SaaS operators,
              founders, and revenue teams.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={siteConfig.affiliateSignupUrl}
                className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                rel="noopener noreferrer sponsored"
              >
                Apply for a merchant account
              </Link>
              <Link
                href="/get-started"
                className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                Learn more
              </Link>
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
                Built for operators who care about cash, not just charts
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                  />
                  Clear invoicing that reduces late payments
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                  />
                  Subscription metrics finance and product can share
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                  />
                  Dunning that recovers revenue without burning trust
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700"
                  />
                  Transparent {siteConfig.partnerName} affiliate recommendations
                </li>
              </ul>
              <Link
                href="/get-started"
                className="mt-6 inline-flex text-sm font-semibold text-teal-800 hover:text-teal-700"
              >
                Get started with CDG Commerce
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Featured guides
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Start with the pieces teams ask for most: invoice clarity,
              metrics that matter, and respectful recovery.
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

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <AffiliateCTA />
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 sm:py-16 lg:px-8">
          {[
            {
              title: "Audience",
              body: "Founders, finance ops, and CS leaders at B2B SaaS and subscription businesses who own the customer bill.",
            },
            {
              title: "Editorial focus",
              body: "Invoicing, collections, subscription metrics, usage pricing, and choosing billing software—with actionable checklists.",
            },
            {
              title: "Transparency",
              body: `We disclose our ${siteConfig.partnerName} affiliate relationship and keep recommendations grounded in operational reality.`,
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
