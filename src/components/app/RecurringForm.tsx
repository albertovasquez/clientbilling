"use client";

import { useActionState, useState } from "react";
import { createScheduleAction, updateScheduleAction, type RecurringState } from "@/app/app/recurring-actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { Textarea } from "@/components/shadcn/textarea";

type ClientOption = { id: string; name: string };
type Line = { description: string; quantity: string; unitPrice: string };
type Cadence = { value: string; label: string };

type Props = {
  mode: "create" | "edit";
  clients: ClientOption[];
  cadences: Cadence[];
  scheduleId?: string;
  defaults?: {
    clientId?: string;
    cadence?: string;
    nextRunAt?: string;
    dueInDays?: string;
    taxRate?: string;
    notes?: string;
    autoSend?: boolean;
    lines?: Line[];
  };
};

const initial: RecurringState = {};

export function RecurringForm({ mode, clients, cadences, scheduleId, defaults }: Props) {
  const action = mode === "create" ? createScheduleAction : updateScheduleAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const [lines, setLines] = useState<Line[]>(defaults?.lines?.length ? defaults.lines : [{ description: "", quantity: "1", unitPrice: "" }]);

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {mode === "edit" && scheduleId ? <input type="hidden" name="id" value={scheduleId} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="clientId">Client</Label>
          <NativeSelect id="clientId" name="clientId" required defaultValue={defaults?.clientId ?? ""} className="w-full">
            <NativeSelectOption value="" disabled>
              Select a client
            </NativeSelectOption>
            {clients.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="cadence">How often</Label>
          <NativeSelect id="cadence" name="cadence" required defaultValue={defaults?.cadence ?? "monthly"} className="w-full">
            {cadences.map((c) => (
              <NativeSelectOption key={c.value} value={c.value}>
                {c.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="nextRunAt">{mode === "create" ? "First invoice on" : "Next invoice on"}</Label>
          <Input id="nextRunAt" name="nextRunAt" type="date" required defaultValue={defaults?.nextRunAt ?? ""} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="dueInDays">Due (days after issue)</Label>
          <Input id="dueInDays" name="dueInDays" type="number" min={0} max={365} defaultValue={defaults?.dueInDays ?? "14"} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="taxRate">Tax rate (%)</Label>
          <Input id="taxRate" name="taxRate" inputMode="decimal" defaultValue={defaults?.taxRate ?? "0"} />
        </div>
      </div>

      <fieldset>
        <legend className="text-small font-semibold text-ink">Line items</legend>
        <div className="mt-3 space-y-3">
          {lines.map((line, index) => (
            <Card key={index} size="sm">
              <CardContent className="grid gap-2 sm:grid-cols-12">
                <div className="grid gap-1.5 sm:col-span-6">
                  <Label className="text-caption text-muted" htmlFor={`desc-${index}`}>
                    Description
                  </Label>
                  <Input id={`desc-${index}`} name="line_description" required value={line.description} onChange={(e) => updateLine(index, { description: e.target.value })} />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label className="text-caption text-muted" htmlFor={`qty-${index}`}>
                    Qty
                  </Label>
                  <Input id={`qty-${index}`} name="line_quantity" inputMode="decimal" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} />
                </div>
                <div className="grid gap-1.5 sm:col-span-3">
                  <Label className="text-caption text-muted" htmlFor={`price-${index}`}>
                    Unit price ($)
                  </Label>
                  <Input id={`price-${index}`} name="line_unit_price" inputMode="decimal" value={line.unitPrice} onChange={(e) => updateLine(index, { unitPrice: e.target.value })} />
                </div>
                <div className="flex items-end sm:col-span-1">
                  {lines.length > 1 ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}>
                      Remove
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setLines((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }])}>
          Add line
        </Button>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes on every invoice (optional)</Label>
        <Textarea id="notes" name="notes" rows={3} maxLength={4000} defaultValue={defaults?.notes ?? ""} />
      </div>

      <label className="flex items-start gap-3 text-small text-ink">
        <input type="checkbox" name="autoSend" defaultChecked={defaults?.autoSend ?? false} className="mt-1" />
        <span>
          Email each invoice to the client automatically when it is generated. Off means invoices are
          created as drafts for you to review and send.
        </span>
      </label>

      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.ok ? (
        <Alert role="status">
          <AlertDescription>Saved.</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving" : mode === "create" ? "Create schedule" : "Save schedule"}
      </Button>
    </form>
  );
}
