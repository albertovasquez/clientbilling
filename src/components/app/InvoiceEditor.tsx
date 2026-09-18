"use client";

import { useActionState, useState } from "react";
import {
  createInvoiceAction,
  updateInvoiceAction,
  type ActionState,
} from "@/app/app/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { Textarea } from "@/components/shadcn/textarea";

type ClientOption = { id: string; name: string };
type Line = { description: string; quantity: string; unitPrice: string };

type Props = {
  mode: "create" | "edit";
  clients: ClientOption[];
  invoiceId?: string;
  defaults?: {
    clientId?: string;
    dueDate?: string;
    taxRate?: string;
    notes?: string;
    lines?: Line[];
  };
};

const initial: ActionState = {};

export function InvoiceEditor({ mode, clients, invoiceId, defaults }: Props) {
  const action = mode === "create" ? createInvoiceAction : updateInvoiceAction;
  const [state, formAction, pending] = useActionState(action, initial);
  const [lines, setLines] = useState<Line[]>(
    defaults?.lines?.length
      ? defaults.lines
      : [{ description: "", quantity: "1", unitPrice: "" }],
  );
  const [clientChoice, setClientChoice] = useState<string>(() => {
    if (mode !== "create") return defaults?.clientId ?? "";
    if (clients.length === 0) return "__new__";
    if (defaults?.clientId) return defaults.clientId;
    return "";
  });
  const showNewClientFields =
    mode === "create" && (clients.length === 0 || clientChoice === "__new__");

  function addLine() {
    setLines((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }]);
  }

  function updateLine(index: number, patch: Partial<Line>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  function removeLine(index: number) {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {mode === "edit" && invoiceId ? (
        <input type="hidden" name="id" value={invoiceId} />
      ) : null}

      <div className="grid gap-1.5">
        <Label htmlFor="clientId">Client</Label>
        {mode === "edit" ? (
          <NativeSelect
            id="clientId"
            name="clientId"
            required
            defaultValue={defaults?.clientId ?? ""}
            className="w-full"
          >
            <NativeSelectOption value="" disabled>
              Select a client
            </NativeSelectOption>
            {clients.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ) : clients.length > 0 ? (
          <NativeSelect
            id="clientId"
            name="clientId"
            required={!showNewClientFields}
            value={clientChoice}
            onChange={(e) => setClientChoice(e.target.value)}
            className="w-full"
          >
            <NativeSelectOption value="" disabled>
              Select a client
            </NativeSelectOption>
            {clients.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.name}
              </NativeSelectOption>
            ))}
            <NativeSelectOption value="__new__">New client…</NativeSelectOption>
          </NativeSelect>
        ) : (
          <input type="hidden" name="clientId" value="" />
        )}
      </div>

      {showNewClientFields ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="newClientName">Client name</Label>
            <Input
              id="newClientName"
              name="newClientName"
              required
              autoComplete="organization"
              placeholder="Acme Studio"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="newClientEmail">Client email (optional)</Label>
            <Input
              id="newClientEmail"
              name="newClientEmail"
              type="email"
              autoComplete="email"
              placeholder="billing@example.com"
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="dueDate">Due date</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaults?.dueDate ?? ""}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="taxRate">Tax rate (%)</Label>
          <Input
            id="taxRate"
            name="taxRate"
            inputMode="decimal"
            defaultValue={defaults?.taxRate ?? "0"}
          />
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
                  <Input
                    id={`desc-${index}`}
                    name="line_description"
                    required
                    value={line.description}
                    onChange={(e) => updateLine(index, { description: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label className="text-caption text-muted" htmlFor={`qty-${index}`}>
                    Qty
                  </Label>
                  <Input
                    id={`qty-${index}`}
                    name="line_quantity"
                    inputMode="decimal"
                    value={line.quantity}
                    onChange={(e) => updateLine(index, { quantity: e.target.value })}
                  />
                </div>
                <div className="grid gap-1.5 sm:col-span-3">
                  <Label className="text-caption text-muted" htmlFor={`price-${index}`}>
                    Unit price ($)
                  </Label>
                  <Input
                    id={`price-${index}`}
                    name="line_unit_price"
                    inputMode="decimal"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                  />
                </div>
                <div className="flex items-end sm:col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLine(index)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addLine}>
          Add line
        </Button>
      </fieldset>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
        />
      </div>

      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : mode === "create" ? "Create invoice" : "Save changes"}
      </Button>
    </form>
  );
}
