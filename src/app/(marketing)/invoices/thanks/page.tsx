import type { Metadata } from "next";
import {
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "You are on the invoice list",
  description:
    "Thanks for joining ClientBilling invoice early access. We will email you when create and send opens.",
  alternates: { canonical: "/invoices/thanks" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "You are on the invoice list | ClientBilling",
    description:
      "Thanks for joining invoice early access. We will email you when create and send opens.",
    url: "/invoices/thanks",
  },
};

export default function InvoicesThanksPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Early access</Kicker>
          <Heading level={1} className="mt-2">
            You are on the list
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            Thanks. We received your email for ClientBilling invoice early
            access. Invoices are not live yet. We will write when create and send
            is ready to try.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            No card data was collected. This was a waitlist signup only.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/" variant="secondary">
              Back to home
            </Button>
            <Button href="/invoices" variant="quiet">
              Return to invoices
            </Button>
          </div>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <DecisionCard
            title="While you wait"
            headingLevel={2}
            actions={
              <>
                <Button href="/tools/fee-calculator" variant="secondary">
                  Open the fee calculator
                </Button>
                <CtaButton cta="quote" position="end" />
              </>
            }
          >
            Estimate processing fees, or get a free CDG Commerce quote for online
            payments when you are ready to collect.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
