import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { buttonClass, Heading } from "@/components/ui";
import { flags } from "@/lib/flags";
import { getBusinessForUser, requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Getting paid" };

export default async function PaymentsSettingsPage() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  const instructions = business?.paymentInstructions?.trim();

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1}>Getting paid</Heading>
        <p className="mt-2 max-w-prose-guide text-body text-ink-soft">
          ClientBilling is invoice software. Payments are settled between you and
          your client. We never store cardholder data and we are not the merchant
          of record.
        </p>
      </div>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Payment instructions on your invoices</Heading>
        {instructions ? (
          <p className="mt-2 whitespace-pre-wrap text-small text-ink-soft">{instructions}</p>
        ) : (
          <p className="mt-2 text-small text-ink-soft">
            None yet. Payers currently see a line asking them to contact you for
            payment options.
          </p>
        )}
        <Link href="/app/settings" className={`${buttonClass("secondary", "md")} mt-4`}>
          {instructions ? "Edit instructions" : "Add instructions"}
        </Link>
      </section>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>
          {flags.collectOnline ? "Online card payment" : "Online card payment (planned)"}
        </Heading>
        <p className="mt-2 text-small text-ink-soft">
          Card payment from the invoice page is planned to run on a CDG Commerce
          merchant account. It is not available yet. If you want a merchant
          account in place for that day, request a quote or start an application
          with CDG now. ClientBilling may earn a commission if you apply through
          these links; it does not change your pricing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedAffiliateLink
            href={siteConfig.quoteUrl}
            ctaPosition="card"
            ctaText="Get a free quote from CDG"
            ctaType="quote"
            className={buttonClass("primary", "md")}
          >
            Get a free quote from CDG
          </TrackedAffiliateLink>
          <TrackedAffiliateLink
            href={siteConfig.affiliateSignupUrl}
            ctaPosition="card"
            ctaText="Start a CDG application"
            ctaType="apply"
            className={buttonClass("secondary", "md")}
          >
            Start a CDG application
          </TrackedAffiliateLink>
        </div>
      </section>
    </div>
  );
}
