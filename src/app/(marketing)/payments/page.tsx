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
  SourceNote,
} from "@/components/ui";
import { CDG_CHECKED, cdgPlan, cdgSources } from "@/lib/cdg";
import { exampleInvoice, exampleInvoiceCosts } from "@/lib/example-invoice";
import { formatCents } from "@/lib/money";

export const metadata: Metadata = {
  title: "What getting paid costs",
  description:
    "The ways a client can pay an invoice and what each one costs: flat-rate card, interchange-plus card, and bank transfer. Every rate names its source and the date it was checked.",
  alternates: { canonical: "/payments" },
  openGraph: {
    title: "What getting paid costs | ClientBilling",
    description:
      "Flat-rate card, interchange-plus card, and bank transfer, with the fee and the expected net on an example invoice.",
    url: "/payments",
  },
  robots: { index: true, follow: true },
};

const flatRate = cdgPlan("flatRate");
const interchangePlus = cdgPlan("interchangePlus");
const costs = exampleInvoiceCosts(exampleInvoice.amountCents);
const exampleAmount = formatCents(exampleInvoice.amountCents);

/** The cost rows for the example invoice, read from the same calculator the hero uses. */
const railRows = costs.map((cost) => ({
  label: cost.label,
  value:
    cost.netCents === null
      ? `${formatCents(cost.knownFeeCents)} known, plus ${cost.variableComponents
          .map((component) => component.label)
          .join(" and ")}`
      : `${formatCents(cost.knownFeeCents)} fee, ${formatCents(cost.netCents)} net`,
}));

export default function PaymentsPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Payments" }]} />
          <Kicker className="mt-8">Rails attached to the record</Kicker>
          <Heading level={1} className="mt-2">
            What getting paid costs
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            ClientBilling is the invoice. How a client pays it is a rail you
            choose, and every rail has a cost. This page lists the ways money can
            reach you, what each one takes, and where the number came from. When a
            cost cannot be known before the card is presented, it says so instead
            of estimating.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            ClientBilling is not a payment processor. It never sees a card number
            and never holds your money.
          </p>
        </Container>
      </Section>

      <Section band="field" rule id="rails">
        <Container width="article">
          <Heading level={2}>Three rails on a {exampleAmount} invoice</Heading>
          <p className="mt-4 text-body text-ink-soft">
            The same numbers the homepage shows, on the example invoice. Change
            the amount on the homepage to see them move.
          </p>
          <FactRows className="mt-6" rows={railRows} />
          <SourceNote
            className="mt-4"
            source={cdgSources.pricing}
            checked={CDG_CHECKED}
            note="The bank transfer fee is your own setting; the figure above is an example."
          />
          <Button href="/" variant="quiet" className="mt-6">
            Try it with your own amount
          </Button>
        </Container>
      </Section>

      <Section rule id="cards">
        <CardSection />
      </Section>

      <Section band="field" rule id="bank-transfer">
        <Container width="article">
          <Heading level={2}>Bank transfer and check</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Your payment instructions appear on every invoice, so a client can
            pay by bank transfer or check without a processor in the middle. The
            fee is whatever your bank charges you, which is why ClientBilling
            asks you for it rather than publishing one. On a large invoice this is
            usually the cheapest rail by a wide margin.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            The trade is speed and effort: a bank transfer settles on the bank&rsquo;s
            schedule and a client has to initiate it, where a card payment is one
            click for them.
          </p>
        </Container>
      </Section>

      <Section rule id="guides">
        <Container width="article">
          <Heading level={2}>Read further</Heading>
          <ul className="mt-6 space-y-3 text-body text-ink-soft">
            <li>
              <Link
                href="/tools/fee-calculator"
                className="font-semibold text-action underline-offset-4 hover:underline"
              >
                Fee calculator
              </Link>
              : your monthly volume and average ticket against each pricing model.
            </li>
            <li>
              <Link
                href="/blog/interchange-plus-vs-flat-rate-payment-processing"
                className="font-semibold text-action underline-offset-4 hover:underline"
              >
                Interchange-plus compared with flat rate
              </Link>
              : how the two models differ and where the crossover sits.
            </li>
            <li>
              <Link
                href="/cdgcommerce"
                className="font-semibold text-action underline-offset-4 hover:underline"
              >
                CDG Commerce review
              </Link>
              : the merchant account behind the card rates above, with its
              pricing, fit, and what we could not verify.
            </li>
          </ul>

          <DecisionCard
            title="Compare your card costs"
            headingLevel={2}
            className="mt-10"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <Button href="/tools/fee-calculator" variant="secondary">
                  Run the numbers first
                </Button>
              </>
            }
            note="A quote request ends in a phone call from CDG. Card data never touches ClientBilling."
          >
            Worth your time above roughly $10,000 a month of card volume. Under
            that, a flat-rate processor is usually the better deal.
          </DecisionCard>
          <Disclosure className="mt-4" />
        </Container>
      </Section>
    </>
  );
}

/** The card section. Split out so the two plan bands read as one block of copy. */
function CardSection() {
  return (
    <Container width="article">
      <Heading level={2}>Card payments</Heading>
      <p className="mt-4 text-body text-ink-soft">
        A card payment costs a percentage of the invoice plus a fixed amount per
        transaction. Which model is cheaper depends on how much card volume you
        run, and every processor publishes its rates. The difference is whether
        the rate is applied to the invoice in front of you before you send it.
      </p>
      <FactRows
        className="mt-6"
        rows={[
          {
            label: flatRate.name,
            value: `${flatRate.rates.map((rate) => `${rate.figure} ${rate.label.toLowerCase()}`).join(", ")}. ${flatRate.monthlyFee}. CDG publishes this for ${flatRate.band.toLowerCase()} of card volume.`,
          },
          {
            label: interchangePlus.name,
            value: `${interchangePlus.rates[0].figure} above interchange online. Interchange itself is set by the card networks and varies by card, so the total is not known until the card is presented. CDG publishes this for ${interchangePlus.band.toLowerCase()}.`,
          },
        ]}
      />
      <SourceNote className="mt-4" source={cdgSources.pricing} checked={CDG_CHECKED} />
      <p className="mt-6 text-body text-ink-soft">
        This is why the invoice shows a known fee and an expected net for flat
        rate, and a known markup with &ldquo;varies by card&rdquo; for
        interchange-plus. The second number cannot be honest any other way.
      </p>
    </Container>
  );
}
