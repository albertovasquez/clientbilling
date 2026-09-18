import type { Metadata } from "next";
import {
  CompareTable,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  FactRows,
  Heading,
  Kicker,
  ProsCons,
  RateLockup,
  RatingBadge,
  Section,
  SourceNote,
  VerdictBox,
} from "@/components/ui";
import {
  CDG_CHECKED,
  cdgBestFor,
  cdgCompany,
  cdgFit,
  cdgPlan,
  cdgPlans,
  cdgRating,
  cdgSources,
  cdgThirdPartyFees,
} from "@/lib/cdg";

export const metadata: Metadata = {
  title: "CDG Commerce Review, Pricing & Merchant Account Guide",
  description:
    "Independent CDG Commerce guide: who should consider it, pricing models with volume caution, features, FAQ, and how to get a free quote.",
  alternates: { canonical: "/cdgcommerce" },
  openGraph: {
    title: "CDG Commerce Review, Pricing & Merchant Account Guide",
    description:
      "Compare CDG Commerce options, fit, and pricing models, then get a free quote when ready.",
    url: "/cdgcommerce",
  },
  robots: { index: true, follow: true },
};

const interchangePlus = cdgPlan("interchangePlus");

const glanceRows = [
  { label: "Founded", value: cdgCompany.founded },
  { label: "Headquarters", value: cdgCompany.headquarters },
  { label: "Serves", value: cdgCompany.usOnly },
  { label: "Sponsor banks", value: cdgCompany.sponsorBanks },
  { label: "BBB rating", value: cdgCompany.bbb },
  { label: "Support", value: cdgCompany.support },
  ...cdgPlans.map((plan) => ({ label: plan.name, value: plan.band })),
];

const pros = [
  "The interchange plus markup is published, so you can audit every statement line against it",
  "A Quantum or Authorize.Net gateway comes with the account, with no per-transaction gateway fee",
  "Support is U.S.-based and in-house, around the clock",
  "Month to month with no early termination fee, as Merchant Maverick reports",
];

const cons = [
  "U.S. businesses only",
  "Wholesale membership fees are billed annually, not monthly",
  "There is no self-serve signup; the next step is a quote and a phone call",
];

const planRows = [
  {
    label: "Monthly volume",
    values: cdgPlans.map((plan) => plan.band),
  },
  {
    label: "Rates",
    values: cdgPlans.map((plan) => (
      <ul key={plan.key} className="space-y-1">
        {plan.rates.map((rate) => (
          <li key={rate.label}>
            {rate.label}: {rate.figure}
            {rate.detail ? ` (${rate.detail})` : ""}
          </li>
        ))}
      </ul>
    )),
  },
  {
    label: "Monthly fee",
    values: cdgPlans.map((plan) => plan.monthlyFee),
  },
  {
    label: "Gateway",
    values: [
      "Not listed on the plan page",
      "Quantum or Authorize.Net included, no per-transaction gateway fee",
      "Not listed on the plan page",
    ],
  },
  {
    label: "Terminal",
    values: [
      "Mobile card reader $99",
      "Countertop terminal placement $79 a year, no purchase required",
      "Countertop terminal placement $79 a year, no purchase required",
    ],
  },
  {
    label: "Billing",
    values: [
      "Monthly, with a 0.60% surcharge on keyed transactions",
      "Monthly, no fixed fee published",
      "Membership billed annually",
    ],
  },
];

const featureRows = [
  {
    label: "Gateways",
    value: `${cdgCompany.gateways}. Included on interchange plus with no per-transaction gateway fee.`,
  },
  {
    label: "Recurring billing and invoicing",
    value:
      "Scheduled charges and emailed invoices run through the same gateway as one-time payments.",
  },
  {
    label: "Virtual terminal",
    value: "Key in cards from a browser for phone and mail orders.",
  },
  {
    label: "POS and mobile",
    value:
      "Countertop terminal placement for the counter and a mobile card reader for sales away from it.",
  },
  {
    label: "Integrations",
    value: cdgCompany.integrations,
  },
];

const feeRows = [
  { label: "Contract", value: cdgThirdPartyFees.contract },
  { label: "Chargeback fee", value: cdgThirdPartyFees.chargeback },
  { label: "Retrieval fee", value: cdgThirdPartyFees.retrieval },
  { label: "Batch fee", value: cdgThirdPartyFees.batch },
  { label: "American Express surcharge", value: cdgThirdPartyFees.amexSurcharge },
  { label: "ACH", value: cdgThirdPartyFees.ach },
];

const questions = [
  {
    q: "Does ClientBilling set CDG's rates?",
    a: "No. Every rate on this page comes from CDG's own pricing pages, linked under each section. CDG confirms the rate that applies to you in a written quote.",
  },
  {
    q: "What is interchange plus?",
    a: "You pay the card networks' interchange at cost, plus a fixed markup the processor publishes. CDG's markup is 0.35% + $0.15 online and 0.30% + $0.10 in person. Interchange and network fees are set by the networks and billed separately.",
  },
  {
    q: "Is there one volume cutoff for wholesale?",
    a: "CDG lists wholesale membership for $200,000 a month and up, yet three of its four tiers cap below that. Treat the bands as a starting point and ask CDG which plan it would quote for your volume.",
  },
  {
    q: "Should I apply now or get a quote first?",
    a: "Get the quote first. A quote request ends in a phone call and a rate sheet you can compare with your current statement. The application is the underwriting step; start it once you have a rate you accept.",
  },
];

export default function CdgCommercePage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            CDG Commerce review: pricing, fees, and who it fits
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            CDG Commerce is a Florida merchant account provider that publishes
            its interchange plus markup, includes a gateway, and answers the
            phone itself. This page lays out the three plans at CDG&apos;s
            published prices, the fees CDG does not publish, and who should
            look elsewhere.
          </p>
          <Disclosure className="mt-4" />
          <RatingBadge
            rating={cdgRating}
            bestFor={cdgBestFor}
            size="lg"
            className="mt-8"
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CtaButton cta="quote" position="hero" size="lg" />
            <CtaButton cta="fit" position="hero" variant="secondary" size="lg" />
          </div>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>At a glance</Heading>
          <FactRows rows={glanceRows} columns={2} className="mt-6" />
          <SourceNote source={cdgSources.about} checked={CDG_CHECKED} className="mt-4" />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Pros and cons</Heading>
          <ProsCons pros={pros} cons={cons} className="mt-6" />
        </Container>
      </Section>

      <Section band="field" rule id="fit">
        <Container width="article">
          <Heading level={2}>Is CDG a fit?</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Most of the answer comes down to where you are, how much you
            process, and whether you want a person on the other end.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <Heading level={3}>Consider CDG if</Heading>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-ink-soft">
                {cdgFit.forList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <Heading level={3}>Look elsewhere if</Heading>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-small text-ink-soft">
                {cdgFit.notForList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section rule id="pricing">
        <Container width="article">
          <Heading level={2}>Pricing, taken from CDG&apos;s own pages</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Three plans, each tied to a monthly volume band. The bands are
            CDG&apos;s. Interchange and card-network fees are separate on every
            plan.
          </p>
          <CompareTable
            caption="CDG Commerce plans side by side"
            columns={cdgPlans.map((plan) => plan.name)}
            rows={planRows}
            className="mt-8"
          />
          <Heading level={3} className="mt-12">
            Interchange plus, the plan most readers land on
          </Heading>
          <p className="mt-2 text-small text-ink-soft">
            {interchangePlus.summary}
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {interchangePlus.rates.map((rate) => (
              <RateLockup
                key={rate.label}
                figure={rate.figure}
                label={rate.label}
                detail={rate.detail}
              />
            ))}
          </div>
          <SourceNote
            source={cdgSources.pricing}
            checked={CDG_CHECKED}
            note="CDG's quote page says flat rate has no fixed monthly fee; the flat rate page lists $9.95. We cite the flat rate page."
            className="mt-6"
          />
          <DecisionCard
            title="Want these rates on your own volume?"
            className="mt-10"
            actions={
              <>
                <CtaButton cta="quote" position="after_pricing" />
                <CtaButton
                  cta="exploreOnline"
                  position="after_pricing"
                  variant="secondary"
                />
              </>
            }
          >
            CDG answers a quote request with a rate sheet and a phone call.
            Business type and monthly volume are the two questions they ask.
          </DecisionCard>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Features</Heading>
          <FactRows rows={featureRows} className="mt-6" />
          <SourceNote source={cdgSources.about} checked={CDG_CHECKED} className="mt-4" />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Contract and fees</Heading>
          <p className="mt-4 text-body text-ink-soft">
            These are the fees you will not find on CDG&apos;s pricing pages.
            Ask for each one in writing before you sign.
          </p>
          <FactRows rows={feeRows} className="mt-6" />
          <SourceNote
            source={cdgThirdPartyFees.source}
            checked={CDG_CHECKED}
            note="CDG does not publish these; Merchant Maverick reports them."
            className="mt-4"
          />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Support</Heading>
          <p className="mt-4 text-body text-ink-soft">
            CDG describes its support as 24/7/365, U.S.-based, and in-house.
            You reach the same team whether the question is a declined batch or
            a gateway setting.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Approval takes about 1 to 3 business days by CDG&apos;s estimate.
            Underwriting may ask for documents before that clock starts, so
            have your bank details and recent statements ready.
          </p>
          <SourceNote source={cdgSources.about} checked={CDG_CHECKED} className="mt-4" />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <VerdictBox
            rating={cdgRating}
            bestFor={cdgBestFor}
            forList={[...cdgFit.forList]}
            notForList={[...cdgFit.notForList]}
            actions={
              <>
                <CtaButton cta="quote" position="verdict" />
                <CtaButton cta="apply" position="verdict" variant="secondary" />
              </>
            }
          />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Common questions</Heading>
          <dl className="mt-6 divide-y divide-rule border-b border-rule">
            {questions.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-small font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-small text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
          <SourceNote
            source={cdgSources.interchangePlus}
            checked={CDG_CHECKED}
            className="mt-4"
          />
        </Container>
      </Section>
    </>
  );
}
