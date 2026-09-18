import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/app/CopyLinkButton";
import { InvoiceEditor } from "@/components/app/InvoiceEditor";
import { InvoiceStatusActions } from "@/components/app/StatusForm";
import { CollectOnlinePanel } from "@/components/app/CollectOnlinePanel";
import { RemindButton } from "@/components/app/RemindButton";
import { SendInvoiceForm } from "@/components/app/SendInvoiceForm";
import { buttonClass, Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { merchantStatusLabel, openStatuses } from "@/lib/invoices/status";
import { bpsToPercentLabel, formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export const metadata = { title: "Invoice" };

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

export default async function InvoiceDetailPage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: user.id },
    include: {
      client: true,
      lineItems: { orderBy: { sortOrder: "asc" } },
      events: { orderBy: { createdAt: "desc" }, take: 25 },
    },
  });
  if (!invoice) notFound();

  const business = await prisma.businessProfile.findUnique({
    where: { userId: user.id },
  });
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const cardIntent = invoice.events.find((e) => e.type === "card_intent");
  const lastReminder = invoice.events.find((e) => e.type === "reminder_sent");
  const canRemind = openStatuses.includes(invoice.status);
  const publicUrl = `${siteConfig.url}/i/${invoice.publicId}`;
  const editable = invoice.status !== "paid" && invoice.status !== "void";

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Heading level={1}>Invoice #{invoice.number}</Heading>
          <p className="mt-2 text-small text-ink-soft">
            {invoice.client.name} · {merchantStatusLabel(invoice.status)} ·{" "}
            {formatCents(invoice.totalCents, invoice.currency)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/i/${invoice.publicId}`}
            className={buttonClass("secondary", "md")}
            target="_blank"
          >
            Public view
          </Link>
          <CopyLinkButton url={publicUrl} />
          <a href={`/api/invoices/${invoice.id}/pdf`} className={buttonClass("secondary", "md")}>
            Download PDF
          </a>
        </div>
      </div>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Status</Heading>
        {cardIntent ? (
          <p className="mt-2 text-small text-ink">
            A client asked to pay this invoice by card on {cardIntent.createdAt.toISOString().slice(0, 10)}.
          </p>
        ) : null}
        {query.error === "transition" ? (
          <p className="mt-2 text-small text-verdict" role="alert">
            That status change is not allowed from the invoice&apos;s current state.
          </p>
        ) : null}
        <div className="mt-4">
          <InvoiceStatusActions invoiceId={invoice.id} status={invoice.status} />
        </div>
        {canRemind ? (
          <div className="mt-6 border-t border-rule pt-4">
            <RemindButton
              invoiceId={invoice.id}
              clientEmail={invoice.client.email}
              lastRemindedAt={lastReminder ? lastReminder.createdAt.toISOString().slice(0, 10) : null}
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Share</Heading>
        <p className="mt-2 text-small text-ink-soft break-all">{publicUrl}</p>
        <div className="mt-4">
          <SendInvoiceForm
            invoiceId={invoice.id}
            clientId={invoice.clientId}
            clientEmail={invoice.client.email}
          />
        </div>
      </section>

      <CollectOnlinePanel
        hasPaymentInstructions={Boolean(business?.paymentInstructions?.trim())}
        hasPayLink={Boolean(business?.payLinkUrl?.trim())}
        invoiceTotalLabel={formatCents(invoice.totalCents, invoice.currency)}
      />

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Line items</Heading>
        <ul className="mt-4 divide-y divide-rule">
          {invoice.lineItems.map((line) => (
            <li key={line.id} className="flex justify-between gap-4 py-3 text-small">
              <span className="text-ink">
                {line.description}{" "}
                <span className="text-muted">
                  × {String(line.quantity)} @ {formatCents(line.unitPriceCents)}
                </span>
              </span>
              <span className="font-semibold text-ink">
                {formatCents(Math.round(Number(line.quantity) * line.unitPriceCents))}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 text-small">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatCents(invoice.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tax ({bpsToPercentLabel(invoice.taxRateBps)})</dt>
            <dd>{formatCents(invoice.taxCents)}</dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt>Total</dt>
            <dd>{formatCents(invoice.totalCents)}</dd>
          </div>
        </dl>
      </section>

      {editable ? (
        <section>
          <Heading level={2}>Edit invoice</Heading>
          <InvoiceEditor
            mode="edit"
            invoiceId={invoice.id}
            clients={clients}
            defaults={{
              clientId: invoice.clientId,
              dueDate: invoice.dueDate
                ? invoice.dueDate.toISOString().slice(0, 10)
                : "",
              taxRate: String(invoice.taxRateBps / 100),
              notes: invoice.notes ?? "",
              lines: invoice.lineItems.map((line) => ({
                description: line.description,
                quantity: String(line.quantity),
                unitPrice: (line.unitPriceCents / 100).toFixed(2),
              })),
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
