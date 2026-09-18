import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";
import { author } from "@/lib/author";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About ClientBilling",
  description:
    "ClientBilling is an independent publication covering payments, merchant accounts, recurring billing, invoicing, and POS, with a disclosed CDG Commerce affiliate partnership.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ClientBilling",
    description:
      "Independent payments and billing guidance with a disclosed CDG Commerce affiliate relationship.",
    url: "/about",
  },
};

const link = "text-action underline-offset-4 hover:underline";

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>About</Kicker>
          <Heading level={1} className="mt-2">
            Who writes ClientBilling
          </Heading>
          <Disclosure className="mt-4" />
          <p className="mt-6 text-body text-ink-soft">
            {siteConfig.name} is written by one person, and every page says
            who that is and how the site makes money.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Who</Heading>
          <p className="mt-4 text-small font-semibold text-ink">{author.name}</p>
          <p className="text-caption text-muted">{author.role}</p>
          <p className="mt-4 text-body text-ink-soft">{author.bio}</p>
          <div className="mt-6">
            <Button href={author.path} variant="quiet">
              Read more about {author.name.split(" ")[0]}
            </Button>
          </div>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What we cover</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Merchant accounts, processing fees, recurring billing, invoicing,
            and point of sale, written for U.S. businesses. You get published
            rates compared at stated volumes, plain explanations of how a fee
            is built, and a clear note on who a provider does not fit.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>How we make money</Heading>
          <p className="mt-4 text-body text-ink-soft">
            ClientBilling is an affiliate of {siteConfig.partnerName}. If you
            apply through one of our links, CDG may pay us a commission. We say
            so on every page, directly under the title. The commission does not
            change the pricing you are offered, and you contract with CDG, not
            with us. The full terms are on the{" "}
            <Link href="/affiliate-disclosure" className={link}>
              affiliate disclosure
            </Link>{" "}
            page.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>How we score</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Each review carries one editorial score built from three sub-scores:
            pricing transparency, contract terms, and support. The score is ours
            alone, and the{" "}
            <Link href="/methodology" className={link}>
              methodology
            </Link>{" "}
            page explains how each sub-score is set.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>How to reach us</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Corrections and questions are welcome, and a contact address will be
            published here as soon as one is set up.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <DecisionCard
            title="Ready to look at the numbers?"
            actions={
              <>
                <CtaButton cta="compare" position="end" />
                <CtaButton cta="quote" position="end" variant="secondary" />
              </>
            }
          >
            The CDG Commerce review sets out the published rates at the volumes
            most readers process. A quote request ends in a phone call from CDG.
          </DecisionCard>
        </Container>
      </Section>
    </>
  );
}
