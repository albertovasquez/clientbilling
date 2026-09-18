import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyLinkButton } from "@/components/app/CopyLinkButton";
import { InvoiceEditor } from "@/components/app/InvoiceEditor";
import { InvoiceStatusActions } from "@/components/app/StatusForm";
import { PaymentForm } from "@/components/app/PaymentForm";
import { deletePaymentAction } from "@/app/app/payment-actions";
import { CollectOnlinePanel } from "@/components/app/CollectOnlinePanel";
import { RemindButton } from "@/components/app/RemindButton";
import { SendInvoiceForm } from "@/components/app/SendInvoiceForm";
import { Heading } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { prisma } from "@/lib/db";
import { balanceCents, paymentMethodLabel, paymentMethods } from "@/lib/invoices/payments";
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
      payments: { orderBy: { paidOn: "desc" } },
    },
  });
  if (!invoice) notFound();
  const balance = balanceCents(invoice);
  const canTakePayment = invoice.status !== "void" && balance > 0;
  // Server component; today's date seeds the payment form.
  const today = new Date().toISOString().slice(0, 10);

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
            {invoice.paidCents > 0 && invoice.status !== "paid"
              ? ` · ${formatCents(balance, invoice.currency)} still due`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/i/${invoice.publicId}`} target="_blank">
              Public view
            </Link>
          </Button>
          <CopyLinkButton url={publicUrl} />
          <Button asChild variant="outline">
            <a href={`/api/invoices/${invoice.id}/pdf`}>Download PDF</a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Heading level={2}>Status</Heading>
        </CardHeader>
        <CardContent>
          {cardIntent ? (
            <p className="text-small text-ink">
              A client asked to pay this invoice by card on {cardIntent.createdAt.toISOString().slice(0, 10)}.
            </p>
          ) : null}
          {query.error === "transition" ? (
            <Alert variant="destructive" role="alert" className="mt-2">
              <AlertDescription>
                That status change is not allowed from the invoice&apos;s current state.
              </AlertDescription>
            </Alert>
          ) : null}
          {query.error === "void_reason" ? (
            <Alert variant="destructive" role="alert" className="mt-2">
              <AlertDescription>Enter a reason before voiding this invoice.</AlertDescription>
            </Alert>
          ) : null}
          {invoice.status === "void" && invoice.voidReason ? (
            <p className="mt-2 text-small text-ink-soft">Void reason: {invoice.voidReason}</p>
          ) : null}
          <div className="mt-4">
            <InvoiceStatusActions invoiceId={invoice.id} status={invoice.status} />
          </div>
          {canRemind ? (
            <div className="mt-6">
              <Separator />
              <div className="mt-4">
                <RemindButton
                  invoiceId={invoice.id}
                  clientEmail={invoice.client.email}
                  lastRemindedAt={lastReminder ? lastReminder.createdAt.toISOString().slice(0, 10) : null}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Heading level={2}>Share</Heading>
        </CardHeader>
        <CardContent>
          <p className="text-small text-ink-soft break-all">{publicUrl}</p>
          {invoice.status === "draft" ? (
            <p className="mt-2 text-caption text-muted">
              Drafts are private. Payers can open this link once the invoice is sent or marked as sent; you can open it now.
            </p>
          ) : null}
          <div className="mt-4">
            <SendInvoiceForm
              invoiceId={invoice.id}
              clientId={invoice.clientId}
              clientEmail={invoice.client.email}
            />
          </div>
        </CardContent>
      </Card>

      <CollectOnlinePanel
        hasPaymentInstructions={Boolean(business?.paymentInstructions?.trim())}
        hasPayLink={Boolean(business?.payLinkUrl?.trim())}
        invoiceTotalLabel={formatCents(balance, invoice.currency)}
      />

      <Card>
        <CardHeader>
          <Heading level={2}>Line items</Heading>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {invoice.lineItems.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="whitespace-normal text-ink">
                    {line.description}{" "}
                    <span className="text-muted">
                      × {String(line.quantity)} @ {formatCents(line.unitPriceCents)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-ink">
                    {formatCents(Math.round(Number(line.quantity) * line.unitPriceCents))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            {invoice.paidCents > 0 ? (
              <>
                <div className="flex justify-between">
                  <dt className="text-muted">Paid to date</dt>
                  <dd>{formatCents(invoice.paidCents)}</dd>
                </div>
                <div className="flex justify-between font-semibold">
                  <dt>Balance due</dt>
                  <dd>{formatCents(balance)}</dd>
                </div>
              </>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Heading level={2}>Payments</Heading>
        </CardHeader>
        <CardContent>
          {invoice.payments.length > 0 ? (
            <Table>
              <TableBody>
                {invoice.payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-ink">{p.paidOn.toISOString().slice(0, 10)}</TableCell>
                    <TableCell className="text-ink-soft">
                      {paymentMethodLabel(p.method)}
                      {p.note ? <span className="text-muted"> · {p.note}</span> : null}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums text-ink">
                      {formatCents(p.amountCents, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.status !== "void" ? (
                        <form action={deletePaymentAction}>
                          <input type="hidden" name="paymentId" value={p.id} />
                          <Button type="submit" variant="ghost" size="sm">
                            Remove
                          </Button>
                        </form>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-small text-ink-soft">No payments recorded yet.</p>
          )}
          {canTakePayment ? (
            <div className="mt-6">
              <Separator />
              <div className="mt-4">
                <PaymentForm
                  invoiceId={invoice.id}
                  balanceDollars={(balance / 100).toFixed(2)}
                  today={today}
                  methods={paymentMethods.map((m) => ({ value: m, label: paymentMethodLabel(m) }))}
                />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

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
