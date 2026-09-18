import { InvoiceFakeDoorLink } from "@/components/InvoiceFakeDoorLink";
import { PostCard } from "@/components/PostCard";
import {
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  FactRows,
  Heading,
  RateLockup,
  Section,
  SourceNote,
} from "@/components/ui";
import {
  CDG_CHECKED,
  cdgBusinessTypes,
  cdgCompany,
  cdgPlan,
  cdgPlans,
  cdgSources,
} from "@/lib/cdg";
import { getFeaturedPosts } from "@/lib/posts";

const companyRows = [
  { label: "Founded", value: cdgCompany.founded },
  { label: "Better Business Bureau", value: cdgCompany.bbb },
  { label: "Sponsor banks", value: cdgCompany.sponsorBanks },
  { label: "Support", value: cdgCompany.support },
  { label: "Gateways", value: cdgCompany.gateways },
  { label: "Coverage", value: cdgCompany.usOnly },
];

const questions = [
  {
    q: "Is ClientBilling a payment processor?",
    a: "No. ClientBilling is an independent publisher. If you choose CDG Commerce, you apply and contract with CDG directly. ClientBilling may earn a commission when you apply through our links, and that does not change the pricing you get.",
  },
  {
    q: "Where do the numbers come from?",
    a: "Every rate on this site is copied from a CDG Commerce pricing page and dated. Fees CDG does not publish are attributed to the third party that reported them. Confirm current pricing with a quote before you sign anything.",
  },
  {
    q: "What happens after a quote request?",
    a: "CDG's form asks for your business type, name, email, and phone. A CDG representative calls you, asks about your monthly volume and how you take cards, and sends a rate sheet.",
  },
  {
    q: "Can I skip the call?",
    a: "Not with CDG. Rates are set per merchant after underwriting, so there is no price you can accept online without a conversation. If you want a self-serve account with no phone call, look elsewhere.",
  },
  {
    q: "Do I have to use CDG to use these guides?",
    a: "No. The guides explain interchange, markups, chargebacks, and billing in terms that apply to any processor. CDG is the one we cover in detail because we checked its published pricing and partner with it.",
  },
];

export default function HomePage() {
  const featured = getFeaturedPosts(3);
  const interchangePlus = cdgPlan("interchangePlus");

  return (
    <>
      <Section>
        <Container>
          <Heading level={1} className="max-w-prose-guide">
            Get paid better, and know what a merchant account costs before you
            sign
          </Heading>
          <p className="mt-6 max-w-prose-guide text-body text-ink-soft">
            ClientBilling explains merchant accounts, processing fees, and
            billing in plain words, then shows you the rates CDG Commerce
            publishes so you can decide with real numbers instead of a sales
            pitch.
          </p>
          <Disclosure className="mt-4" />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CtaButton cta="compare" position="hero" size="lg" />
            <CtaButton cta="quote" position="hero" variant="secondary" size="lg" />
          </div>
        </Container>
      </Section>

      <Section band="field" rule id="volume">
        <Container>
          <Heading level={2}>Start with your monthly volume</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            CDG publishes three plans and the monthly card volume each one is
            built for. Find your band, then read the rate you would pay on top
            of interchange or instead of it.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {cdgPlans.map((plan) => (
              <div key={plan.key}>
                <Heading level={3}>{plan.name}</Heading>
                <p className="mt-1 text-small text-muted">{plan.band}</p>
                <RateLockup
                  figure={plan.rates[0].figure}
                  label={plan.rates[0].label}
                  detail={plan.rates[0].detail}
                  size="md"
                  className="mt-6"
                />
                <p className="mt-4 text-small text-ink-soft">{plan.summary}</p>
                <Button href="/cdgcommerce#pricing" variant="quiet" className="mt-4">
                  See the full {plan.name} rate table
                </Button>
              </div>
            ))}
          </div>
          <SourceNote source={cdgSources.pricing} checked={CDG_CHECKED} className="mt-8" />
          <p className="mt-6 text-small text-ink-soft">
            Want a volume-based estimate against Stripe, Square, or PayPal public
            schedules?{" "}
            <Button href="/tools/fee-calculator" variant="quiet">
              Open the fee calculator
            </Button>
          </p>
          <div className="mt-10">
            <DecisionCard
              title="Create an invoice"
              actions={
                <>
                  <InvoiceFakeDoorLink href="/app/sign-up">
                    Create an invoice
                  </InvoiceFakeDoorLink>
                  <Button href="/tools/fee-calculator" variant="secondary">
                    Fee calculator
                  </Button>
                </>
              }
              note="Free invoice create and send. Collect online via CDG Quantum when you are ready."
            >
              Draft and send from ClientBilling, then collect online through
              CDG Commerce Quantum. No card data on our servers.
            </DecisionCard>
          </div>
        </Container>
      </Section>

      <Section rule id="business-type">
        <Container>
          <Heading level={2}>Which business are you?</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            CDG&apos;s quote form asks this question first, with these six
            labels. Pick yours to see what the form asks next and which plan
            usually applies.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {cdgBusinessTypes.map((type) => (
              <li key={type}>
                <Button href="/get-started" variant="secondary">
                  {type}
                </Button>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section band="field" rule id="interchange-plus">
        <Container>
          <Heading level={2}>Published interchange plus markups</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            On the Interchange Plus plan you pay the card networks&apos;
            interchange at cost, plus the markup below. Interchange is set by
            Visa, Mastercard, Discover, and American Express, not by CDG.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
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
            source={interchangePlus.source}
            checked={CDG_CHECKED}
            className="mt-8"
          />
          <DecisionCard
            title="Want these rates on your own volume?"
            className="mt-10"
            actions={
              <>
                <CtaButton cta="quote" position="after_pricing" />
                <CtaButton cta="fit" position="after_pricing" variant="secondary" />
              </>
            }
          >
            CDG answers a quote request with a rate sheet and a phone call.
            Business type and monthly volume are the two questions they ask.
          </DecisionCard>
        </Container>
      </Section>

      <Section rule id="why-cdg">
        <Container>
          <Heading level={2}>Why CDG</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            These are the facts CDG publishes about itself. We list them so you
            can check them, not so you take them on faith.
          </p>
          <FactRows rows={companyRows} columns={2} className="mt-8" />
          <SourceNote source={cdgSources.about} checked={CDG_CHECKED} className="mt-6" />
        </Container>
      </Section>

      <Section band="field" rule id="guides">
        <Container>
          <Heading level={2}>Featured guides</Heading>
          <p className="mt-4 max-w-prose-guide text-body text-ink-soft">
            Reviews and pricing explainers written to help you decide, with
            every number sourced.
          </p>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {featured.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
          <Button href="/blog" variant="quiet" className="mt-6">
            All guides
          </Button>
        </Container>
      </Section>

      <Section rule id="questions">
        <Container width="article">
          <Heading level={2}>Common questions</Heading>
          <dl className="mt-8 space-y-8">
            {questions.map((item) => (
              <div key={item.q}>
                <dt className="text-body font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-body text-ink-soft">{item.a}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <DecisionCard
            title="Ready for your own numbers?"
            headingLevel={2}
            actions={
              <>
                <CtaButton cta="quote" position="end" />
                <CtaButton cta="apply" position="end" variant="quiet" />
              </>
            }
          >
            A quote request takes a minute and ends in a phone call with a rate
            sheet. If you have already decided, you can go straight to the
            application instead.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
