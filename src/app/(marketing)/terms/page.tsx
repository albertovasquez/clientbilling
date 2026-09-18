import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Kicker, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Terms for using the ClientBilling website and invoice app.",
  alternates: { canonical: "/terms" },
};

const link = "text-action underline-offset-4 hover:underline";

export default function TermsPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 18, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Terms of service
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            These terms cover the {siteConfig.name} website and the invoice app at
            /app. They are written plainly and will be reviewed by counsel before
            the app is promoted at scale. Using the site or the app means you
            accept them.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>What ClientBilling is and is not</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>ClientBilling is invoice software and an editorial website. It is not a bank, payment processor, payment facilitator, money transmitter, or merchant of record.</li>
            <li>Payments between you and your clients settle directly, by whatever method you state on your invoices. ClientBilling never holds, moves, or has access to those funds.</li>
            <li>ClientBilling is an independent affiliate of CDG Commerce and may earn a commission when you apply through our links. Your agreement for a merchant account is with CDG Commerce, not with us. See the <Link href="/affiliate-disclosure" className={link}>affiliate disclosure</Link>.</li>
            <li>Rates, fees, and features attributed to CDG Commerce or any other provider are quoted from their published pages on the date shown and are not a quote or a promise from ClientBilling.</li>
          </ul>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Your account and your content</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>You must be at least 18 and using the app for a business. You are responsible for keeping your password private and for everything done under your account.</li>
            <li>Invoices, client records, and payment instructions are your content. You own them, you are responsible for their accuracy, and you must have the right to bill the people you invoice.</li>
            <li>You may not use the app to send invoices you are not entitled to send, to send unsolicited email, or to invoice for anything unlawful.</li>
            <li>We may suspend an account that sends abusive or fraudulent invoices, and we will say why unless the law prevents it.</li>
          </ul>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Service, changes, and liability</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>The app is free today. If that changes, we will announce it at least 30 days in advance and existing invoices will stay accessible.</li>
            <li>The app is provided as is. We work to keep it available and accurate, but we do not guarantee uninterrupted service, and we are not liable for lost profits or indirect losses arising from its use. Where liability cannot be excluded, it is limited to the amount you paid us in the prior twelve months, which today is zero.</li>
            <li>We may change these terms. Material changes are announced on this page with a new date and, for account holders, by email.</li>
            <li>These terms are governed by the laws of the State of Florida, United States.</li>
          </ul>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Privacy and contact</Heading>
          <p className="mt-4 text-body text-ink-soft">
            How we handle data is on the{" "}
            <Link href="/privacy" className={link}>
              privacy
            </Link>{" "}
            page. Questions about these terms go to the address on the{" "}
            <Link href="/about" className={link}>
              about
            </Link>{" "}
            page.
          </p>
        </Container>
      </Section>
    </>
  );
}
