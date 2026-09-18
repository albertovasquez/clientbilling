import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { Button, buttonClass, Heading } from "@/components/ui";
import { siteConfig } from "@/lib/site";

type Props = {
  hasPaymentInstructions: boolean;
  hasPayLink: boolean;
  invoiceTotalLabel: string;
};

/**
 * Merchant-facing collect panel (decision 0002). Until CDG confirms the
 * integration, this offers the CDG application and quote, and points to the
 * payment instructions that payers see today. No card data ever touches ClientBilling.
 */
export function CollectOnlinePanel({ hasPaymentInstructions, hasPayLink, invoiceTotalLabel }: Props) {
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
        <h3 className="text-small font-semibold text-ink">Online payment</h3>
        <p className="mt-1 text-small text-ink-soft">
          {hasPayLink
            ? "Payers see a Pay online button that opens your payment page. Mark the invoice paid when the money arrives."
            : "Add a hosted payment page link in Business settings and unpaid invoices get a Pay online button. A CDG Commerce merchant account includes one."}{" "}
          <Button href="/app/settings/payments" variant="quiet">
            {hasPayLink ? "Manage pay link" : "Set up online payment"}
          </Button>
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
