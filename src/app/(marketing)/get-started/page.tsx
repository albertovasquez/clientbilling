import type { Metadata } from "next";
import {
  Badge,
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
import {
  CDG_CHECKED,
  cdgBusinessTypes,
  cdgFit,
  cdgPlans,
  cdgSources,
} from "@/lib/cdg";
import type { CtaKey } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Get a quote from CDG Commerce",
  description:
    "What CDG Commerce's quote form asks, which volume band you fall in, and what happens after you send it. Three steps, then a phone call from CDG.",
  alternates: { canonical: "/get-started" },
  openGraph: {
    title: "Get a quote from CDG Commerce | ClientBilling",
    description:
      "What CDG Commerce's quote form asks, which volume band you fall in, and what happens after you send it.",
    url: "/get-started",
  },
};

const channels: { title: string; body: string; cta: CtaKey }[] = [
  {
    title: "Online",
    body: "You take cards through a website, a checkout page, or an invoice link, with the Quantum or Authorize.Net gateway included.",
    cta: "exploreOnline",
  },
  {
    title: "In person",
    body: "You swipe, dip, or tap cards at a counter with a terminal or a point of sale system.",
    cta: "exploreRetail",
  },
  {
    title: "Mobile",
    body: "You take cards away from a fixed location with a phone or tablet and a card reader.",
    cta: "exploreMobile",
  },
];

export default function GetStartedPage() {
  const bandRows = cdgPlans.map((plan) => ({
    label: plan.band,
    value: `${plan.name}, ${plan.monthlyFee}`,
  }));

  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Get a quote from CDG Commerce
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            CDG&apos;s quote form asks four things: your business type, your
            name, your email, and your phone number. A CDG representative then
            calls you, asks about your monthly volume and how you take cards,
            and sends a rate sheet. The three steps below get you ready for
            that call.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule id="business-type">
        <Container width="article">
          <Kicker>Step 1</Kicker>
          <Heading level={2} className="mt-2">
            Pick your business type
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            CDG&apos;s form uses these exact labels, so pick the one that
            matches how you describe your business.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cdgBusinessTypes.map((type) => (
              <li key={type}>
                <Badge tone="neutral">{type}</Badge>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section rule id="volume-band">
        <Container width="article">
          <Kicker>Step 2</Kicker>
          <Heading level={2} className="mt-2">
            Find your volume band
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            CDG builds each plan around a monthly card volume. Know your band
            before the call so you can ask for the plan that matches it.
          </p>
          <FactRows rows={bandRows} className="mt-6" />
          <SourceNote source={cdgSources.pricing} checked={CDG_CHECKED} className="mt-6" />
        </Container>
      </Section>

      <Section band="field" rule id="channel">
        <Container>
          <Kicker>Step 3</Kicker>
          <Heading level={2} className="mt-2">
            Explore the channel you sell through
          </Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            CDG prices online, in-person, and mobile differently. Read the
            page for the way you take most of your cards.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {channels.map((channel) => (
              <div key={channel.title}>
                <Heading level={3}>{channel.title}</Heading>
                <p className="mt-2 text-small text-ink-soft">{channel.body}</p>
                <CtaButton
                  cta={channel.cta}
                  position="card"
                  variant="secondary"
                  className="mt-4"
                />
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <CtaButton cta="exploreRecurring" position="inline" variant="quiet" />
            <CtaButton cta="exploreB2b" position="inline" variant="quiet" />
          </div>
        </Container>
      </Section>

      <Section rule id="fit">
        <Container>
          <Heading level={2}>Is CDG a fit?</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            Check both lists before you send the form. A quote is free, but a
            phone call is not free of your time.
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

      <Section band="field" rule>
        <Container width="article">
          <DecisionCard
            title="Send the quote request"
            headingLevel={2}
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            You will hear from CDG by phone with a rate sheet for your business
            type and volume. If you have already decided, you can start the
            application instead.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
