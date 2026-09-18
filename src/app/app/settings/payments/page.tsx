import Link from "next/link";
import { CollectRequestForm } from "@/components/app/CollectRequestForm";
import { buttonClass, Heading } from "@/components/ui";
import { cdgBusinessTypes, cdgPlans } from "@/lib/cdg";
import { getBusinessForUser, requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Getting paid" };

export default async function PaymentsSettingsPage() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  const instructions = business?.paymentInstructions?.trim();
  const payLink = business?.payLinkUrl?.trim();

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
        <Heading level={2}>Online payment link</Heading>
        {payLink ? (
          <p className="mt-2 break-all text-small text-ink-soft">
            Payers see a Pay online button that opens {payLink}. Mark invoices paid once the money arrives.
          </p>
        ) : (
          <p className="mt-2 text-small text-ink-soft">
            None yet. If you have a hosted payment page, for example from a CDG Commerce Quantum
            account or another pay link you already use, add it and unpaid invoices get a Pay online
            button. Card details are entered on that page, never on ClientBilling.
          </p>
        )}
        <Link href="/app/settings" className={`${buttonClass("secondary", "md")} mt-4`}>
          {payLink ? "Edit pay link" : "Add a pay link"}
        </Link>
      </section>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Need a merchant account?</Heading>
        <p className="mt-2 text-small text-ink-soft">
          A CDG Commerce merchant account comes with a Quantum gateway and a hosted payment page you
          can paste above. Interchange-plus pricing pays off above about $10,000 a month of card
          volume. Tell us two things and a person will walk you through it, or go straight to CDG.
        </p>
        <CollectRequestForm
          businessTypes={cdgBusinessTypes}
          volumeBands={cdgPlans.map((p) => p.bandShort)}
          quoteUrl={siteConfig.quoteUrl}
          applyUrl={siteConfig.affiliateSignupUrl}
        />
      </section>
    </div>
  );
}
