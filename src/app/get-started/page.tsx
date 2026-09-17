import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get started with CDG Commerce",
  description:
    "Choose Internet, Retail, or Wireless landings from CDG Commerce — then apply for a merchant account through ClientBilling.",
  alternates: { canonical: "/get-started" },
  openGraph: {
    title: "Get started with CDG Commerce | ClientBilling",
    description:
      "Explore CDG Commerce channel landings (Internet, Retail, Wireless) or apply for a merchant account.",
    url: "/get-started",
  },
};

const highlights = [
  {
    title: "Payment gateways",
    body: "Accept cards online with gateway options that fit e-commerce, SaaS, and invoice-heavy workflows.",
  },
  {
    title: "Recurring billing",
    body: "Support subscriptions and repeat charges so cash flow stays predictable as you scale.",
  },
  {
    title: "Invoicing",
    body: "Send professional invoices and collect payment without bolting together disconnected tools.",
  },
  {
    title: "Chargeback help",
    body: "Get support when disputes arise so you can respond with process—not panic.",
  },
  {
    title: "POS & mobile",
    body: "Extend acceptance beyond the web with point-of-sale and mobile payment options when your team sells in person.",
  },
];

export default function GetStartedPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(15,118,110,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(217,119,6,0.06),_transparent_50%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-800">
            Partner with {siteConfig.partnerName}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Get started with CDG Commerce
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClientBilling recommends {siteConfig.partnerName} for teams that
            need a merchant account and payment stack—gateways, recurring
            billing, invoicing, chargeback support, POS, and mobile—without
            piecing everything together alone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={siteConfig.affiliateSignupUrl}
              className="inline-flex rounded-lg bg-teal-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              rel="noopener noreferrer sponsored"
            >
              Apply for a merchant account
            </Link>
            <a
              href={siteConfig.partnerLinks.home}
              className="inline-flex rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              rel="noopener noreferrer"
              target="_blank"
            >
              Visit CDG Commerce
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Affiliate disclosure: ClientBilling may earn a commission if you
            apply through our link.{" "}
            <Link
              href="/affiliate-disclosure"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              Learn more
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Choose how you accept payments
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Start with a mid-funnel landing for your channel—Internet, Retail, or
          Wireless—then apply when you are ready to convert.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {siteConfig.partnerChannels.map((channel) => {
            const landingHref = siteConfig.partnerLandings[channel.id];
            return (
              <article
                key={channel.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {channel.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {channel.description}
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <a
                    href={landingHref}
                    className="inline-flex items-center justify-center rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    rel="noopener noreferrer sponsored"
                    target="_blank"
                  >
                    Explore {channel.title} options
                  </a>
                  <Link
                    href={siteConfig.affiliateSignupUrl}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    rel="noopener noreferrer sponsored"
                  >
                    Apply now
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            What CDG Commerce helps with
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Highlights based on how {siteConfig.partnerName} positions its
            solutions for merchants. Always confirm capabilities, pricing, and
            fit directly with them.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="font-[family-name:var(--font-source-serif)] text-2xl font-semibold tracking-tight text-slate-900">
            Ready to apply?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Start the {siteConfig.partnerName} merchant application through our
            affiliate link. You will complete the form on their secure site.
          </p>
          <Link
            href={siteConfig.affiliateSignupUrl}
            className="mt-6 inline-flex rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            rel="noopener noreferrer sponsored"
          >
            Apply for a merchant account
          </Link>

          <h3 className="mt-12 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Learn more on CDG Commerce
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={siteConfig.partnerLinks.solutions}
                className="font-medium text-teal-800 hover:text-teal-700"
                rel="noopener noreferrer"
                target="_blank"
              >
                Solutions
              </a>
              <span className="text-slate-500">
                {" "}
                — products and payment capabilities
              </span>
            </li>
            <li>
              <a
                href={siteConfig.partnerLinks.industry}
                className="font-medium text-teal-800 hover:text-teal-700"
                rel="noopener noreferrer"
                target="_blank"
              >
                Industry
              </a>
              <span className="text-slate-500">
                {" "}
                — vertical-focused approaches
              </span>
            </li>
            <li>
              <a
                href={siteConfig.partnerLinks.about}
                className="font-medium text-teal-800 hover:text-teal-700"
                rel="noopener noreferrer"
                target="_blank"
              >
                About
              </a>
              <span className="text-slate-500">
                {" "}
                — company background
              </span>
            </li>
          </ul>

          <aside className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-amber-900">Affiliate disclosure</p>
            <p className="mt-2">
              ClientBilling is an affiliate partner of {siteConfig.partnerName}.
              If you apply or sign up through links on this site, we may earn a
              commission at no extra cost to you. We do not invent or publish
              commission rates here—terms are set by the partner. This is not
              financial, legal, or payment-compliance advice; evaluate{" "}
              {siteConfig.partnerName} against your own requirements. See our{" "}
              <Link
                href="/affiliate-disclosure"
                className="font-medium text-teal-800 underline underline-offset-2"
              >
                Affiliate Disclosure
              </Link>{" "}
              for full details.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
