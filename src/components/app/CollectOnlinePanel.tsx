import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { Button, buttonClass, Heading } from "@/components/ui";
import { siteConfig } from "@/lib/site";

type Props = {
  quantumConnected: boolean;
  quantumMerchantLabel?: string | null;
  invoiceTotalLabel: string;
};

/**
 * Collect online never asks for card data on ClientBilling.
 * No MID: CDG apply CTA. Connected: hosted pay placeholder / settings.
 */
export function CollectOnlinePanel({
  quantumConnected,
  quantumMerchantLabel,
  invoiceTotalLabel,
}: Props) {
  return (
    <section className="rounded-2xl border border-action/30 bg-action-tint p-6">
      <Heading level={2}>Collect online</Heading>
      <p className="mt-2 text-small text-ink-soft">
        Total due: {invoiceTotalLabel}. Card collection runs on CDG Commerce
        Quantum. ClientBilling never stores card numbers and is not the merchant
        of record. Unpaid invoices still work without payments connected.
      </p>

      {!quantumConnected ? (
        <div className="mt-5 space-y-3">
          <TrackedAffiliateLink
            href={siteConfig.affiliateSignupUrl}
            ctaPosition="card"
            ctaText="Start a CDG application"
            ctaType="apply"
            className={buttonClass("primary", "md")}
          >
            Start a CDG application
          </TrackedAffiliateLink>
          <div>
            <TrackedAffiliateLink
              href={siteConfig.quoteUrl}
              ctaPosition="card"
              ctaText="Get a free quote from CDG"
              ctaType="quote"
              className={buttonClass("secondary", "md")}
            >
              Get a free quote from CDG
            </TrackedAffiliateLink>
          </div>
          <p className="text-small text-ink-soft">
            Already approved for Quantum?{" "}
            <Button href="/app/settings/payments" variant="quiet">
              Connect existing Quantum
            </Button>
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          <p className="text-small text-ink">
            Connected as {quantumMerchantLabel || "Quantum merchant"}. Hosted pay
            checkout from invoices is coming soon (Quantum hosted payment URL).
            Until then, share the public invoice link and collect outside this
            panel, or mark paid manually after settlement.
          </p>
          <Button href="/app/settings/payments" variant="secondary">
            Manage Quantum connection
          </Button>
        </div>
      )}
    </section>
  );
}
