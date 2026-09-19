"use client";

import { useActionState } from "react";
import { createApiKeyAction, type ApiKeyState } from "@/app/app/api-key-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { API_SCOPES } from "@/lib/api-scopes";

const initial: ApiKeyState = {};

export function ApiKeyForm({
  serviceAccounts,
}: {
  serviceAccounts: { id: string; name: string }[];
}) {
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
    <form action={action} className="mt-4 grid max-w-xl gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Key name</Label>
        <Input id="name" name="name" required maxLength={60} placeholder="ops agent" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="kind">Key kind</Label>
        <NativeSelect id="kind" name="kind" className="w-full" defaultValue="live">
          <NativeSelectOption value="live">Live (cb_live_)</NativeSelectOption>
          <NativeSelectOption value="test">Sandbox (cb_test_, 100 writes/day)</NativeSelectOption>
        </NativeSelect>
      </div>
      {serviceAccounts.length > 0 ? (
        <div className="grid gap-1.5">
          <Label htmlFor="serviceAccountId">Service account (optional)</Label>
          <NativeSelect id="serviceAccountId" name="serviceAccountId" className="w-full" defaultValue="">
            <NativeSelectOption value="">Act as API key</NativeSelectOption>
            {serviceAccounts.map((sa) => (
              <NativeSelectOption key={sa.id} value={sa.id}>
                {sa.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      ) : null}
      <fieldset className="grid gap-2">
        <legend className="text-small font-medium text-ink">Scopes</legend>
        <p className="text-caption text-muted">Leave all unchecked to grant every scope.</p>
        <div className="grid gap-1 sm:grid-cols-2">
          {API_SCOPES.map((scope) => (
            <label key={scope} className="flex items-center gap-2 text-small text-ink">
              <input type="checkbox" name="scope" value={scope} className="accent-carbon" />
              <code>{scope}</code>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating" : "Create key"}
        </Button>
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
