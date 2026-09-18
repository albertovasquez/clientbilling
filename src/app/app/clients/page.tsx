import Link from "next/link";
import { deleteClientAction } from "@/app/app/actions";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/shadcn/table";
import { Heading } from "@/components/ui";
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
        <Button asChild>
          <Link href="/app/clients/new">Add client</Link>
        </Button>
      </div>
      {clients.length === 0 ? (
        <p className="mt-8 text-body text-ink-soft">
          No clients yet. Add one before you create an invoice.
        </p>
      ) : (
        <Table className="mt-8">
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-semibold text-ink">{client.name}</TableCell>
                <TableCell className="text-caption text-muted">
                  {[client.email, client.company].filter(Boolean).join(" · ") || "No email"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Button asChild variant="outline">
                      <Link href={`/app/clients/${client.id}`}>Statement</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/app/clients/${client.id}/edit`}>Edit</Link>
                    </Button>
                    <form action={deleteClientAction}>
                      <input type="hidden" name="id" value={client.id} />
                      <Button type="submit" variant="ghost">
                        Delete
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
