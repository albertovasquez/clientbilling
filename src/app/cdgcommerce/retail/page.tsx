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
  title: "CDG Commerce Retail & POS Payments",
  description:
    "When CDG Commerce retail merchant accounts and POS options may fit brick-and-mortar and hybrid sellers.",
  alternates: { canonical: "/cdgcommerce/retail" },
  openGraph: {
    title: "CDG Commerce Retail & POS Payments | ClientBilling",
    description:
      "When CDG Commerce retail merchant accounts and POS options may fit brick-and-mortar and hybrid sellers.",
    url: "/cdgcommerce/retail",
  },
  robots: { index: true, follow: true },
};

const interchangePlus = cdgPlan("interchangePlus");
const flatRate = cdgPlan("flatRate");
const retailMarkup = interchangePlus.rates.find((r) => r.label.startsWith("Retail"))!;
const swipedFlat = flatRate.rates.find((r) => r.label.startsWith("Swiped"))!;

const rates = [
  {
    figure: retailMarkup.figure,
    label: "Above interchange, in person",
    detail: `Interchange plus, ${interchangePlus.bandShort.toLowerCase()}`,
  },
  {
    figure: swipedFlat.figure,
    label: "Flat rate, swiped and mobile",
    detail: `${flatRate.bandShort}, ${flatRate.monthlyFee}`,
  },
];

const included = [
  { label: "Terminal", value: "Countertop terminal placement at $79 a year, no purchase required" },
  { label: "Gateway", value: `${cdgCompany.gateways}, so the counter and the website share one account` },
  { label: "Virtual terminal", value: "Key in a card from a browser for phone orders and deposits" },
  { label: "Mobile reader", value: "A $99 card reader for sales away from the counter" },
  { label: "Support", value: cdgCompany.support },
];

const fits = [
  "You run a shop, a restaurant, or a service counter doing $10K a month or more",
  "You want to know the markup on every card-present sale and check it on the statement",
  "You also sell online and want one account, one statement, and one support number",
];

const notFits = [
  "You need an all-in-one POS with inventory and staff scheduling from the processor itself",
  "You process under $1K a month and want a free reader and an instant account",
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
              { label: "Retail and POS" },
            ]}
          />
          <Kicker className="mt-8">Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce for retail and POS
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Card-present sales carry lower interchange than online ones, and
            CDG publishes a lower markup to match. This page covers the
            in-person rate, the terminal placement, and who should look at a
            packaged POS instead.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>In-person rates CDG publishes</Heading>
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
          <SourceNote source={cdgSources.pricing} checked={CDG_CHECKED} className="mt-4" />
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
            title="Want the in-person rate on your own volume?"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="exploreRetail" position="end" variant="secondary" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            CDG answers with a rate sheet and a phone call. Ask about terminal
            placement and the reader at the same time.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
