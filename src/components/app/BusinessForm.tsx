"use client";

import { useActionState } from "react";
import { updateBusinessAction, type ActionState } from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

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
        <div key={name}>
          <label htmlFor={name} className={labelClass}>
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            defaultValue={(defaults?.[name] as string | undefined) ?? ""}
            className={fieldClass}
          />
        </div>
      ))}
      <div>
        <label htmlFor="paymentInstructions" className={labelClass}>
          Payment instructions (shown on every invoice)
        </label>
        <textarea
          id="paymentInstructions"
          name="paymentInstructions"
          rows={4}
          maxLength={2000}
          defaultValue={defaults?.paymentInstructions ?? ""}
          placeholder={"Example: Pay by bank transfer to First Bank, routing 000000000, account 00000000. Checks to the address above. Net 30."}
          className={fieldClass}
        />
        <p className="mt-1 text-caption text-muted">
          Free text. Do not put card numbers here; ClientBilling never collects card data.
        </p>
      </div>
      <div>
        <label htmlFor="payLinkUrl" className={labelClass}>
          Online payment link (optional)
        </label>
        <input
          id="payLinkUrl"
          name="payLinkUrl"
          type="url"
          inputMode="url"
          maxLength={500}
          placeholder="https://"
          defaultValue={defaults?.payLinkUrl ?? ""}
          className={fieldClass}
        />
        <p className="mt-1 text-caption text-muted">
          If you already have a hosted payment page, for example from your CDG Commerce Quantum
          account or another pay link you use, paste it here. It appears as a Pay online button on
          unpaid invoices. Card details are entered on that page, never on ClientBilling.
        </p>
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-small text-action" role="status">
          Saved.
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Saving" : "Save business profile"}
      </button>
    </form>
  );
}
