import Link from "next/link";
import { buttonClass, Heading } from "@/components/ui";
import { formatCents } from "@/lib/money";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Your invoices" };

export default async function AppHomePage() {
  const user = await requireUser();
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Heading level={1}>Invoices</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Draft, send, and track. Collect online is optional and runs on Quantum.
          </p>
        </div>
        <Link href="/app/invoices/new" className={buttonClass("primary", "md")}>
          New invoice
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-rule bg-paper p-8">
          <Heading level={2}>No invoices yet</Heading>
          <p className="mt-2 text-small text-ink-soft">
            Add a client, then create your first invoice. You can share the public
            link before payments are connected.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/app/clients/new" className={buttonClass("secondary", "md")}>
              Add a client
            </Link>
            <Link href="/app/invoices/new" className={buttonClass("primary", "md")}>
              Create an invoice
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link
                href={`/app/invoices/${invoice.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-field sm:px-6"
              >
                <div>
                  <p className="text-small font-semibold text-ink">
                    Invoice #{invoice.number} · {invoice.client.name}
                  </p>
                  <p className="text-caption text-muted">
                    {invoice.status} · {formatCents(invoice.totalCents, invoice.currency)}
                  </p>
                </div>
                <span className="text-small text-action">Open</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
