"use client";

import { useActionState } from "react";
import { createApiKeyAction, type ApiKeyState } from "@/app/app/api-key-actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

const initial: ApiKeyState = {};

export function ApiKeyForm() {
  const [state, action, pending] = useActionState(createApiKeyAction, initial);

  if (state.rawKey) {
    return (
      <div className="mt-4 rounded-lg border border-verdict-rule bg-verdict-tint p-4" role="status">
        <p className="text-small font-semibold text-ink">Copy this key now. It will not be shown again.</p>
        <code className="mt-2 block break-all rounded-md bg-paper px-3 py-2 text-small text-ink">{state.rawKey}</code>
        <p className="mt-2 text-caption text-muted">
          Key &quot;{state.name}&quot;. Send it as <code>Authorization: Bearer ...</code>. Revoke it below if it leaks.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-4 flex max-w-xl flex-wrap items-end gap-3">
      <div className="min-w-[14rem] flex-1">
        <label htmlFor="name" className={labelClass}>
          Key name
        </label>
        <input id="name" name="name" required maxLength={60} placeholder="ops agent" className={fieldClass} />
      </div>
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? "Creating" : "Create key"}
      </button>
      {state.error ? (
        <p className="w-full text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
