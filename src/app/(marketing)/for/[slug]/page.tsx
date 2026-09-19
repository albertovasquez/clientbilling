import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Breadcrumb,
  Button,
  Container,
  CtaButton,
  DecisionCard,
  Disclosure,
  FactRows,
  Heading,
  Kicker,
  ProsCons,
  RateLockup,
  Section,
  SourceNote,
} from "@/components/ui";
import { getVertical, ratesForVertical, verticalSlugs, verticals } from "@/lib/verticals";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return verticalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kit = getVertical(slug);
  if (!kit) return {};
  return {
    title: kit.title,
    description: kit.description,
    alternates: { canonical: `/for/${kit.slug}` },
    openGraph: {
      title: `${kit.title} | ClientBilling`,
      description: kit.description,
      url: `/for/${kit.slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function VerticalKitPage({ params }: Props) {
  const { slug } = await params;
  const kit = getVertical(slug);
  if (!kit) notFound();

  const { plan, checked, source } = ratesForVertical(kit);
  const other = verticals.filter((v) => v.slug !== kit.slug);

  return (
    <>
      <Section>
        <Container width="article">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "For your business", href: "/for" },
              { label: kit.navLabel },
            ]}
          />
          <Kicker className="mt-8">{kit.kicker}</Kicker>
          <Heading level={1} className="mt-2">
            {kit.title}
          </Heading>
          <p className="mt-4 text-body text-ink-soft">{kit.audience}</p>
          <Disclosure className="mt-4" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/app/sign-up" size="lg">
              Create a free invoice account
            </Button>
            <CtaButton cta="quote" position="hero" variant="secondary" />
          </div>
        </Container>
      </Section>

      <Section band="field">
        <Container width="article">
          <Heading level={2}>What the invoice tool covers</Heading>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-ink-soft">
            {kit.invoiceFit.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-6 text-small text-ink-soft">
            Unpaid invoices always work. Card fields never appear on ClientBilling.{" "}
            <Link href="/invoices" className="font-semibold text-action underline-offset-4 hover:underline">
              See how invoicing works
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section>
        <Container width="article">
          <Heading level={2}>{plan.name} rates CDG publishes</Heading>
          <p className="mt-4 text-body text-ink-soft">
            {plan.summary} Band: {plan.band}. Monthly fee: {plan.monthlyFee}.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {plan.rates.map((rate) => (
              <RateLockup key={rate.label} figure={rate.figure} label={rate.label} detail={rate.detail} />
            ))}
          </div>
          <SourceNote source={source} checked={checked} className="mt-6" />
          <FactRows
            className="mt-8"
            rows={plan.notes.map((note) => ({ label: "Note", value: note }))}
          />
        </Container>
      </Section>

      <Section band="field">
        <Container width="article">
          <Heading level={2}>When this path fits</Heading>
          <ProsCons className="mt-6" pros={kit.processingFit} cons={kit.notFit} />
          <p className="mt-6 text-small text-ink-soft">
            More on the channel page:{" "}
            <Link href={kit.channelHref} className="font-semibold text-action underline-offset-4 hover:underline">
              {kit.channelLabel}
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section>
        <Container width="article">
          <DecisionCard
            title="Send invoices today. Get a CDG quote when card volume justifies it."
            actions={
              <>
                <CtaButton cta="quote" position="verdict" />
                <CtaButton cta={kit.exploreCta} position="verdict" variant="secondary" />
              </>
            }
            note={
              <Link href="/app/sign-up" className="font-semibold text-action underline-offset-4 hover:underline">
                Or create a free invoice account
              </Link>
            }
          >
            ClientBilling stays free for invoicing. CDG Commerce underwrites and settles cards on your
            own merchant account. We never store card data.
          </DecisionCard>
        </Container>
      </Section>

      <Section band="field">
        <Container width="article">
          <Heading level={2}>Other businesses</Heading>
          <ul className="mt-4 flex flex-wrap gap-3">
            {other.map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/for/${v.slug}`}
                  className="text-small font-semibold text-action underline-offset-4 hover:underline"
                >
                  {v.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
