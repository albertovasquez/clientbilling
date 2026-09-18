"use client";

import { useActionState } from "react";
import { updateBusinessAction, type ActionState } from "@/app/app/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";

type Defaults = {
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  logoUrl?: string;
  paymentInstructions?: string;
  payLinkUrl?: string;
};

const initial: ActionState = {};

export function BusinessForm({ defaults }: { defaults?: Defaults }) {
  const [state, action, pending] = useActionState(updateBusinessAction, initial);
  return (
    <form action={action} className="mt-6 max-w-xl space-y-4">
      {(
        [
          ["name", "Business name", true, "text"],
          ["email", "Business email", true, "email"],
          ["phone", "Phone", false, "text"],
          ["address1", "Address line 1", false, "text"],
          ["address2", "Address line 2", false, "text"],
          ["city", "City", false, "text"],
          ["state", "State", false, "text"],
          ["postalCode", "Postal code", false, "text"],
          ["logoUrl", "Logo URL (optional)", false, "url"],
        ] as const
      ).map(([name, label, required, type]) => (
        <div key={name} className="grid gap-1.5">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            name={name}
            type={type}
            required={required}
            defaultValue={(defaults?.[name] as string | undefined) ?? ""}
          />
        </div>
      ))}
      <div className="grid gap-1.5">
        <Label htmlFor="paymentInstructions">Payment instructions (shown on every invoice)</Label>
        <Textarea
          id="paymentInstructions"
          name="paymentInstructions"
          rows={4}
          maxLength={2000}
          defaultValue={defaults?.paymentInstructions ?? ""}
          placeholder={"Example: Pay by bank transfer to First Bank, routing 000000000, account 00000000. Checks to the address above. Net 30."}
        />
        <p className="text-caption text-muted">
          Free text. Do not put card numbers here; ClientBilling never collects card data.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="payLinkUrl">Online payment link (optional)</Label>
        <Input
          id="payLinkUrl"
          name="payLinkUrl"
          type="url"
          inputMode="url"
          maxLength={500}
          placeholder="https://"
          defaultValue={defaults?.payLinkUrl ?? ""}
        />
        <p className="text-caption text-muted">
          If you already have a hosted payment page, for example from your CDG Commerce Quantum
          account, or a PayPal.me link, paste it here. It appears as a Pay online button on unpaid
          invoices. PayPal.me links open with the balance due filled in. Card details are entered
          on that page, never on ClientBilling.
        </p>
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.ok ? (
        <Alert role="status">
          <AlertDescription>Saved.</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving" : "Save business profile"}
      </Button>
    </form>
  );
}
