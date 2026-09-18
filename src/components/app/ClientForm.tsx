"use client";

import { useActionState } from "react";
import {
  createClientAction,
  updateClientAction,
  type ActionState,
} from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

type Defaults = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  notes?: string;
};

const initial: ActionState = {};

export function ClientForm({ mode, defaults }: { mode: "create" | "edit"; defaults?: Defaults }) {
  const action = mode === "create" ? createClientAction : updateClientAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-4">
      {mode === "edit" && defaults?.id ? (
        <input type="hidden" name="id" value={defaults.id} />
      ) : null}
      {(
        [
          ["name", "Name", true],
          ["email", "Email", false],
          ["phone", "Phone", false],
          ["company", "Company", false],
          ["address1", "Address", false],
          ["city", "City", false],
          ["state", "State", false],
          ["postalCode", "Postal code", false],
        ] as const
      ).map(([name, label, required]) => (
        <div key={name}>
          <label htmlFor={name} className={labelClass}>
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={name === "email" ? "email" : "text"}
            required={required}
            defaultValue={(defaults?.[name] as string | undefined) ?? ""}
            className={fieldClass}
          />
        </div>
      ))}
      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          className={fieldClass}
        />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Saving…" : mode === "create" ? "Add client" : "Save client"}
      </button>
    </form>
  );
}
