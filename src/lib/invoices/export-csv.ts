import type { PaymentMethod } from "@prisma/client";
import { balanceCents, paymentMethodLabel } from "@/lib/invoices/payments";

/** RFC-style CSV cell: quote when needed; double internal quotes. */
export function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  if (/[",\r\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
}

export function csvRow(cells: Array<string | number | null | undefined>): string {
  return cells.map(csvCell).join(",");
}

function dollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function ymd(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

export type InvoiceCsvRow = {
  number: string;
  status: string;
  clientName: string;
  clientEmail: string | null;
  issueDate: Date;
  dueDate: Date | null;
  currency: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  paidCents: number;
  sentAt: Date | null;
  paidAt: Date | null;
  publicId: string;
};

export type PaymentCsvRow = {
  paidOn: Date;
  amountCents: number;
  method: PaymentMethod;
  note: string | null;
  source: string;
  invoiceNumber: string;
  invoiceStatus: string;
  clientName: string;
};

const invoiceHeader = [
  "number",
  "status",
  "client_name",
  "client_email",
  "issue_date",
  "due_date",
  "currency",
  "subtotal",
  "tax",
  "total",
  "paid",
  "balance",
  "sent_at",
  "paid_at",
  "public_id",
];

const paymentHeader = [
  "paid_on",
  "amount",
  "method",
  "note",
  "source",
  "invoice_number",
  "invoice_status",
  "client_name",
];

export function invoicesToCsv(rows: InvoiceCsvRow[]): string {
  const lines = [csvRow(invoiceHeader)];
  for (const row of rows) {
    lines.push(
      csvRow([
        row.number,
        row.status,
        row.clientName,
        row.clientEmail,
        ymd(row.issueDate),
        ymd(row.dueDate),
        row.currency,
        dollars(row.subtotalCents),
        dollars(row.taxCents),
        dollars(row.totalCents),
        dollars(row.paidCents),
        dollars(balanceCents(row)),
        ymd(row.sentAt),
        ymd(row.paidAt),
        row.publicId,
      ]),
    );
  }
  return lines.join("\r\n") + "\r\n";
}

export function paymentsToCsv(rows: PaymentCsvRow[]): string {
  const lines = [csvRow(paymentHeader)];
  for (const row of rows) {
    lines.push(
      csvRow([
        ymd(row.paidOn),
        dollars(row.amountCents),
        paymentMethodLabel(row.method),
        row.note,
        row.source,
        row.invoiceNumber,
        row.invoiceStatus,
        row.clientName,
      ]),
    );
  }
  return lines.join("\r\n") + "\r\n";
}

export function csvFilename(kind: "invoices" | "payments", now = new Date()): string {
  return `${kind}-${now.toISOString().slice(0, 10)}.csv`;
}
