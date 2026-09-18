import type { Metadata } from "next";
import {
  Breadcrumb,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  FactRows,
  Heading,
  Kicker,
  RateLockup,
  Section,
  SourceNote,
} from "@/components/ui";
import { CDG_CHECKED, cdgCompany, cdgPlan, cdgSources } from "@/lib/cdg";

export const metadata: Metadata = {
  title: "CDG Commerce Recurring Billing",
  description:
    "How CDG Commerce lists recurring billing for subscriptions and repeat charges, and when to compare alternatives.",
  alternates: { canonical: "/cdgcommerce/recurring-billing" },
  openGraph: {
    title: "CDG Commerce Recurring Billing | ClientBilling",
    description:
      "How CDG Commerce lists recurring billing for subscriptions and repeat charges, and when to compare alternatives.",
    url: "/cdgcommerce/recurring-billing",
  },
  robots: { index: true, follow: true },
};

const interchangePlus = cdgPlan("interchangePlus");
const flatRate = cdgPlan("flatRate");
const onlineMarkup = interchangePlus.rates.find((r) => r.label.startsWith("Online"))!;
const onlineFlat = flatRate.rates.find((r) => r.label.startsWith("Online"))!;

const rates = [
  {
    figure: onlineMarkup.figure,
    label: "Above interchange, each scheduled charge",
    detail: `Interchange plus, ${interchangePlus.bandShort.toLowerCase()}`,
  },
  {
    figure: onlineFlat.figure,
    label: "Flat rate, each scheduled charge",
    detail: `${flatRate.bandShort}, ${flatRate.monthlyFee}`,
  },
];

const included = [
  { label: "Recurring billing", value: "Store a card once and charge it on a schedule you set" },
  { label: "Invoicing", value: "Email an invoice with a pay link and let the customer pay it by card" },
  { label: "Gateway", value: `${cdgCompany.gateways}, included with no per-transaction gateway fee on interchange plus` },
  { label: "Virtual terminal", value: "Key in a card for a one-off charge or a retainer top-up" },
  { label: "Integrations", value: `${cdgCompany.integrations} through the gateway` },
];

const fits = [
  "You bill memberships, retainers, or a simple plan catalog and want the charges on a merchant account you control",
  "You process $10K a month or more and want the scheduled charges priced at a published markup",
  "You want invoicing and recurring charges from the same account as your one-time sales",
];

const notFits = [
  "You need usage metering, proration, and entitlement logic from the billing system itself",
  "You process under $1K a month and want a free subscription tool with an instant account",
  "You are outside the U.S.",
];

export default function Page() {
  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "CDG Commerce", href: "/cdgcommerce" },
              { label: "Recurring billing" },
            ]}
          />
          <Kicker className="mt-8">Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce for recurring billing
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Recurring billing is where processing meets retention: stored
            cards, failed charges, and plan changes. CDG runs scheduled charges
            through its gateway, and each one is priced at the online rate, so
            the numbers below are the numbers that apply.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>What a scheduled charge costs</Heading>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {rates.map((rate) => (
              <RateLockup key={rate.label} figure={rate.figure} label={rate.label} detail={rate.detail} />
            ))}
          </div>
          <SourceNote
            source={cdgSources.interchangePlus}
            checked={CDG_CHECKED}
            note="The flat rate figure is from CDG's flat rate pricing page. Interchange and network fees are separate."
            className="mt-6"
          />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What is included</Heading>
          <FactRows rows={included} className="mt-6" />
          <SourceNote source={cdgSources.about} checked={CDG_CHECKED} className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <Heading level={2} size="sm">Who it fits</Heading>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-ink-soft">
                {fits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <Heading level={2} size="sm">Who it does not</Heading>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-ink-soft">
                {notFits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <DecisionCard
            title="Want recurring charges priced on your own volume?"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="exploreOnline" position="end" variant="secondary" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            Tell CDG how many charges you run a month and the average ticket.
            Those two numbers set the quote.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
