import type { Metadata } from "next";
import {
  Breadcrumb,
  Container,
  Disclosure,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";
import { FeeCalculator } from "./FeeCalculator";

export const metadata: Metadata = {
  title: "Credit Card Processing Fee Calculator (Stripe, Square, PayPal)",
  description:
    "Estimate monthly credit card processing fees from volume and ticket size. Compare Stripe, Square, and PayPal public schedules to illustrative CDG Flat Rate or Interchange Plus math. Estimates only, not a quote.",
  keywords: [
    "credit card processing fee calculator",
    "Stripe fee calculator",
    "Square fee calculator",
    "PayPal fee calculator",
    "interchange plus calculator",
    "merchant account fee calculator",
  ],
  alternates: { canonical: "/tools/fee-calculator" },
  openGraph: {
    title: "Credit Card Processing Fee Calculator | ClientBilling",
    description:
      "Estimate Stripe, Square, or PayPal monthly processing cost, then see an illustrative CDG comparison. Not a quote.",
    url: "/tools/fee-calculator",
  },
  robots: { index: true, follow: true },
};

type PageProps = {
  searchParams?: Promise<{ processor?: string }>;
};

export default async function FeeCalculatorPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const processor = typeof params.processor === "string" ? params.processor : null;

  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Tools", href: "/tools/fee-calculator" },
              { label: "Fee calculator" },
            ]}
          />
          <Kicker className="mt-8">Updated September 18, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Credit card processing fee calculator
          </Heading>
          <p className="mt-4 text-body text-ink-soft">
            Estimate what you pay now on a published flat schedule (Stripe,
            Square, PayPal, or custom), then see an illustrative CDG Commerce
            comparison for your volume band. Every figure is an estimate. Nothing
            here is a quote, and we do not promise savings.
          </p>
          <Disclosure className="mt-4" />
        </Container>
      </Section>

      <Section band="field" rule id="calculator">
        <Container>
          <FeeCalculator initialProcessor={processor} />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>How to read the estimate</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            <li>
              Preset processor rates are copied from public fee pages and labeled
              ESTIMATE. Your statement can differ for international cards, keyed
              entry, plan upgrades, and add-ons.
            </li>
            <li>
              Under $10K a month, the CDG column uses published Flat Rate for the
              channel you picked.
            </li>
            <li>
              From $10K to $200K a month, the CDG column uses published Interchange
              Plus markup plus an interchange assumption you can change. That
              interchange is assumed, not quoted.
            </li>
            <li>
              At $200K+ a month, Wholesale Membership exists. We still show an
              Interchange Plus illustration and link to the pricing hub.
            </li>
            <li>
              If you already know your effective rate, turn on the override. That
              replaces preset math with volume times your rate.
            </li>
          </ul>
        </Container>
      </Section>
    </>
  );
}
