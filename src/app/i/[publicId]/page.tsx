import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardIntentButton } from "@/components/CardIntentButton";
import { PayLinkButton } from "@/components/PayLinkButton";
import { ViewBeacon } from "@/components/ViewBeacon";
import { Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { payerStatusLabel } from "@/lib/invoices/status";
import { bpsToPercentLabel, formatCents, lineTotalCents } from "@/lib/money";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ publicId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  return {
    title: `Invoice ${publicId}`,
    robots: { index: false, follow: false },
  };
}

/**
 * The payer's document (decision 0008): merchant first, plain status, payment
 * instructions, no affiliate links. Views are recorded by a client beacon, not on GET.
 */
export default async function PublicInvoicePage({ params }: Props) {
  if (!process.env.DATABASE_URL) {
    return (
      <main className="mx-auto max-w-article px-4 py-14">
        <Heading level={1}>Invoice unavailable</Heading>
        <p className="mt-4 text-body text-ink-soft">
          This invoice cannot be shown right now. Contact the sender directly.
        </p>
      </main>
    );
  }

  const { publicId } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { publicId },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      user: { include: { business: true } },
    },
  });
  if (!invoice || invoice.status === "void") notFound();

  const business = invoice.user.business;
  const merchantName = business?.name || "Your vendor";
  const statusLabel = payerStatusLabel(invoice.status, invoice.dueDate);
  const paid = invoice.status === "paid";
  const instructions = business?.paymentInstructions?.trim();
  const payLink = business?.payLinkUrl?.trim();
  const addressLine = [business?.city, business?.state, business?.postalCode].filter(Boolean).join(", ");

  return (
    <main className="mx-auto max-w-article px-4 py-10 sm:py-14 print:py-4">
      <ViewBeacon publicId={publicId} />

      <header className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-4">
          {business?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" className="h-12 w-12 rounded-lg object-contain" />
          ) : null}
          <div>
            <p className="font-display text-display-sm font-semibold text-ink">{merchantName}</p>
            {business?.email ? <p className="text-small text-ink-soft">{business.email}</p> : null}
            {business?.phone ? <p className="text-small text-ink-soft">{business.phone}</p> : null}
          </div>
        </div>
        <div className="text-right">
          <Heading level={1} size="md">
            Invoice #{invoice.number}
          </Heading>
          <p className={`mt-1 text-small font-semibold ${paid ? "text-action" : "text-ink-soft"}`}>
            {statusLabel}
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-6 border-t border-rule pt-6 sm:grid-cols-3">
        <div>
          <h2 className="text-caption font-semibold text-muted">From</h2>
          <p className="mt-1 text-small text-ink-soft">
            {merchantName}
            {business?.address1 ? (
              <>
                <br />
                {business.address1}
              </>
            ) : null}
            {business?.address2 ? (
              <>
                <br />
                {business.address2}
              </>
            ) : null}
            {addressLine ? (
              <>
                <br />
                {addressLine}
              </>
            ) : null}
          </p>
        </div>
        <div>
          <h2 className="text-caption font-semibold text-muted">Bill to</h2>
          <p className="mt-1 text-small text-ink-soft">
            {invoice.client.name}
            {invoice.client.company ? (
              <>
                <br />
                {invoice.client.company}
              </>
            ) : null}
            {invoice.client.email ? (
              <>
                <br />
                {invoice.client.email}
              </>
            ) : null}
          </p>
        </div>
        <dl className="text-small">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Issued</dt>
            <dd className="text-ink-soft">{invoice.issueDate.toISOString().slice(0, 10)}</dd>
          </div>
          <div className="mt-1 flex justify-between gap-4">
            <dt className="text-muted">Due</dt>
            <dd className="text-ink-soft">
              {invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : "On receipt"}
            </dd>
          </div>
          {paid && invoice.paidAt ? (
            <div className="mt-1 flex justify-between gap-4">
              <dt className="text-muted">Paid</dt>
              <dd className="text-ink-soft">{invoice.paidAt.toISOString().slice(0, 10)}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <table className="mt-8 w-full border-collapse text-small">
        <thead>
          <tr className="border-b border-rule-strong text-left">
            <th className="py-2 font-semibold">Description</th>
            <th className="py-2 text-right font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Price</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((line) => (
            <tr key={line.id} className="border-b border-rule">
              <td className="py-2 pr-4">{line.description}</td>
              <td className="py-2 text-right tabular-nums">{String(line.quantity)}</td>
              <td className="py-2 text-right tabular-nums">{formatCents(line.unitPriceCents)}</td>
              <td className="py-2 text-right tabular-nums">
                {formatCents(lineTotalCents(String(line.quantity), line.unitPriceCents))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="ml-auto mt-4 max-w-xs space-y-1 text-small">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="tabular-nums">{formatCents(invoice.subtotalCents)}</dd>
        </div>
        {invoice.taxRateBps > 0 ? (
          <div className="flex justify-between">
            <dt className="text-muted">Tax ({bpsToPercentLabel(invoice.taxRateBps)})</dt>
            <dd className="tabular-nums">{formatCents(invoice.taxCents)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-rule-strong pt-2 text-body font-semibold">
          <dt>{paid ? "Total paid" : "Total due"}</dt>
          <dd className="tabular-nums">{formatCents(invoice.totalCents, invoice.currency)}</dd>
        </div>
      </dl>

      {invoice.notes ? (
        <div className="mt-8">
          <h2 className="text-caption font-semibold text-muted">Notes</h2>
          <p className="mt-1 whitespace-pre-wrap text-small text-ink-soft">{invoice.notes}</p>
        </div>
      ) : null}

      {!paid ? (
        <section className="mt-10 rounded-2xl border border-rule bg-field p-6 print:border-0 print:bg-paper print:p-0">
          <h2 className="font-display text-display-sm font-semibold text-ink">How to pay</h2>
          {payLink ? <PayLinkButton href={payLink} merchantName={merchantName} /> : null}
          {instructions ? (
            <p className="mt-2 whitespace-pre-wrap text-small text-ink-soft">{instructions}</p>
          ) : (
            <p className="mt-2 text-small text-ink-soft">
              Contact {merchantName}
              {business?.email ? ` at ${business.email}` : ""} for payment options.
            </p>
          )}
          {!payLink ? <CardIntentButton publicId={publicId} merchantName={merchantName} /> : null}
        </section>
      ) : null}

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-4 text-caption text-muted print:hidden">
        <span>Print this page to save a PDF.</span>
        <span>
          Invoice software by{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-ink">
            {siteConfig.name}
          </Link>
          . Card data is never collected on this page.
        </span>
      </footer>
    </main>
  );
}
