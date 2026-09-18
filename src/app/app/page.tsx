import Link from "next/link";
import { buttonClass, Heading } from "@/components/ui";
import { merchantStatusLabel } from "@/lib/invoices/status";
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
  const now = new Date();
  const since = new Date(now.getTime() - 30 * 86_400_000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const cardIntents = await prisma.event.count({
    where: { name: "payer_card_intent", userId: user.id, createdAt: { gte: since } },
  });
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const [open, overdue, paidThisMonth] = await Promise.all([
    prisma.invoice.aggregate({ where: { userId: user.id, status: { in: ["sent", "viewed", "overdue"] } }, _sum: { totalCents: true }, _count: true }),
    prisma.invoice.aggregate({ where: { userId: user.id, status: "overdue" }, _sum: { totalCents: true }, _count: true }),
    prisma.invoice.aggregate({ where: { userId: user.id, status: "paid", paidAt: { gte: monthStart } }, _sum: { totalCents: true }, _count: true }),
  ]);

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

      {invoices.length > 0 ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-rule bg-paper p-4">
            <dt className="text-caption text-muted">Outstanding</dt>
            <dd className="mt-1 font-display text-display-sm font-semibold tabular-nums text-ink">{formatCents(open._sum.totalCents ?? 0)}</dd>
            <dd className="text-caption text-muted">{open._count} open</dd>
          </div>
          <div className="rounded-2xl border border-rule bg-paper p-4">
            <dt className="text-caption text-muted">Overdue</dt>
            <dd className={`mt-1 font-display text-display-sm font-semibold tabular-nums ${overdue._count > 0 ? "text-verdict" : "text-ink"}`}>{formatCents(overdue._sum.totalCents ?? 0)}</dd>
            <dd className="text-caption text-muted">{overdue._count} past due</dd>
          </div>
          <div className="rounded-2xl border border-rule bg-paper p-4">
            <dt className="text-caption text-muted">Paid this month</dt>
            <dd className="mt-1 font-display text-display-sm font-semibold tabular-nums text-action">{formatCents(paidThisMonth._sum.totalCents ?? 0)}</dd>
            <dd className="text-caption text-muted">{paidThisMonth._count} paid</dd>
          </div>
        </dl>
      ) : null}

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
                    <span className={invoice.status === "overdue" ? "font-semibold text-verdict" : ""}>{merchantStatusLabel(invoice.status)}</span> · {formatCents(invoice.totalCents, invoice.currency)}{invoice.dueDate ? ` · due ${invoice.dueDate.toISOString().slice(0, 10)}` : ""}
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
