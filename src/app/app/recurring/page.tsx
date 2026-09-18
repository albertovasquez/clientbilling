import Link from "next/link";
import { buttonClass, Heading } from "@/components/ui";
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
        <Link href="/app/recurring/new" className={buttonClass("primary", "md")}>
          New schedule
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-rule bg-paper p-8">
          <Heading level={2}>No schedules yet</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Bill a client the same amount every week, month, quarter, or year without retyping the invoice.
          </p>
          <Link href="/app/recurring/new" className={`${buttonClass("primary", "md")} mt-5`}>
            Create a schedule
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper">
          {schedules.map((s) => {
            const totals = computeInvoiceTotals(parseStoredLines(s.linesJson), s.taxRateBps);
            const cadence = cadences.find((c) => c.value === s.cadence)?.label ?? s.cadence;
            return (
              <li key={s.id}>
                <Link href={`/app/recurring/${s.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-field sm:px-6">
                  <div>
                    <p className="text-small font-semibold text-ink">
                      {s.client.name} · {formatCents(totals.totalCents)} {cadence.toLowerCase()}
                    </p>
                    <p className="text-caption text-muted">
                      {s.active ? `Next on ${s.nextRunAt.toISOString().slice(0, 10)}` : "Paused"} · {s._count.invoices} generated
                      {s.autoSend ? " · auto-send on" : ""}
                    </p>
                  </div>
                  <span className="text-small text-action">Open</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
