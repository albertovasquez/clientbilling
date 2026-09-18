import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteScheduleAction, runScheduleNowAction, toggleScheduleAction } from "@/app/app/recurring-actions";
import { RecurringForm } from "@/components/app/RecurringForm";
import { buttonClass, Heading } from "@/components/ui";
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
            <button type="submit" className={buttonClass("primary", "md")}>
              Generate next invoice now
            </button>
          </form>
          <form action={toggleScheduleAction}>
            <input type="hidden" name="id" value={schedule.id} />
            <button type="submit" className={buttonClass("secondary", "md")}>
              {schedule.active ? "Pause" : "Resume"}
            </button>
          </form>
        </div>
      </div>

      {query.error === "run" ? (
        <p className="text-small text-verdict" role="alert">
          The invoice could not be generated. Check that the schedule is active and has line items.
        </p>
      ) : null}

      <section className="rounded-2xl border border-rule bg-paper p-6">
        <Heading level={2}>Generated invoices</Heading>
        {schedule.invoices.length === 0 ? (
          <p className="mt-2 text-small text-ink-soft">None yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-rule">
            {schedule.invoices.map((inv) => (
              <li key={inv.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-small">
                <Link href={`/app/invoices/${inv.id}`} className="font-semibold text-ink hover:text-action">
                  Invoice #{inv.number}
                </Link>
                <span className="text-ink-soft">
                  {merchantStatusLabel(inv.status)} · {formatCents(inv.totalCents, inv.currency)} · {inv.createdAt.toISOString().slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

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

      <form action={deleteScheduleAction} className="border-t border-rule pt-6">
        <input type="hidden" name="id" value={schedule.id} />
        <button type="submit" className={buttonClass("quiet", "md")}>
          Delete this schedule (generated invoices are kept)
        </button>
      </form>
    </div>
  );
}
