"use client";

import { useActionState, useState } from "react";
import {
  createInvoiceAction,
  updateInvoiceAction,
  type ActionState,
} from "@/app/app/actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

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

      <div>
        <label htmlFor="clientId" className={labelClass}>
          Client
        </label>
        {mode === "edit" ? (
          <select
            id="clientId"
            name="clientId"
            required
            defaultValue={defaults?.clientId ?? ""}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : clients.length > 0 ? (
          <select
            id="clientId"
            name="clientId"
            required={!showNewClientFields}
            value={clientChoice}
            onChange={(e) => setClientChoice(e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="__new__">New client…</option>
          </select>
        ) : (
          <input type="hidden" name="clientId" value="" />
        )}
      </div>

      {showNewClientFields ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="newClientName" className={labelClass}>
              Client name
            </label>
            <input
              id="newClientName"
              name="newClientName"
              required
              autoComplete="organization"
              placeholder="Acme Studio"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="newClientEmail" className={labelClass}>
              Client email (optional)
            </label>
            <input
              id="newClientEmail"
              name="newClientEmail"
              type="email"
              autoComplete="email"
              placeholder="billing@example.com"
              className={fieldClass}
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dueDate" className={labelClass}>
            Due date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={defaults?.dueDate ?? ""}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="taxRate" className={labelClass}>
            Tax rate (%)
          </label>
          <input
            id="taxRate"
            name="taxRate"
            inputMode="decimal"
            defaultValue={defaults?.taxRate ?? "0"}
            className={fieldClass}
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Line items</legend>
        <div className="mt-3 space-y-3">
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-lg border border-rule bg-paper p-3 sm:grid-cols-12"
            >
              <div className="sm:col-span-6">
                <label className="text-caption text-muted" htmlFor={`desc-${index}`}>
                  Description
                </label>
                <input
                  id={`desc-${index}`}
                  name="line_description"
                  required
                  value={line.description}
                  onChange={(e) => updateLine(index, { description: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-caption text-muted" htmlFor={`qty-${index}`}>
                  Qty
                </label>
                <input
                  id={`qty-${index}`}
                  name="line_quantity"
                  inputMode="decimal"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-3">
                <label className="text-caption text-muted" htmlFor={`price-${index}`}>
                  Unit price ($)
                </label>
                <input
                  id={`price-${index}`}
                  name="line_unit_price"
                  inputMode="decimal"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(index, { unitPrice: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div className="flex items-end sm:col-span-1">
                <button
                  type="button"
                  onClick={() => removeLine(index)}
                  className={buttonClass("quiet", "md")}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLine} className={`${buttonClass("secondary", "md")} mt-3`}>
          Add line
        </button>
      </fieldset>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={defaults?.notes ?? ""}
          className={fieldClass}
        />
      </div>

      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Saving…" : mode === "create" ? "Create invoice" : "Save changes"}
      </button>
    </form>
  );
}
