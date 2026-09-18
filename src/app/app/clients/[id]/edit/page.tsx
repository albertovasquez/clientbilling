import { notFound } from "next/navigation";
import { ClientForm } from "@/components/app/ClientForm";
import { Heading } from "@/components/ui";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Edit client" };

type Props = { params: Promise<{ id: string }> };

export default async function EditClientPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;
  const client = await prisma.client.findFirst({ where: { id, userId: user.id } });
  if (!client) notFound();

  return (
    <div>
      <Heading level={1}>Edit client</Heading>
      <ClientForm
        mode="edit"
        defaults={{
          id: client.id,
          name: client.name,
          email: client.email ?? "",
          phone: client.phone ?? "",
          company: client.company ?? "",
          address1: client.address1 ?? "",
          city: client.city ?? "",
          state: client.state ?? "",
          postalCode: client.postalCode ?? "",
          notes: client.notes ?? "",
        }}
      />
    </div>
  );
}
