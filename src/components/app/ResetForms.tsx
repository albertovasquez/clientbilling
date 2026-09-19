"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmPasswordResetAction, requestPasswordResetAction, type ResetState } from "@/app/app/reset/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

const initial: ResetState = {};

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial);
  if (state.ok) {
    return (
      <Alert role="status" className="mt-6">
        <AlertDescription>
          If an account exists for that email, a reset link is on its way. It works
          for one hour. Check your spam folder if it does not arrive.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email on your account</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Sending" : "Email me a reset link"}
      </Button>
      <p className="text-small text-ink-soft">
        Remembered it?{" "}
        <Link href="/app/sign-in" className="font-semibold text-carbon hover:underline">
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
      <div className="grid gap-1.5">
        <Label htmlFor="password">New password (8+ characters)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="confirm">Confirm new password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>
            {state.error}{" "}
            <Link href="/app/reset" className="font-semibold text-carbon hover:underline">
              Request a new link
            </Link>
          </AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving" : "Set new password"}
      </Button>
    </form>
  );
}
