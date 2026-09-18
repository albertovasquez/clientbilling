import Link from "next/link";
import { Heading } from "@/components/ui";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { agingBuckets } from "@/lib/invoices/aging";
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
  const [open, overdue, paidThisMonth, openForAging] = await Promise.all([
    prisma.invoice.aggregate({ where: { userId: user.id, status: { in: ["sent", "viewed", "overdue"] } }, _sum: { totalCents: true, paidCents: true }, _count: true }),
    prisma.invoice.aggregate({ where: { userId: user.id, status: "overdue" }, _sum: { totalCents: true, paidCents: true }, _count: true }),
    prisma.payment.aggregate({ where: { userId: user.id, paidOn: { gte: monthStart } }, _sum: { amountCents: true }, _count: true }),
    prisma.invoice.findMany({
      where: { userId: user.id, status: { in: ["sent", "viewed", "overdue"] } },
      select: { dueDate: true, totalCents: true, paidCents: true },
    }),
  ]);
  // Outstanding money is what is still owed, net of partial payments (decision 0019).
  const openBalance = (open._sum.totalCents ?? 0) - (open._sum.paidCents ?? 0);
  const overdueBalance = (overdue._sum.totalCents ?? 0) - (overdue._sum.paidCents ?? 0);
  const aging = agingBuckets(openForAging, now);
  const agingRows: { label: string; bucket: (typeof aging)["current"] }[] = [
    { label: "Current", bucket: aging.current },
    { label: "1 to 30 days", bucket: aging.d1to30 },
    { label: "31 to 60 days", bucket: aging.d31to60 },
    { label: "60+ days", bucket: aging.d60plus },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading level={1}>Invoices</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Draft, send, and track. Payers see your payment instructions on every invoice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/app/export/invoices">Download invoices CSV</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/app/export/payments">Download payments CSV</a>
          </Button>
          <Button asChild>
            <Link href="/app/invoices/new">New invoice</Link>
          </Button>
        </div>
      </div>

      {invoices.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription className="text-caption text-muted">Outstanding</CardDescription>
              <CardTitle className="font-display text-display-sm font-semibold tabular-nums text-ink">{formatCents(openBalance)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-caption text-muted">{open._count} open</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-caption text-muted">Overdue</CardDescription>
              <CardTitle className={`font-display text-display-sm font-semibold tabular-nums ${overdue._count > 0 ? "text-destructive" : "text-ink"}`}>{formatCents(overdueBalance)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-caption text-muted">{overdue._count} past due</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-caption text-muted">Paid this month</CardDescription>
              <CardTitle className="font-display text-display-sm font-semibold tabular-nums text-primary">{formatCents(paidThisMonth._sum.amountCents ?? 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-caption text-muted">{paidThisMonth._count} payments</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {open._count > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agingRows.map((row) => (
            <Card key={row.label}>
              <CardHeader>
                <CardDescription className="text-caption text-muted">{row.label}</CardDescription>
                <CardTitle
                  className={`font-display text-display-sm font-semibold tabular-nums ${
                    row.label !== "Current" && row.bucket.count > 0 ? "text-destructive" : "text-ink"
                  }`}
                >
                  {formatCents(row.bucket.balanceCents)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-caption text-muted">
                  {row.bucket.count} {row.bucket.count === 1 ? "invoice" : "invoices"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!business?.paymentInstructions?.trim() ? (
        <Alert role="status" className="mt-6">
          <AlertDescription>
            Payers currently see &quot;contact us for payment options&quot;.{" "}
            <Link href="/app/settings" className="font-semibold text-primary underline-offset-4 hover:underline">
              Add payment instructions
            </Link>{" "}
            so they know how to pay you.
          </AlertDescription>
        </Alert>
      ) : null}

      {cardIntents > 0 && !business?.payLinkUrl ? (
        <Alert role="status" className="mt-6">
          <AlertTitle>
            {cardIntents === 1 ? "A client asked" : `${cardIntents} clients asked`} to pay by card in the last 30 days.
          </AlertTitle>
          <AlertDescription>
            Add a hosted payment page link in Business settings and they can pay online. A CDG Commerce merchant account includes one.
          </AlertDescription>
          <div className="mt-3">
            <Button asChild>
              <TrackedAffiliateLink
                href={siteConfig.quoteUrl}
                ctaPosition="card"
                ctaText="Get a free quote from CDG"
                ctaType="quote"
              >
                Get a free quote from CDG
              </TrackedAffiliateLink>
            </Button>
          </div>
        </Alert>
      ) : null}

      {invoices.length === 0 ? (
        <Card className="mt-10">
          <CardHeader>
            <Heading level={2}>No invoices yet</Heading>
            <CardDescription>
              You can add the client while creating the invoice, then email or copy
              the public link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/app/invoices/new">Create an invoice</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/clients">Manage clients</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-8">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link href={`/app/invoices/${invoice.id}`} className="font-semibold text-ink hover:text-primary">
                        Invoice #{invoice.number} · {invoice.client.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "overdue"
                            ? "destructive"
                            : invoice.status === "paid"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {merchantStatusLabel(invoice.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatCents(invoice.totalCents, invoice.currency)}
                      {invoice.paidCents > 0 && invoice.status !== "paid" ? (
                        <span className="block text-caption text-muted">
                          {formatCents(invoice.totalCents - invoice.paidCents, invoice.currency)} still due
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{invoice.dueDate ? invoice.dueDate.toISOString().slice(0, 10) : ""}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/app/invoices/${invoice.id}`} className="text-primary underline-offset-4 hover:underline">
                        Open
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
