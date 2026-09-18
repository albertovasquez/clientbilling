"use client";

import { useActionState } from "react";
import {
  connectQuantumStubAction,
  type ActionState,
} from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

const initial: ActionState = {};

export function QuantumConnectForm() {
  const [state, action, pending] = useActionState(connectQuantumStubAction, initial);
  return (
    <form action={action} className="mt-4 max-w-xl space-y-4">
      <div>
        <label htmlFor="quantumMerchantLabel" className={labelClass}>
          Merchant label
        </label>
        <input
          id="quantumMerchantLabel"
          name="quantumMerchantLabel"
          required
          placeholder="Acme LLC · Quantum"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="quantumGwLoginRef" className={labelClass}>
          Gateway login reference (optional, not a password)
        </label>
        <input
          id="quantumGwLoginRef"
          name="quantumGwLoginRef"
          placeholder="Display name or merchant id label only"
          className={fieldClass}
        />
        <p className="mt-1 text-caption text-muted">
          Do not paste RestrictKeys, passwords, or card data. Hosted pay wiring
          comes after CDG confirms the preferred Quantum method.
        </p>
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-small text-action" role="status">
          Connection saved.
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? "Saving…" : "Save Quantum connection"}
      </button>
    </form>
  );
}
