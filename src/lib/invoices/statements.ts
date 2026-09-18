import { balanceCents } from "@/lib/invoices/payments";
import { openStatuses } from "@/lib/invoices/status";
import type { InvoiceStatus } from "@prisma/client";

export type StatementInvoice = {
  id: string;
  number: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date | null;
  currency: string;
  totalCents: number;
  paidCents: number;
  paidAt: Date | null;
};

export function isOpenStatementStatus(status: InvoiceStatus): boolean {
  return (openStatuses as InvoiceStatus[]).includes(status);
}

export function statementBalanceCents(invoices: StatementInvoice[]): number {
  return invoices
    .filter((invoice) => isOpenStatementStatus(invoice.status))
    .reduce((sum, invoice) => sum + balanceCents(invoice), 0);
}

export function partitionStatementInvoices(invoices: StatementInvoice[]) {
  const open: StatementInvoice[] = [];
  const paid: StatementInvoice[] = [];
  const other: StatementInvoice[] = [];
  for (const invoice of invoices) {
    if (isOpenStatementStatus(invoice.status)) open.push(invoice);
    else if (invoice.status === "paid") paid.push(invoice);
    else other.push(invoice);
  }
  return { open, paid, other };
}
