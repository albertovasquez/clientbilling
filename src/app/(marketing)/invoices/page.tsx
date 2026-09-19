import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  FactRows,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Free invoicing for businesses that bill clients",
  description:
    "Create, send, and track invoices for free on ClientBilling. Your payment instructions go on every invoice. Card payment through a CDG Commerce merchant account is planned. No card data on our servers.",
  alternates: { canonical: "/invoices" },
  openGraph: {
    title: "Free invoicing for businesses that bill clients | ClientBilling",
    description:
      "Create, send, and track invoices for free. Card payment through CDG Commerce is planned. No card data on our servers.",
    url: "/invoices",
  },
  robots: { index: true, follow: true },
};

export default function InvoicesPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Invoices" }]} />
          <Kicker className="mt-8">Free, no card required</Kicker>
          <Heading level={1} className="mt-2">
            Invoicing for businesses that bill clients
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            Create an invoice with line items and tax, send your client a link,
            see when it was opened, and mark it paid. Your payment instructions,
            bank transfer, check, or whatever you accept, appear on every invoice.
            ClientBilling stores no card numbers and is not a payment processor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/app/sign-up" size="lg">
              Create a free account
            </Button>
            <Button href="/app/sign-in" variant="secondary" size="lg">
              Sign in
            </Button>
          </div>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>What it does today</Heading>
          <FactRows
            className="mt-6"
            rows={[
              { label: "Create", value: "Line items, quantities, tax rate, due date, notes. Clients can be added inline." },
              { label: "Send", value: "Email the invoice link to your client from the app, or copy the link and send it your way." },
              { label: "Track", value: "See when a client opens the invoice. Mark it sent, paid, or void." },
              { label: "Get paid", value: "Your payment instructions show on the invoice. Print to PDF for records." },
              { label: "Cost", value: "Free. No card on file, no limits on invoices or clients." },
            ]}
          />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What is planned</Heading>
          <p className="mt-4 text-body text-ink-soft">
            A pay button on the invoice that charges the card through a CDG
            Commerce merchant account, with interchange plus pricing and a gateway
            included. That depends on CDG confirming the integration, and we will
            not turn it on until they do. Until then, payments settle directly
            between you and your client, as they do with any emailed invoice.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            If you want a merchant account ready for that day, you can request a
            CDG quote now. The pricing pays off above about $10,000 a month of
            card volume; under that, a flat-rate processor is usually the better
            deal and our guides say so.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Who it is for</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>U.S. service businesses, contractors, consultants, and agencies that invoice clients</li>
            <li>B2B sellers who need a clean invoice with tax and a due date</li>
            <li>Anyone who wants a free invoice tool without a processor deciding how they get paid</li>
          </ul>
          <p className="mt-4 text-small text-ink-soft">
            Vertical guides:{" "}
            <Link href="/for" className="font-semibold text-action underline-offset-4 hover:underline">
              contractors, agencies, consultants, and wholesale
            </Link>
            .
          </p>
          <DecisionCard
            title="Start invoicing"
            headingLevel={2}
            className="mt-10"
            actions={
              <>
                <Button href="/app/sign-up">Create a free account</Button>
                <CtaButton cta="quote" position="end" variant="secondary" />
              </>
            }
            note="Card data never touches ClientBilling. Merchant accounts are with CDG Commerce."
          >
            Free to use today. Request a CDG quote if you want a merchant account in place.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
