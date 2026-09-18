"use client";

import { useActionState } from "react";
import {
  createClientAction,
  updateClientAction,
  type ActionState,
} from "@/app/app/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";

type Defaults = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  notes?: string;
};

const initial: ActionState = {};

export function ClientForm({ mode, defaults }: { mode: "create" | "edit"; defaults?: Defaults }) {
  const action = mode === "create" ? createClientAction : updateClientAction;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-4">
      {mode === "edit" && defaults?.id ? (
        <input type="hidden" name="id" value={defaults.id} />
      ) : null}
      {(
        [
          ["name", "Name", true],
          ["email", "Email", false],
          ["phone", "Phone", false],
          ["company", "Company", false],
          ["address1", "Address", false],
          ["city", "City", false],
          ["state", "State", false],
          ["postalCode", "Postal code", false],
        ] as const
      ).map(([name, label, required]) => (
        <div key={name} className="grid gap-1.5">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            name={name}
            type={name === "email" ? "email" : "text"}
            required={required}
            defaultValue={(defaults?.[name] as string | undefined) ?? ""}
          />
        </div>
      ))}
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={defaults?.notes ?? ""} />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Saving…" : mode === "create" ? "Add client" : "Save client"}
      </Button>
    </form>
  );
}
