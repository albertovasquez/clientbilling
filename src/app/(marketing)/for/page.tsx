import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  Button,
  Container,
  Heading,
  Kicker,
  Section,
} from "@/components/ui";
import { verticals } from "@/lib/verticals";

export const metadata: Metadata = {
  title: "Invoicing for your kind of business",
  description:
    "Free ClientBilling invoicing for contractors, agencies, consultants, and wholesale sellers, with published CDG Commerce rates when card volume fits.",
  alternates: { canonical: "/for" },
  openGraph: {
    title: "Invoicing for your kind of business | ClientBilling",
    description:
      "Vertical guides that pair free invoicing with published CDG Commerce rates. No new fees invented here.",
    url: "/for",
  },
  robots: { index: true, follow: true },
};

export default function ForIndexPage() {
  return (
    <Section>
      <Container width="article">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "For your business" }]} />
        <Kicker className="mt-8">Vertical kits</Kicker>
        <Heading level={1} className="mt-2">
          Invoicing for your kind of business
        </Heading>
        <p className="mt-4 text-body text-ink-soft">
          Each page pairs free ClientBilling invoices with the CDG Commerce plan band that already
          appears on our research pages. Rates come from CDG&apos;s published pricing. We do not invent
          fees.
        </p>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {verticals.map((kit) => (
            <li key={kit.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <Link
                  href={`/for/${kit.slug}`}
                  className="font-display text-display-sm font-semibold text-ink hover:text-carbon"
                >
                  {kit.navLabel}
                </Link>
                <p className="mt-1 text-small text-ink-soft">{kit.description}</p>
              </div>
              <Button href={`/for/${kit.slug}`} variant="secondary" size="md">
                Read the guide
              </Button>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
