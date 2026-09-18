import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { Button, buttonClass, Heading } from "@/components/ui";
import { flags } from "@/lib/flags";
import { siteConfig } from "@/lib/site";

type Props = {
  hasPaymentInstructions: boolean;
  invoiceTotalLabel: string;
};

/**
 * Merchant-facing collect panel (decision 0002). Until CDG confirms the
 * integration, this offers the CDG application and quote, and points to the
 * payment instructions that payers see today. No card data ever touches ClientBilling.
 */
export function CollectOnlinePanel({ hasPaymentInstructions, invoiceTotalLabel }: Props) {
  return (
    <section className="rounded-2xl border border-action/30 bg-action-tint p-6">
      <Heading level={2}>Getting paid</Heading>
      <p className="mt-2 text-small text-ink-soft">
        Total due: {invoiceTotalLabel}. Your client sees the payment instructions from
        your business profile on the invoice.{" "}
        {hasPaymentInstructions ? (
          <Button href="/app/settings" variant="quiet">
            Edit payment instructions
          </Button>
        ) : (
          <Button href="/app/settings" variant="quiet">
            Add payment instructions
          </Button>
        )}
      </p>

      <div className="mt-5 border-t border-action/20 pt-5">
        <h3 className="text-small font-semibold text-ink">
          {flags.collectOnline ? "Online card payment" : "Online card payment (planned)"}
        </h3>
        <p className="mt-1 text-small text-ink-soft">
          Card payment from the invoice page is planned to run on a CDG Commerce
          merchant account. ClientBilling will never store card numbers and is not
          the merchant of record. If you want a merchant account ready for that day,
          start with CDG now.
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
      </div>
    </section>
  );
}
