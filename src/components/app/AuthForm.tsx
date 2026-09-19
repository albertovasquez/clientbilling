"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signInAction,
  signUpAction,
  type ActionState,
} from "@/app/app/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

const initial: ActionState = {};

export function SignInForm({ nextPath, notice }: { nextPath?: string; notice?: string }) {
  const [state, action, pending] = useActionState(signInAction, initial);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={nextPath || "/app"} />
      {notice ? (
        <Alert role="status">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>
      <p className="flex flex-wrap gap-x-4 text-small text-ink-soft">
        <span>
          New here?{" "}
          <Link href="/app/sign-up" className="font-semibold text-carbon hover:underline">
            Create an account
          </Link>
        </span>
        <Link href="/app/reset" className="font-semibold text-carbon hover:underline">
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
      <div className="grid gap-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" required autoComplete="name" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" name="businessName" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password (8+ characters)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating" : "Create account"}
      </Button>
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
        <Link href="/app/sign-in" className="font-semibold text-carbon hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
