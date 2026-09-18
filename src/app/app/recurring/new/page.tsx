import Link from "next/link";
import { RecurringForm } from "@/components/app/RecurringForm";
import { Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { cadences } from "@/lib/invoices/recurring-dates";
import { requireUser } from "@/lib/session";

export const metadata = { title: "New recurring schedule" };

export default async function NewRecurringPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({ where: { userId: user.id }, orderBy: { name: "asc" }, select: { id: true, name: true } });
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <Heading level={1}>New recurring schedule</Heading>
      <p className="mt-2 text-small text-ink-soft">
        Same client, same lines, every period.{" "}
        {clients.length === 0 ? (
          <Link href="/app/clients/new" className="text-action underline-offset-4 hover:underline">
            Add a client first.
          </Link>
        ) : null}
      </p>
      <RecurringForm mode="create" clients={clients} cadences={cadences} defaults={{ nextRunAt: today }} />
    </div>
  );
}
