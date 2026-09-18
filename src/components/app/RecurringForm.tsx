"use client";

import { useActionState, useState } from "react";
import { createScheduleAction, updateScheduleAction, type RecurringState } from "@/app/app/recurring-actions";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

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
        <div>
          <label htmlFor="clientId" className={labelClass}>
            Client
          </label>
          <select id="clientId" name="clientId" required defaultValue={defaults?.clientId ?? ""} className={fieldClass}>
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cadence" className={labelClass}>
            How often
          </label>
          <select id="cadence" name="cadence" required defaultValue={defaults?.cadence ?? "monthly"} className={fieldClass}>
            {cadences.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nextRunAt" className={labelClass}>
            {mode === "create" ? "First invoice on" : "Next invoice on"}
          </label>
          <input id="nextRunAt" name="nextRunAt" type="date" required defaultValue={defaults?.nextRunAt ?? ""} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="dueInDays" className={labelClass}>
            Due (days after issue)
          </label>
          <input id="dueInDays" name="dueInDays" type="number" min={0} max={365} defaultValue={defaults?.dueInDays ?? "14"} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="taxRate" className={labelClass}>
            Tax rate (%)
          </label>
          <input id="taxRate" name="taxRate" inputMode="decimal" defaultValue={defaults?.taxRate ?? "0"} className={fieldClass} />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Line items</legend>
        <div className="mt-3 space-y-3">
          {lines.map((line, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-rule bg-paper p-3 sm:grid-cols-12">
              <div className="sm:col-span-6">
                <label className="text-caption text-muted" htmlFor={`desc-${index}`}>
                  Description
                </label>
                <input id={`desc-${index}`} name="line_description" required value={line.description} onChange={(e) => updateLine(index, { description: e.target.value })} className={fieldClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-caption text-muted" htmlFor={`qty-${index}`}>
                  Qty
                </label>
                <input id={`qty-${index}`} name="line_quantity" inputMode="decimal" value={line.quantity} onChange={(e) => updateLine(index, { quantity: e.target.value })} className={fieldClass} />
              </div>
              <div className="sm:col-span-3">
                <label className="text-caption text-muted" htmlFor={`price-${index}`}>
                  Unit price ($)
                </label>
                <input id={`price-${index}`} name="line_unit_price" inputMode="decimal" value={line.unitPrice} onChange={(e) => updateLine(index, { unitPrice: e.target.value })} className={fieldClass} />
              </div>
              <div className="flex items-end sm:col-span-1">
                {lines.length > 1 ? (
                  <button type="button" onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))} className={buttonClass("quiet", "md")}>
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setLines((prev) => [...prev, { description: "", quantity: "1", unitPrice: "" }])} className={`${buttonClass("secondary", "md")} mt-3`}>
          Add line
        </button>
      </fieldset>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes on every invoice (optional)
        </label>
        <textarea id="notes" name="notes" rows={3} maxLength={4000} defaultValue={defaults?.notes ?? ""} className={fieldClass} />
      </div>

      <label className="flex items-start gap-3 text-small text-ink">
        <input type="checkbox" name="autoSend" defaultChecked={defaults?.autoSend ?? false} className="mt-1" />
        <span>
          Email each invoice to the client automatically when it is generated. Off means invoices are
          created as drafts for you to review and send.
        </span>
      </label>

      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-small text-action" role="status">
          Saved.
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "lg")}>
        {pending ? "Saving" : mode === "create" ? "Create schedule" : "Save schedule"}
      </button>
    </form>
  );
}
