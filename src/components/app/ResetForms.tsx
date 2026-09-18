"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmPasswordResetAction, requestPasswordResetAction, type ResetState } from "@/app/app/reset/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

const initial: ResetState = {};

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial);
  if (state.ok) {
    return (
      <p className="mt-6 rounded-lg border border-rule bg-field p-4 text-small text-ink" role="status">
        If an account exists for that email, a reset link is on its way. It works
        for one hour. Check your spam folder if it does not arrive.
      </p>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          Email on your account
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Sending" : "Email me a reset link"}
      </button>
      <p className="text-small text-ink-soft">
        Remembered it?{" "}
        <Link href="/app/sign-in" className="font-semibold text-action hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export function ResetConfirmForm({ email, token }: { email: string; token: string }) {
  const [state, action, pending] = useActionState(confirmPasswordResetAction, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className={labelClass}>
          New password (8+ characters)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="confirm" className={labelClass}>
          Confirm new password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}{" "}
          <Link href="/app/reset" className="font-semibold text-action hover:underline">
            Request a new link
          </Link>
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Saving" : "Set new password"}
      </button>
    </form>
  );
}
