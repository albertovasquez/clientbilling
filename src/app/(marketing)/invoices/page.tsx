import type { Metadata } from "next";
import { InvoiceWaitlistForm } from "@/components/InvoiceWaitlistForm";
import {
  Breadcrumb,
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Create an invoice (early access)",
  description:
    "ClientBilling invoices: create and send, then collect online through CDG Commerce Quantum. Create and send invoices. Collect online via CDG Quantum. No card data on our servers.",
  keywords: [
    "client billing invoice",
    "create invoice",
    "send invoice online",
    "invoice payment link",
    "CDG Commerce Quantum invoice",
  ],
  alternates: { canonical: "/invoices" },
  openGraph: {
    title: "Create an invoice (early access) | ClientBilling",
    description:
      "Create and send ClientBilling invoices, then collect via CDG/Quantum. No card data on our servers.",
    url: "/invoices",
  },
  robots: { index: true, follow: true },
};

export default function InvoicesPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Invoices" },
            ]}
          />
          <Kicker className="mt-8">Early access</Kicker>
          <Heading level={1} className="mt-2">
            Create an invoice
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            ClientBilling invoices will let you create and send a professional
            invoice, then collect online through a CDG Commerce Quantum
            application or an existing Quantum login. Card data stays with the
            gateway. It never sits on ClientBilling servers.
          </p>
          <p className="mt-4 text-body font-semibold text-ink">
            Invoice create and send is in early access. Open the app to start, or
            join the email list if you prefer updates only.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/app/sign-up" size="lg">
              Create an invoice account
            </Button>
            <Button href="/app/sign-in" variant="secondary" size="lg">
              Sign in
            </Button>
          </div>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule id="waitlist">
        <Container width="article">
          <Heading level={2}>Join the invoice early-access list</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Tell us where to reach you. We use your email only for invoice
            product updates from ClientBilling.
          </p>
          <InvoiceWaitlistForm />
        </Container>
      </Section>

      <Section rule id="how-it-works">
        <Container>
          <Heading level={2}>How it is meant to work</Heading>
          <ol className="mt-8 grid gap-8 sm:grid-cols-3">
            <li>
              <Heading level={3}>1. Create and send</Heading>
              <p className="mt-2 text-small text-ink-soft">
                Draft the invoice on ClientBilling and email a clear pay link to
                your client.
              </p>
            </li>
            <li>
              <Heading level={3}>2. Enable collect</Heading>
              <p className="mt-2 text-small text-ink-soft">
                Apply for CDG Commerce online payments, or connect an existing
                Quantum gateway login when you already have one.
              </p>
            </li>
            <li>
              <Heading level={3}>3. Client pays on Quantum</Heading>
              <p className="mt-2 text-small text-ink-soft">
                Payment runs on Quantum hosted pay. ClientBilling never stores
                card numbers.
              </p>
            </li>
          </ol>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <DecisionCard
            title="Need rates or a processor quote today?"
            headingLevel={2}
            actions={
              <>
                <Button href="/tools/fee-calculator" variant="secondary">
                  Open the fee calculator
                </Button>
                <CtaButton cta="quote" position="end" />
              </>
            }
            note="Invoice create and send is not available yet. The calculator and CDG quote path work now."
          >
            Compare published fee schedules, or request a free CDG Commerce quote
            while you wait for invoices.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
