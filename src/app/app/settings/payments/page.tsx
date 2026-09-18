import { disconnectQuantumAction } from "@/app/app/actions";
import { QuantumConnectForm } from "@/components/app/QuantumConnectForm";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { buttonClass, Heading } from "@/components/ui";
import { getBusinessForUser, requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Collect online" };

export default async function PaymentsSettingsPage() {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1}>Collect online</Heading>
        <p className="mt-2 max-w-prose-guide text-body text-ink-soft">
          ClientBilling is the invoice UX. CDG Commerce Quantum is Pay and
          settlement only. We never store cardholder data and we are not the
          merchant of record.
        </p>
      </div>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>No merchant account yet?</Heading>
        <p className="mt-2 text-small text-ink-soft">
          Start a CDG application (agent 470) or request a quote. After approval
          you can connect Quantum here.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <TrackedAffiliateLink
            href={siteConfig.affiliateSignupUrl}
            ctaPosition="card"
            ctaText="Start a CDG application"
            ctaType="apply"
            className={buttonClass("primary", "md")}
          >
            Start a CDG application
          </TrackedAffiliateLink>
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
      </section>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>I already have Quantum</Heading>
        {business?.quantumConnected ? (
          <div className="mt-3 space-y-3">
            <p className="text-small text-ink">
              Connected: {business.quantumMerchantLabel || "Quantum merchant"}
              {business.quantumGwLoginRef
                ? ` (ref ${business.quantumGwLoginRef})`
                : ""}
            </p>
            <p className="text-small text-ink-soft">
              Hosted pay buttons on public invoices are a stub until CDG confirms
              the preferred Quantum checkout method. You can still share invoice
              links and mark paid manually.
            </p>
            <form action={disconnectQuantumAction}>
              <button type="submit" className={buttonClass("quiet", "md")}>
                Disconnect
              </button>
            </form>
          </div>
        ) : (
          <>
            <p className="mt-2 text-small text-ink-soft">
              Save a non-secret label for your Quantum merchant. Do not paste
              passwords or RestrictKeys.
            </p>
            <QuantumConnectForm />
          </>
        )}
      </section>
    </div>
  );
}
