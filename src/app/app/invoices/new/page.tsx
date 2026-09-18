import { InvoiceEditor } from "@/components/app/InvoiceEditor";
import { Heading } from "@/components/ui";
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
      <p className="mt-2 text-small text-ink-soft">Bill a new or existing client.</p>
      <InvoiceEditor mode="create" clients={clients} />
    </div>
  );
}
