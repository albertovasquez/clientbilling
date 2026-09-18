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
  title: "CDG Commerce Online Payments",
  description:
    "When CDG Commerce online / internet merchant accounts may fit e-commerce, invoicing, and remote-first businesses.",
  alternates: { canonical: "/cdgcommerce/online-payments" },
  openGraph: {
    title: "CDG Commerce Online Payments | ClientBilling",
    description:
      "When CDG Commerce online / internet merchant accounts may fit e-commerce, invoicing, and remote-first businesses.",
    url: "/cdgcommerce/online-payments",
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
    label: "Above interchange, online",
    detail: `Interchange plus, ${interchangePlus.bandShort.toLowerCase()}`,
  },
  {
    figure: onlineFlat.figure,
    label: "Flat rate, online",
    detail: `${flatRate.bandShort}, ${flatRate.monthlyFee}`,
  },
];

const included = [
  { label: "Gateway", value: `${cdgCompany.gateways}, included with no per-transaction gateway fee on interchange plus` },
  { label: "Virtual terminal", value: "Key in a card from a browser when a customer calls with an order" },
  { label: "Recurring billing and invoicing", value: "Scheduled charges and emailed invoices from the same account" },
  { label: "Integrations", value: `${cdgCompany.integrations} through the gateway` },
  { label: "Support", value: cdgCompany.support },
];

const fits = [
  "You sell through a website or a hosted checkout and process $10K a month or more",
  "You already pay for Authorize.Net separately and would rather have the gateway included",
  "Your finance team keys the occasional phone order and wants it on the same statement",
];

const notFits = [
  "You are outside the U.S.",
  "You process under $1K a month and want an instant, self-serve account with no phone call",
  "You need a marketplace or split-payment setup rather than a single merchant account",
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
              { label: "Online payments" },
            ]}
          />
          <Kicker className="mt-8">Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce for online payments
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            If most of your revenue arrives through a website, a customer
            portal, or an emailed invoice, this is the CDG account you would
            be quoted. It pairs a merchant account with a Quantum or
            Authorize.Net gateway, and the online markup is published.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Online rates CDG publishes</Heading>
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
            title="Ready to see the online rate on your own volume?"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="exploreOnline" position="end" variant="secondary" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            A quote request ends in a phone call and a written rate sheet.
            Have your monthly volume and current statement to hand.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
