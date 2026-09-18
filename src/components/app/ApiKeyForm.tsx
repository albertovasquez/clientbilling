"use client";

import { useActionState } from "react";
import { createApiKeyAction, type ApiKeyState } from "@/app/app/api-key-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

const initial: ApiKeyState = {};

export function ApiKeyForm() {
  const [state, action, pending] = useActionState(createApiKeyAction, initial);

  if (state.rawKey) {
    return (
      <Alert role="status" className="mt-4">
        <AlertTitle>Copy this key now. It will not be shown again.</AlertTitle>
        <AlertDescription>
          <code className="mt-2 block break-all rounded-md bg-field px-3 py-2 text-small text-ink">{state.rawKey}</code>
          <p className="mt-2 text-caption text-muted">
            Key &quot;{state.name}&quot;. Send it as <code>Authorization: Bearer ...</code>. Revoke it below if it leaks.
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="mt-4 flex max-w-xl flex-wrap items-end gap-3">
      <div className="grid min-w-[14rem] flex-1 gap-1.5">
        <Label htmlFor="name">Key name</Label>
        <Input id="name" name="name" required maxLength={60} placeholder="ops agent" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating" : "Create key"}
      </Button>
      {state.error ? (
        <Alert variant="destructive" role="alert" className="w-full">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
