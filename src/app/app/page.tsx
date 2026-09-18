import Link from "next/link";
import { buttonClass, Heading } from "@/components/ui";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";

export const metadata = { title: "Your invoices" };

export default async function AppHomePage() {
  const user = await requireUser();
  const business = await prisma.businessProfile.findUnique({
    where: { userId: user.id },
    select: { paymentInstructions: true, payLinkUrl: true },
  });
  // Server component; reading the clock here is intentional.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 86_400_000);
  const cardIntents = await prisma.event.count({
    where: { name: "payer_card_intent", userId: user.id, createdAt: { gte: since } },
  });
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading level={1}>Invoices</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Draft, send, and track. Payers see your payment instructions on every invoice.
          </p>
        </div>
        <Link href="/app/invoices/new" className={buttonClass("primary", "md")}>
          New invoice
        </Link>
      </div>

      {!business?.paymentInstructions?.trim() ? (
        <p className="mt-6 rounded-lg border border-verdict-rule bg-verdict-tint px-4 py-3 text-small text-ink-soft">
          Payers currently see &quot;contact us for payment options&quot;.{" "}
          <Link href="/app/settings" className="font-semibold text-action underline-offset-4 hover:underline">
            Add payment instructions
          </Link>{" "}
          so they know how to pay you.
        </p>
      ) : null}

      {cardIntents > 0 && !business?.payLinkUrl ? (
        <div className="mt-6 rounded-2xl border border-action/30 bg-action-tint p-5">
          <p className="text-small font-semibold text-ink">
            {cardIntents === 1 ? "A client asked" : `${cardIntents} clients asked`} to pay by card in the last 30 days.
          </p>
          <p className="mt-1 text-small text-ink-soft">
            Add a hosted payment page link in Business settings and they can pay online. A CDG Commerce merchant account includes one.
          </p>
          <div className="mt-3">
            <TrackedAffiliateLink
              href={siteConfig.quoteUrl}
              ctaPosition="card"
              ctaText="Get a free quote from CDG"
              ctaType="quote"
              className={buttonClass("primary", "md")}
            >
              Get a free quote from CDG
            </TrackedAffiliateLink>
          </div>
        </div>
      ) : null}

      {invoices.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-rule bg-paper p-8">
          <Heading level={2}>No invoices yet</Heading>
          <p className="mt-2 text-small text-ink-soft">
            You can add the client while creating the invoice, then email or copy
            the public link.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/app/invoices/new" className={buttonClass("primary", "md")}>
              Create an invoice
            </Link>
            <Link href="/app/clients" className={buttonClass("secondary", "md")}>
              Manage clients
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link
                href={`/app/invoices/${invoice.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-field sm:px-6"
              >
                <div>
                  <p className="text-small font-semibold text-ink">
                    Invoice #{invoice.number} · {invoice.client.name}
                  </p>
                  <p className="text-caption text-muted">
                    {invoice.status} · {formatCents(invoice.totalCents, invoice.currency)}
                  </p>
                </div>
                <span className="text-small text-action">Open</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
