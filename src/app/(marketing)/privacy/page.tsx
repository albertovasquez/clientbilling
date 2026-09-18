import type { Metadata } from "next";
import Link from "next/link";
import { Container, FactRows, Heading, Kicker, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What ClientBilling collects for the website and the invoice app, how long it is kept, and what is never collected.",
  alternates: { canonical: "/privacy" },
};

const link = "text-action underline-offset-4 hover:underline";

export default function PrivacyPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 18, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Privacy
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            {siteConfig.name} ({siteConfig.domain}) is two things: a website about
            merchant accounts and billing, and an invoice app at /app. This page
            says what each one collects and what neither one does. It is a plain
            starting policy and will be reviewed by counsel before the app is
            promoted at scale.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>The website</Heading>
          <FactRows
            className="mt-6"
            rows={[
              {
                label: "Server logs",
                value: "Our hosting provider records the standard request log: IP address, user agent, and the path requested.",
              },
              {
                label: "Product events",
                value:
                  "We record a small number of first-party events, such as a click on a CDG Commerce link or a completed fee calculation, with the page and a coarse country. No cookies, no cross-site identifiers, no third-party analytics.",
              },
              {
                label: "Email",
                value: "Whatever you choose to send us if you contact us directly.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>The invoice app</Heading>
          <FactRows
            className="mt-6"
            rows={[
              {
                label: "Your account",
                value: "Name, email, and a hashed password. We never see or store the password itself.",
              },
              {
                label: "Your business profile",
                value: "Business name, contact details, address, an optional logo URL, and the payment instructions you choose to show on invoices.",
              },
              {
                label: "Your clients and invoices",
                value:
                  "Client names and contact details you enter, invoice line items, amounts, dates, status, and an event log (created, sent, opened, paid). This is your data; export or deletion is available on request while we build it into the app.",
              },
              {
                label: "Payers",
                value:
                  "When someone opens a public invoice link we record that it was opened and when. We do not track payers across sites and we set no cookies on invoice pages.",
              },
              {
                label: "Email delivery",
                value:
                  "Invoice emails are sent through a transactional email provider. The provider receives the recipient address, subject, and message body in order to deliver it.",
              },
              {
                label: "Session cookie",
                value: "Signing in sets one strictly necessary cookie that keeps you signed in. It is not used for advertising.",
              },
              {
                label: "Rate limiting",
                value: "We keep short-lived counters keyed by IP address and email to limit sign-in and email sending abuse. They expire within an hour.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>What we never collect</Heading>
          <FactRows
            className="mt-6"
            rows={[
              {
                label: "Card data",
                value:
                  "No card numbers, expiry dates, or security codes, on any page, ever. Card payments, when they exist, will run on a CDG Commerce merchant account and a gateway that is not ours.",
              },
              {
                label: "Bank credentials",
                value: "Payment instructions you enter are free text you control. We do not connect to your bank.",
              },
              {
                label: "Selling data",
                value: "We do not sell personal information and we do not share invoice data with CDG Commerce or anyone else.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Retention and deletion</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Account, client, and invoice data is kept while your account exists.
            Product events are kept for 180 days. To delete your account and its
            data, email the address on the{" "}
            <Link href="/about" className={link}>
              about
            </Link>{" "}
            page from the email on the account and we will confirm within a few days.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Affiliate links</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Outbound links to CDG Commerce carry parameters that tell CDG the
            application came from ClientBilling. CDG controls what it records on
            its own pages. The{" "}
            <Link href="/affiliate-disclosure" className={link}>
              affiliate disclosure
            </Link>{" "}
            explains that relationship. See also the{" "}
            <Link href="/terms" className={link}>
              terms of service
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
