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

export function SignInForm({ nextPath }: { nextPath?: string }) {
  const [state, action, pending] = useActionState(signInAction, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={nextPath || "/app"} />
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
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-small text-ink-soft">
        New here?{" "}
        <Link href="/app/sign-up" className="font-semibold text-action hover:underline">
          Create an account
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
        {pending ? "Creating…" : "Create account"}
      </button>
      <p className="text-caption text-muted">
        Free invoice UX. Card payments run on CDG Commerce Quantum when you enable
        collect online. ClientBilling never stores card numbers.
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
