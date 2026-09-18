import Link from "next/link";
import { InvoiceEditor } from "@/components/app/InvoiceEditor";
import { buttonClass, Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "New invoice" };

export default async function NewInvoicePage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Heading level={1}>New invoice</Heading>
      {clients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-rule bg-paper p-6">
          <p className="text-body text-ink-soft">
            Add a client before you create an invoice.
          </p>
          <Link href="/app/clients/new" className={`${buttonClass("primary", "md")} mt-4`}>
            Add a client
          </Link>
        </div>
      ) : (
        <InvoiceEditor mode="create" clients={clients} />
      )}
    </div>
  );
}
