import type { Metadata } from "next";
import Link from "next/link";
import { Container, FactRows, Heading, Kicker, Section } from "@/components/ui";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How ClientBilling handles server logs, analytics, cookies, and affiliate links.",
  alternates: { canonical: "/privacy" },
};

const link = "text-action underline-offset-4 hover:underline";

export default function PrivacyPage() {
  return (
    <>
      <Section>
        <Container width="article">
          <Kicker>Updated September 17, 2026</Kicker>
          <Heading level={1} className="mt-2">
            Privacy
          </Heading>
          <p className="mt-6 text-body text-ink-soft">
            {siteConfig.name} ({siteConfig.domain}) is an editorial site about
            merchant accounts and billing. It collects very little about you,
            and this page says exactly what. It is a starting policy, and we
            will have counsel review it before the site collects personal data
            at any scale.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>What we collect</Heading>
          <FactRows
            className="mt-6"
            rows={[
              {
                label: "Server logs",
                value:
                  "Our hosting provider records the standard request log: IP address, user agent, and the path you requested.",
              },
              {
                label: "Analytics",
                value:
                  "None today. If we enable page view and referrer measurement later, we will update this page when that happens.",
              },
              {
                label: "Email",
                value:
                  "Whatever you choose to send us if you contact us directly.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>What we do not do</Heading>
          <FactRows
            className="mt-6"
            rows={[
              {
                label: "Accounts",
                value: "No user accounts or sign-in on this site.",
              },
              {
                label: "Billing data",
                value:
                  "No customer billing database. Your merchant application goes to CDG Commerce, not to us.",
              },
              {
                label: "Selling data",
                value: "We do not sell personal information.",
              },
            ]}
          />
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Cookies</Heading>
          <p className="mt-4 text-body text-ink-soft">
            The site sets no first-party marketing cookies. Hosting and
            security tooling may set strictly necessary cookies, and any future
            analytics tool may set measurement cookies. We will list them here
            when they are introduced.
          </p>
        </Container>
      </Section>

      <Section rule>
        <Container width="article">
          <Heading level={2}>Affiliate links</Heading>
          <p className="mt-4 text-body text-ink-soft">
            Outbound links to CDG Commerce carry parameters that tell CDG the
            application came from ClientBilling. CDG controls what it records
            on its own pages. The{" "}
            <Link href="/affiliate-disclosure" className={link}>
              affiliate disclosure
            </Link>{" "}
            explains how that relationship works and what it does not change.
          </p>
        </Container>
      </Section>

      <Section band="field" rule>
        <Container width="article">
          <Heading level={2}>Contact</Heading>
          <p className="mt-4 text-body text-ink-soft">
            For privacy questions about {siteConfig.domain}, contact the site
            operator through the address we will publish on the{" "}
            <Link href="/about" className={link}>
              about
            </Link>{" "}
            page once one is set up. This policy will be replaced with a full
            one as the site grows.
          </p>
        </Container>
      </Section>
    </>
  );
}
