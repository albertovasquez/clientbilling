"use client";

import { useActionState } from "react";
import { createWebhookEndpointAction, type ApiKeyState } from "@/app/app/api-key-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

const initial: ApiKeyState = {};

export function WebhookForm() {
  const [state, action, pending] = useActionState(createWebhookEndpointAction, initial);

  if (state.webhookSecret) {
    return (
      <Alert role="status">
        <AlertTitle>Copy this signing secret now. It will not be shown again.</AlertTitle>
        <AlertDescription>
          <code className="mt-2 block break-all rounded-md bg-field px-3 py-2 text-small text-ink">
            {state.webhookSecret}
          </code>
          <p className="mt-2 text-caption text-muted">Endpoint {state.name}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="flex max-w-xl flex-wrap items-end gap-3">
      <div className="grid min-w-[18rem] flex-1 gap-1.5">
        <Label htmlFor="url">Endpoint URL</Label>
        <Input id="url" name="url" type="url" required placeholder="https://example.com/hooks/clientbilling" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving" : "Add endpoint"}
      </Button>
      {state.error ? (
        <Alert variant="destructive" role="alert" className="w-full">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
