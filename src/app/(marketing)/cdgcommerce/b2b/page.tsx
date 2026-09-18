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
  title: "CDG Commerce for B2B Payments",
  description:
    "When CDG Commerce may fit B2B invoicing, virtual terminal, and Level 2/3 card scenarios, then get a free quote.",
  alternates: { canonical: "/cdgcommerce/b2b" },
  openGraph: {
    title: "CDG Commerce for B2B Payments | ClientBilling",
    description:
      "B2B invoicing, virtual terminal, and Level 2/3 scenarios with CDG Commerce: research first, then free quote.",
    url: "/cdgcommerce/b2b",
  },
  robots: { index: true, follow: true },
};

const interchangePlus = cdgPlan("interchangePlus");
const flatRate = cdgPlan("flatRate");
const onlineMarkup = interchangePlus.rates.find((r) => r.label.startsWith("Online"))!;
const nonprofitMarkup = interchangePlus.rates.find((r) => r.label.startsWith("Nonprofit"))!;
const onlineFlat = flatRate.rates.find((r) => r.label.startsWith("Online"))!;

const rates = [
  {
    figure: onlineMarkup.figure,
    label: "Above interchange, invoiced and keyed",
    detail: `Interchange plus, ${interchangePlus.bandShort.toLowerCase()}`,
  },
  {
    figure: nonprofitMarkup.figure,
    label: "Above interchange, nonprofit",
    detail: "Interchange plus, registered nonprofits",
  },
  {
    figure: onlineFlat.figure,
    label: "Flat rate, online",
    detail: `${flatRate.bandShort}, ${flatRate.monthlyFee}`,
  },
];

const included = [
  { label: "Invoicing", value: "Email an invoice with a pay link; the customer pays by card without calling you" },
  { label: "Virtual terminal", value: "Key in a card from a browser for phone orders and purchase orders" },
  { label: "Level 2 and 3 data", value: "Interchange plus passes the lower interchange through when your gateway sends line-item and tax data; the discount depends on card type and data quality" },
  { label: "Gateway", value: `${cdgCompany.gateways}, included with no per-transaction gateway fee on interchange plus` },
  { label: "Recurring billing", value: "Retainers and monthly service contracts charged on a schedule" },
];

const fits = [
  "You invoice other businesses and want card payments on the invoice without a separate tool",
  "Your average ticket is large and you want interchange at cost so Level 2 and 3 savings reach you",
  "You are a nonprofit taking donations and pledges by card",
];

const notFits = [
  "You need net terms, credit checks, or trade financing from the payments provider",
  "You mostly collect by ACH and card is an afterthought",
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
              { label: "B2B payments" },
            ]}
          />
          <Kicker className="mt-8">Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce for B2B payments
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Business customers pay by emailed invoice, by card over the phone,
            or against a purchase order, and on interchange plus the lower
            Level 2 and 3 interchange passes through to you. This page covers
            the rates that apply and what CDG includes for billed receivables.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Rates that apply to invoiced and keyed sales</Heading>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
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
            title="Want a B2B rate on your own ticket size?"
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="exploreOnline" position="end" variant="secondary" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            Tell CDG your average invoice and how many are paid by card. Ask
            whether your gateway setup will send Level 2 and 3 data.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
