import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteScheduleAction, runScheduleNowAction, toggleScheduleAction } from "@/app/app/recurring-actions";
import { RecurringForm } from "@/components/app/RecurringForm";
import { Heading } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { prisma } from "@/lib/db";
import { cadences, parseStoredLines } from "@/lib/invoices/recurring-dates";
import { merchantStatusLabel } from "@/lib/invoices/status";
import { formatCents } from "@/lib/money";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Recurring schedule" };

type Props = { params: Promise<{ id: string }>; searchParams?: Promise<{ error?: string }> };

export default async function RecurringDetailPage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const schedule = await prisma.recurringSchedule.findFirst({
    where: { id, userId: user.id },
    include: {
      client: { select: { id: true, name: true } },
      invoices: { orderBy: { createdAt: "desc" }, take: 12, select: { id: true, number: true, status: true, totalCents: true, currency: true, createdAt: true } },
    },
  });
  if (!schedule) notFound();
  const clients = await prisma.client.findMany({ where: { userId: user.id }, orderBy: { name: "asc" }, select: { id: true, name: true } });
  const lines = parseStoredLines(schedule.linesJson);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Heading level={1}>{schedule.client.name}</Heading>
          <p className="mt-2 text-small text-ink-soft">
            {cadences.find((c) => c.value === schedule.cadence)?.label} ·{" "}
            {schedule.active ? `next on ${schedule.nextRunAt.toISOString().slice(0, 10)}` : "paused"}
            {schedule.lastRunAt ? ` · last generated ${schedule.lastRunAt.toISOString().slice(0, 10)}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={runScheduleNowAction}>
            <input type="hidden" name="id" value={schedule.id} />
            <Button type="submit">Generate next invoice now</Button>
          </form>
          <form action={toggleScheduleAction}>
            <input type="hidden" name="id" value={schedule.id} />
            <Button type="submit" variant="outline">
              {schedule.active ? "Pause" : "Resume"}
            </Button>
          </form>
        </div>
      </div>

      {query.error === "run" ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            The invoice could not be generated. Check that the schedule is active and has line items.
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <Heading level={2}>Generated invoices</Heading>
        </CardHeader>
        <CardContent>
          {schedule.invoices.length === 0 ? (
            <p className="text-small text-ink-soft">None yet.</p>
          ) : (
            <Table>
              <TableBody>
                {schedule.invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Link href={`/app/invoices/${inv.id}`} className="font-semibold text-ink hover:text-primary">
                        Invoice #{inv.number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "overdue"
                            ? "destructive"
                            : inv.status === "paid"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {merchantStatusLabel(inv.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums">{formatCents(inv.totalCents, inv.currency)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{inv.createdAt.toISOString().slice(0, 10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <section>
        <Heading level={2}>Edit schedule</Heading>
        <RecurringForm
          mode="edit"
          scheduleId={schedule.id}
          clients={clients}
          cadences={cadences}
          defaults={{
            clientId: schedule.clientId,
            cadence: schedule.cadence,
            nextRunAt: schedule.nextRunAt.toISOString().slice(0, 10),
            dueInDays: String(schedule.dueInDays),
            taxRate: String(schedule.taxRateBps / 100),
            notes: schedule.notes ?? "",
            autoSend: schedule.autoSend,
            lines: lines.map((l) => ({ description: l.description, quantity: String(l.quantity), unitPrice: (l.unitPriceCents / 100).toFixed(2) })),
          }}
        />
      </section>

      <div>
        <Separator />
        <form action={deleteScheduleAction} className="pt-6">
          <input type="hidden" name="id" value={schedule.id} />
          <Button type="submit" variant="ghost">
            Delete this schedule (generated invoices are kept)
          </Button>
        </form>
      </div>
    </div>
  );
}
