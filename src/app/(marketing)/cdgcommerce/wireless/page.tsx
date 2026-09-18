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
  title: "CDG Commerce Wireless & Mobile Payments",
  description:
    "When CDG Commerce wireless / mobile payment options may fit field teams, pop-ups, and on-the-go card acceptance.",
  alternates: { canonical: "/cdgcommerce/wireless" },
  openGraph: {
    title: "CDG Commerce Wireless & Mobile Payments | ClientBilling",
    description:
      "When CDG Commerce wireless / mobile payment options may fit field teams, pop-ups, and on-the-go card acceptance.",
    url: "/cdgcommerce/wireless",
  },
  robots: { index: true, follow: true },
};

const interchangePlus = cdgPlan("interchangePlus");
const flatRate = cdgPlan("flatRate");
const swipedFlat = flatRate.rates.find((r) => r.label.startsWith("Swiped"))!;
const retailMarkup = interchangePlus.rates.find((r) => r.label.startsWith("Retail"))!;

const rates = [
  {
    figure: swipedFlat.figure,
    label: "Flat rate, swiped and mobile",
    detail: `${flatRate.bandShort}, ${flatRate.monthlyFee}`,
  },
  {
    figure: retailMarkup.figure,
    label: "Above interchange, in person",
    detail: `Interchange plus, ${interchangePlus.bandShort.toLowerCase()}`,
  },
];

const included = [
  { label: "Mobile reader", value: "A $99 card reader that pairs with a phone or tablet" },
  { label: "Keyed fallback", value: "Keyed transactions on flat rate carry a 0.60% surcharge, so tap or dip when you can" },
  { label: "Virtual terminal", value: "Key in a card from any browser when the reader is out of reach" },
  { label: "Gateway", value: `${cdgCompany.gateways}, shared with your online and counter sales` },
  { label: "Support", value: cdgCompany.support },
];

const fits = [
  "You sell at markets, events, or on a customer's doorstep and want the same account as your counter",
  "You are under $10K a month and want one flat swiped rate with a small monthly fee",
  "You are over $10K a month and want the published in-person markup on mobile sales too",
];

const notFits = [
  "You want a free reader and an account that works the same afternoon",
  "Most of your mobile sales are keyed, not tapped, and the surcharge would add up",
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
              { label: "Mobile payments" },
            ]}
          />
          <Kicker className="mt-8">Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce for mobile and wireless payments
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Field sales, deliveries, markets, and pop-ups need to take a card
            away from a fixed register. CDG treats a mobile sale as a swiped
            sale, so the rate below is the one you would pay, and the reader
            is a one-time purchase.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Mobile rates CDG publishes</Heading>
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
          <SourceNote source={cdgSources.flatRate} checked={CDG_CHECKED} className="mt-4" />
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
            title="Want a mobile rate for your own volume?"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="exploreMobile" position="end" variant="secondary" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            Tell CDG how much of your volume is tapped and how much is keyed.
            The answer decides whether flat rate or interchange plus costs
            less.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
