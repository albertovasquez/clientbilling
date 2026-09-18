import { ClientForm } from "@/components/app/ClientForm";
import { Heading } from "@/components/ui";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Add client" };

export default async function NewClientPage() {
  await requireUser();
  return (
    <div>
      <Heading level={1}>Add client</Heading>
      <ClientForm mode="create" />
    </div>
  );
}
