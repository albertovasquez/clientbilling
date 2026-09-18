import Link from "next/link";
import { Heading } from "@/components/ui";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";
import { prisma } from "@/lib/db";
import { cadences, parseStoredLines } from "@/lib/invoices/recurring-dates";
import { computeInvoiceTotals, formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Recurring invoices" };

export default async function RecurringListPage() {
  const user = await requireUser();
  const schedules = await prisma.recurringSchedule.findMany({
    where: { userId: user.id },
    include: { client: { select: { name: true } }, _count: { select: { invoices: true } } },
    orderBy: [{ active: "desc" }, { nextRunAt: "asc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading level={1}>Recurring invoices</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Schedules generate a draft each period. Turn on auto-send to email them as they are created.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/recurring/new">New schedule</Link>
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card className="mt-10">
          <CardHeader>
            <Heading level={2}>No schedules yet</Heading>
            <CardDescription>
              Bill a client the same amount every week, month, quarter, or year without retyping the invoice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/app/recurring/new">Create a schedule</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-8">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Next</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((s) => {
                  const totals = computeInvoiceTotals(parseStoredLines(s.linesJson), s.taxRateBps);
                  const cadence = cadences.find((c) => c.value === s.cadence)?.label ?? s.cadence;
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Link href={`/app/recurring/${s.id}`} className="font-semibold text-ink hover:text-primary">
                          {s.client.name}
                        </Link>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatCents(totals.totalCents)} {cadence.toLowerCase()}
                      </TableCell>
                      <TableCell>
                        {s.active ? (
                          <span className="text-muted-foreground">Next on {s.nextRunAt.toISOString().slice(0, 10)}</span>
                        ) : (
                          <Badge variant="secondary">Paused</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s._count.invoices} generated
                        {s.autoSend ? " · auto-send on" : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/app/recurring/${s.id}`} className="text-primary underline-offset-4 hover:underline">
                          Open
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
