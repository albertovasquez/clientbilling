import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy stub for ClientBilling — how we think about analytics, cookies, and affiliate links.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header>
        <h1 className="font-[family-name:var(--font-source-serif)] text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Privacy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Stub policy for MVP launch. Replace with counsel-reviewed language
          before collecting personal data at scale.
        </p>
      </header>

      <div className="prose prose-billing prose-lg mt-8 max-w-none">
        <p>
          {siteConfig.name} ({siteConfig.domain}) is an editorial site about
          customer billing best practices. This page is a transparent stub for
          the MVP.
        </p>

        <h2>What we collect (typical for this stack)</h2>
        <ul>
          <li>
            Standard server and hosting logs (IP address, user agent, request
            path) as provided by our hosting provider
          </li>
          <li>
            Optional analytics, if enabled later (page views, referrers)—we will
            update this page when that happens
          </li>
          <li>
            Information you voluntarily email us, if you contact us directly
          </li>
        </ul>

        <h2>What we do not do in this MVP</h2>
        <ul>
          <li>No user accounts or authentication</li>
          <li>No customer billing database on this site</li>
          <li>No sale of personal information as a business model</li>
        </ul>

        <h2>Affiliate links</h2>
        <p>
          Outbound links to CDG Commerce merchant application pages may include
          affiliate tracking parameters controlled by the partner. See our{" "}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for
          how those relationships work.
        </p>

        <h2>Cookies</h2>
        <p>
          The MVP does not set first-party marketing cookies. Hosting,
          security, or future analytics tooling may set strictly necessary or
          measurement cookies; we will document them here when introduced.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions about {siteConfig.domain}, contact the site
          operator once a production contact address is published. This stub
          will be replaced with a full policy as the product matures.
        </p>

        <p className="text-sm text-slate-500">
          Last updated: September 17, 2026
        </p>
      </div>
    </div>
  );
}
