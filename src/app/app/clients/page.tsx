import Link from "next/link";
import { deleteClientAction } from "@/app/app/actions";
import { buttonClass, Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const user = await requireUser();
  const clients = await prisma.client.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading level={1}>Clients</Heading>
        <Link href="/app/clients/new" className={buttonClass("primary", "md")}>
          Add client
        </Link>
      </div>
      {clients.length === 0 ? (
        <p className="mt-8 text-body text-ink-soft">
          No clients yet. Add one before you create an invoice.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-paper">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6"
            >
              <div>
                <p className="text-small font-semibold text-ink">{client.name}</p>
                <p className="text-caption text-muted">
                  {[client.email, client.company].filter(Boolean).join(" · ") || "No email"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/app/clients/${client.id}/edit`}
                  className={buttonClass("secondary", "md")}
                >
                  Edit
                </Link>
                <form action={deleteClientAction}>
                  <input type="hidden" name="id" value={client.id} />
                  <button type="submit" className={buttonClass("quiet", "md")}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
