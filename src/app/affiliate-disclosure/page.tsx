import type { Metadata } from "next";
import Link from "next/link";
import { Button, Container, Heading, Kicker, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How ClientBilling uses CDG Commerce affiliate links and commissions, in plain language.",
  alternates: { canonical: "/affiliate-disclosure" },
};

const link = "text-action underline-offset-4 hover:underline";

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Affiliate disclosure
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            You deserve a plain account of how this site is funded. Here it is.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>The relationship</Heading>
          <p className="mt-4 text-body text-ink-soft">
            {siteConfig.name} is an independent affiliate of{" "}
            {siteConfig.partnerName}. When you apply for a merchant account
            through one of our links, CDG may pay us a commission. CDG does not
            write, review, or approve what we publish, and we do not publish
            the commission terms because CDG sets them. You contract with CDG
            directly; ClientBilling is never a party to that agreement.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What it does not change</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Your pricing. CDG quotes you the same rates whether you arrive
            through our link or type the address yourself.
          </p>
          <p className="mt-4 text-body text-ink-soft">
            Our scores. Every review carries an editorial score that is ours
            alone, and the{" "}
            <Link href="/methodology" className={link}>
              methodology
            </Link>{" "}
            page explains how it is set. Where CDG is not a fit, we say so.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>How links are marked</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Every outbound affiliate link carries{" "}
            <code className="text-small text-ink">rel=&quot;sponsored&quot;</code>
            , so search engines and browsers can tell it apart from an
            editorial link. Every page shows a one-sentence disclosure directly
            under its title.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Why we disclose</Heading>
          <p className="mt-4 text-body text-ink-soft">
            The Federal Trade Commission requires that a material connection
            between a publisher and a company it links to be disclosed clearly
            and close to the link, and this page and the sentence under every
            title are how we meet that.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>How to contact us</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Questions about this relationship are welcome, and a contact
            address will be published on the{" "}
            <Link href="/about" className={link}>
              about
            </Link>{" "}
            page as soon as one is set up. Our{" "}
            <Link href="/privacy" className={link}>
              privacy
            </Link>{" "}
            page covers what the site collects.
          </p>
          <div className="mt-6">
            <Button href="/cdgcommerce" variant="quiet">
              Read the CDG Commerce review
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
