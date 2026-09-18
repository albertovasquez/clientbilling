import { BusinessForm } from "@/components/app/BusinessForm";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Heading } from "@/components/ui";
import { bpsToPercentInput } from "@/lib/money";
import { getBusinessForUser, requireUser } from "@/lib/session";

export const metadata = { title: "Business profile" };

type Props = { searchParams?: Promise<{ setup?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const user = await requireUser();
  const business = await getBusinessForUser(user.id);
  const params = searchParams ? await searchParams : {};
  const needsSetup = params.setup === "1" && !business;

  return (
    <div>
      <Heading level={1}>Business profile</Heading>
      {needsSetup ? (
        <Alert variant="destructive" role="status" className="mt-2">
          <AlertDescription>Add your business details before creating invoices.</AlertDescription>
        </Alert>
      ) : (
        <p className="mt-2 text-small text-ink-soft">
          Shown on public invoices. Logo URL is optional.
        </p>
      )}
      <BusinessForm
        defaults={{
          name: business?.name ?? "",
          email: business?.email ?? user.email ?? "",
          phone: business?.phone ?? "",
          address1: business?.address1 ?? "",
          address2: business?.address2 ?? "",
          city: business?.city ?? "",
          state: business?.state ?? "",
          postalCode: business?.postalCode ?? "",
          logoUrl: business?.logoUrl ?? "",
          paymentInstructions: business?.paymentInstructions ?? "",
          payLinkUrl: business?.payLinkUrl ?? "",
          defaultDueInDays: String(business?.defaultDueInDays ?? 14),
          defaultTaxRate: bpsToPercentInput(business?.defaultTaxRateBps ?? 0),
          defaultNotes: business?.defaultNotes ?? "",
        }}
      />
    </div>
  );
}
