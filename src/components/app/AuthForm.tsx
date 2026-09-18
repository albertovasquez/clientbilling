"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signInAction,
  signUpAction,
  type ActionState,
} from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

const initial: ActionState = {};

export function SignInForm({ nextPath, notice }: { nextPath?: string; notice?: string }) {
  const [state, action, pending] = useActionState(signInAction, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={nextPath || "/app"} />
      {notice ? (
        <p className="rounded-lg border border-rule bg-field p-3 text-small text-ink" role="status">
          {notice}
        </p>
      ) : null}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Signing in" : "Sign in"}
      </button>
      <p className="flex flex-wrap gap-x-4 text-small text-ink-soft">
        <span>
          New here?{" "}
          <Link href="/app/sign-up" className="font-semibold text-action hover:underline">
            Create an account
          </Link>
        </span>
        <Link href="/app/reset" className="font-semibold text-action hover:underline">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          Your name
        </label>
        <input id="name" name="name" required className={fieldClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="businessName" className={labelClass}>
          Business name
        </label>
        <input id="businessName" name="businessName" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={fieldClass}
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          Password (8+ characters)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className={fieldClass}
          autoComplete="new-password"
        />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Creating" : "Create account"}
      </button>
      <p className="text-caption text-muted">
        Free. By creating an account you accept the{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-ink">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
          privacy policy
        </Link>
        . ClientBilling never stores card numbers.
      </p>
      <p className="text-small text-ink-soft">
        Already have an account?{" "}
        <Link href="/app/sign-in" className="font-semibold text-action hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
