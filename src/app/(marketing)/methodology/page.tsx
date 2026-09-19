import type { Metadata } from "next";
import Link from "next/link";
import { Container, Disclosure, FactRows, Heading, Kicker, Section } from "@/components/ui";
import { author } from "@/lib/author";

export const metadata: Metadata = {
  title: "How we score payment processors",
  description:
    "How ClientBilling scores CDG Commerce and other processors: three sub-scores, the sources behind them, and how affiliate compensation is kept separate.",
  alternates: { canonical: "/methodology" },
};

const subscores = [
  {
    label: "Pricing transparency",
    value:
      "Does the provider publish its rates, monthly fees, and add-on fees, and do the numbers on different pages agree? 5 means every fee we looked for is published and consistent. 1 means quote-only pricing.",
  },
  {
    label: "Contract terms",
    value:
      "Month-to-month or a term? Early termination fee? Annual billing on any plan? Equipment lease or placement? 5 means month-to-month with no termination fee on every plan.",
  },
  {
    label: "Support",
    value:
      "Hours, channels, whether support is in-house, and what independent review sites report. We do not test support ourselves yet, so this sub-score leans on the provider's published commitments and third-party reviews, and we say so.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            How we score
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Every score on ClientBilling is a mean of three sub-scores, each
            from 1 to 5, rounded to one decimal. The sub-scores are set by{" "}
            <Link href={author.path} className="text-carbon underline-offset-4 hover:underline">
              {author.name}
            </Link>{" "}
            from published rate sheets, terms pages, and independent reviews,
            and we link the sources next to the numbers they support.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>The three sub-scores</Heading>
          <FactRows rows={subscores} className="mt-6" />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What we use as evidence</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>The provider&apos;s own pricing and terms pages, with the date we checked them.</li>
            <li>Third-party fee schedules and contract details when the provider does not publish them. We name the third party.</li>
            <li>Better Business Bureau accreditation and rating.</li>
            <li>Independent review sites for support and complaint patterns.</li>
          </ul>
          <p className="mt-4 text-body text-ink-soft">
            We do not invent statistics, and we do not aggregate other sites&apos;
            ratings into ours. When a provider&apos;s pages disagree with each
            other, we cite the more specific page and note the conflict.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Compensation and scores</Heading>
          <p className="mt-4 text-body text-ink-soft">
            ClientBilling earns a commission when a reader applies to CDG
            Commerce through our links. That relationship does not change the
            rates CDG charges and it does not change a score. Sub-scores are set
            from the evidence above before any commission is considered, and a
            provider we partner with can score below one we do not.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Scores are reviewed when a provider changes its pricing or terms,
            and at least once a year. The updated date at the top of each page
            shows the last substantive review.
          </p>
        </Container>
      </Section>
    </>
  );
}
