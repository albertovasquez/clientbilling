import Link from "next/link";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { Heading } from "@/components/ui";
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
    <Card>
      <CardHeader>
        <CardTitle>
          <Heading level={2}>Getting paid</Heading>
        </CardTitle>
        <CardDescription>
          Total due: {invoiceTotalLabel}. Your client sees the payment instructions from
          your business profile on the invoice.{" "}
          {hasPaymentInstructions ? (
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/app/settings">Edit payment instructions</Link>
            </Button>
          ) : (
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/app/settings">Add payment instructions</Link>
            </Button>
          )}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <h3 className="text-small font-semibold text-ink">Online payment</h3>
        <p className="mt-1 text-small text-ink-soft">
          {hasPayLink
            ? "Payers see a Pay online button that opens your payment page. Mark the invoice paid when the money arrives."
            : "Add a hosted payment page link in Business settings and unpaid invoices get a Pay online button. A CDG Commerce merchant account includes one."}{" "}
          <Button asChild variant="link" className="h-auto p-0">
            <Link href="/app/settings/payments">{hasPayLink ? "Manage pay link" : "Set up online payment"}</Link>
          </Button>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild>
            <TrackedAffiliateLink
              href={siteConfig.quoteUrl}
              ctaPosition="card"
              ctaText="Get a free quote from CDG"
              ctaType="quote"
            >
              Get a free quote from CDG
            </TrackedAffiliateLink>
          </Button>
          <Button asChild variant="outline">
            <TrackedAffiliateLink
              href={siteConfig.affiliateSignupUrl}
              ctaPosition="card"
              ctaText="Start a CDG application"
              ctaType="apply"
            >
              Start a CDG application
            </TrackedAffiliateLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
