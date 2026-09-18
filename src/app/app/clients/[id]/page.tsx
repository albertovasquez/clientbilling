import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { balanceCents } from "@/lib/invoices/payments";
import { partitionStatementInvoices, statementBalanceCents } from "@/lib/invoices/statements";
import { merchantStatusLabel } from "@/lib/invoices/status";
import { formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";
import type { InvoiceStatus } from "@prisma/client";

export const metadata = { title: "Client statement" };

type Props = { params: Promise<{ id: string }> };

export default async function ClientStatementPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const client = await prisma.client.findFirst({
    where: { id, userId: user.id },
    include: {
      invoices: {
        orderBy: [{ issueDate: "desc" }, { number: "desc" }],
        take: 200,
      },
    },
  });
  if (!client) notFound();

  const { open, paid, other } = partitionStatementInvoices(client.invoices);
  const balance = statementBalanceCents(client.invoices);
  const currency = client.invoices[0]?.currency ?? "USD";

  return (
    <div className="space-y-8 print:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Heading level={1}>{client.name}</Heading>
          <p className="mt-2 text-small text-ink-soft">
            {[client.company, client.email, client.phone].filter(Boolean).join(" · ") || "No contact details"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Button asChild variant="outline">
            <Link href={`/app/clients/${client.id}/edit`}>Edit client</Link>
          </Button>
          <Button asChild>
            <Link href="/app/invoices/new">New invoice</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-caption text-muted">Balance owed</CardDescription>
            <CardTitle className={`font-display text-display-sm font-semibold tabular-nums ${balance > 0 ? "text-destructive" : "text-ink"}`}>
              {formatCents(balance, currency)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-caption text-muted">
              {open.length} open {open.length === 1 ? "invoice" : "invoices"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-caption text-muted">Paid invoices</CardDescription>
            <CardTitle className="font-display text-display-sm font-semibold tabular-nums text-primary">{paid.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-caption text-muted">Shown below (newest first)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-caption text-muted">Draft or void</CardDescription>
            <CardTitle className="font-display text-display-sm font-semibold tabular-nums text-ink">{other.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-caption text-muted">Not in the balance</p>
          </CardContent>
        </Card>
      </div>

      <StatementTable title="Open invoices" empty="No open invoices." rows={open} showBalance />
      <StatementTable title="Paid invoices" empty="No paid invoices yet." rows={paid} />
      {other.length > 0 ? <StatementTable title="Draft and void" empty="" rows={other} /> : null}
    </div>
  );
}

function StatementTable({
  title,
  empty,
  rows,
  showBalance = false,
}: {
  title: string;
  empty: string;
  rows: {
    id: string;
    number: string;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date | null;
    currency: string;
    totalCents: number;
    paidCents: number;
  }[];
  showBalance?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <Heading level={2}>{title}</Heading>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-small text-ink-soft">{empty}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {showBalance ? <TableHead className="text-right">Still due</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link href={`/app/invoices/${invoice.id}`} className="font-semibold text-ink hover:text-primary">
                      #{invoice.number}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "overdue" ? "destructive" : invoice.status === "paid" ? "default" : "secondary"}>
                      {merchantStatusLabel(invoice.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{invoice.issueDate.toISOString().slice(0, 10)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : ""}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatCents(invoice.totalCents, invoice.currency)}</TableCell>
                  {showBalance ? (
                    <TableCell className="text-right tabular-nums">
                      {formatCents(balanceCents(invoice), invoice.currency)}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
