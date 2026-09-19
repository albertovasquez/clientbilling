"use client";

import { useId, useState } from "react";
import { CopyLabel } from "@/components/ui";
import { formatCheckedDate } from "@/components/ui/SourceNote";
import { AMOUNT_MAX_CENTS, AMOUNT_MIN_CENTS, exampleInvoice, parseAmountInput } from "@/lib/example-invoice";
import { sendBrowserEvent } from "@/lib/browser-events";
import { formatCents } from "@/lib/money";
import { paymentCosts, type PaymentCost, type RateSnapshot } from "@/lib/payment-costs";

type Props = {
  snapshots: RateSnapshot[];
  cardCheckedAt: string;
};

function amountText(cents: number): string {
  return formatCents(cents).replace(/^\$/, "");
}

function receive(row: PaymentCost): { text: string; known: boolean } {
  if (row.netCents === null) {
    return { text: row.variableComponents.map((v) => v.label).join(", "), known: false };
  }
  return { text: formatCents(row.netCents), known: true };
}

/**
 * The file copy of the example invoice on the homepage (ticket #44). Renders
 * on the server with the default amount; the amount input recalculates the
 * cost table from the calculator in the browser.
 */
export function HeroInvoice({ snapshots, cardCheckedAt }: Props) {
  const [amountCents, setAmountCents] = useState<number>(exampleInvoice.amountCents);
  const [text, setText] = useState(amountText(exampleInvoice.amountCents));
  const [invalid, setInvalid] = useState(false);
  const [reported, setReported] = useState(false);
  const inputId = useId();
  const hintId = useId();
  const rows = paymentCosts(amountCents, snapshots);

  function onChange(value: string) {
    setText(value);
    const cents = parseAmountInput(value);
    if (cents === null) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setAmountCents(cents);
    if (!reported) {
      setReported(true);
      sendBrowserEvent("cost_table_edit");
    }
  }

  function onBlur() {
    if (!invalid) setText(amountText(amountCents));
  }

  return (
    <div className="relative mb-3 mr-3">
      <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded bg-carbon-tint" />
      <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded bg-carbon-tint opacity-60" />
      <article
        aria-label="Example invoice, file copy"
        className="relative flex flex-col gap-4 rounded border border-rule bg-sheet p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-display-sm font-semibold text-ink">
              Invoice <span className="font-mono font-medium">#{exampleInvoice.number}</span>
            </p>
            <p className="text-caption text-muted">
              {exampleInvoice.from} to {exampleInvoice.to}
            </p>
          </div>
          <CopyLabel kind="file" />
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-rule pt-3">
          <label htmlFor={inputId} className="text-small text-muted">
            Total due
          </label>
          <span className="flex items-baseline gap-1 font-mono text-display-md font-medium tracking-tight text-ink">
            <span aria-hidden>$</span>
            <input
              id={inputId}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={text}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              aria-invalid={invalid || undefined}
              aria-describedby={hintId}
              style={{ width: `${Math.min(Math.max(text.length, 4) + 1, 16)}ch` }}
              className="min-w-0 rounded-sm border-b border-dashed border-rule-strong bg-transparent text-right font-mono text-display-md font-medium tracking-tight text-ink focus-visible:border-solid focus-visible:border-carbon focus-visible:outline-none"
            />
          </span>
          <p id={hintId} className={`w-full text-caption ${invalid ? "text-due" : "text-muted"}`}>
            {invalid
              ? `Enter an amount between ${formatCents(AMOUNT_MIN_CENTS)} and ${formatCents(AMOUNT_MAX_CENTS)}.`
              : "Change the amount to see what each way of getting paid would cost."}
          </p>
        </div>

        <table className="w-full border-collapse text-small">
          <caption className="pb-2 text-left text-small font-semibold text-ink">What getting paid costs</caption>
          <thead>
            <tr className="border-t border-rule-strong font-mono text-[0.6875rem] font-normal tracking-wide text-muted">
              <th scope="col" className="py-2 text-left font-normal">
                Rail
              </th>
              <th scope="col" className="py-2 text-right font-normal">
                Fee
              </th>
              <th scope="col" className="hidden py-2 text-right font-normal sm:table-cell">
                You receive
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const net = receive(row);
              const bank = row.rail === "bank_transfer";
              const rowTint = bank ? "bg-cleared-tint" : "";
              return (
                <tr key={row.rateId} className={`border-t border-rule ${rowTint}`}>
                  <th scope="row" className={`py-2 pr-3 text-left font-normal text-ink ${bank ? "pl-2" : ""}`}>
                    <span className="whitespace-nowrap">{bank ? "ACH" : row.label}</span>
                    <span className="block text-caption text-muted">
                      {bank ? `your bank, example ${formatCents(row.knownFeeCents)}` : row.formula}
                    </span>
                  </th>
                  <td className="py-2 pl-3 text-right font-mono text-ink">
                    <span className="whitespace-nowrap">{formatCents(row.knownFeeCents)}</span>
                    {row.netCents === null ? <> + {row.variableComponents.map((v) => v.type).join(", ")}</> : null}
                    <span className={`block text-caption sm:hidden ${net.known && bank ? "font-medium text-cleared" : "text-muted"}`}>
                      {net.known ? `net ${net.text}` : net.text}
                    </span>
                  </td>
                  <td
                    className={`hidden py-2 pl-3 text-right font-mono sm:table-cell ${
                      !net.known ? "text-muted" : bank ? "whitespace-nowrap font-semibold text-cleared" : "whitespace-nowrap text-ink"
                    }`}
                  >
                    {net.text}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p className="text-caption text-muted">
          Card rates: CDG Commerce published online pricing, checked {formatCheckedDate(cardCheckedAt)}. ACH: an
          example fee of {formatCents(exampleInvoice.achFeeCents)}; your own bank&apos;s fee replaces it.
          Interchange varies by card and is not estimated.
        </p>
      </article>
    </div>
  );
}
