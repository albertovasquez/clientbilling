"use client";

import { useId, useState } from "react";
import { CopyLabel, formatCheckedDate } from "@/components/ui";
import { AMOUNT_MAX_CENTS, AMOUNT_MIN_CENTS, exampleInvoice, parseAmountInput } from "@/lib/example-invoice";
import { sendBrowserEvent } from "@/lib/browser-events";
import { formatCents } from "@/lib/money";
import { paymentCosts, type PaymentCost, type RateSnapshot } from "@/lib/payment-costs";

type Props = {
  snapshots: RateSnapshot[];
};

function amountText(cents: number): string {
  return formatCents(cents).replace(/^\$/, "");
}

/**
 * Swaps hyphens for non-breaking ones (U+2011), so a wrapped rail name breaks
 * at its space rather than mid-word. The glyph is the same; only the break
 * opportunity changes. Display only: the labels in payment-costs.ts stay ASCII
 * because tests match them and the API will serialize them. The tradeoff is
 * that copied text and find-in-page carry U+2011, so they will not match a
 * typed "interchange-plus".
 */
function nonBreakingHyphens(text: string): string {
  return text.replace(/-/g, "‑");
}

/** How one cost row reads on the table: the bank row is the highlighted, cheapest rail. */
function rowView(row: PaymentCost) {
  const bank = row.rail === "bank_transfer";
  const unknown = row.variableComponents.map((v) => v.type).join(", ");
  const net = row.netCents === null ? null : formatCents(row.netCents);
  return {
    key: row.rateId,
    label: bank ? "ACH" : row.label,
    detail: bank ? `your bank, example ${formatCents(row.knownFeeCents)}` : row.formula,
    fee: formatCents(row.knownFeeCents),
    feeSuffix: unknown ? ` + ${unknown}` : "",
    receive: net ?? row.variableComponents.map((v) => v.label).join(", "),
    receiveShort: net ? `net ${net}` : row.variableComponents.map((v) => v.label).join(", "),
    rowClass: bank ? "bg-cleared-tint" : "",
    labelClass: bank ? "pl-2" : "",
    receiveClass: net === null ? "text-muted" : bank ? "whitespace-nowrap font-semibold text-cleared" : "whitespace-nowrap text-ink",
    receiveShortClass: net && bank ? "font-medium text-cleared" : "text-muted",
  };
}

/**
 * The file copy of the example invoice on the homepage (ticket #44). Renders
 * on the server with the default amount; the amount input recalculates the
 * cost table from the calculator in the browser.
 */
export function HeroInvoice({ snapshots }: Props) {
  const [amountCents, setAmountCents] = useState<number>(exampleInvoice.amountCents);
  const [text, setText] = useState(amountText(exampleInvoice.amountCents));
  const [invalid, setInvalid] = useState(false);
  const [editEventSent, setEditEventSent] = useState(false);
  const inputId = useId();
  const hintId = useId();
  const rows = paymentCosts(amountCents, snapshots).map(rowView);
  const cardCheckedAt = snapshots.find((s) => s.rail === "card")?.source.checkedAt;

  function onChange(value: string) {
    setText(value);
    const cents = parseAmountInput(value);
    if (cents === null) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setAmountCents(cents);
    // One cost_table_edit per page view: the funnel counts visitors who touched the table, not keystrokes.
    if (!editEventSent) {
      setEditEventSent(true);
      sendBrowserEvent("cost_table_edit");
    }
  }

  function onBlur() {
    if (!invalid) setText(amountText(amountCents));
  }

  return (
    <div className="relative mb-3 mr-3 min-w-0">
      <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded bg-carbon-tint" />
      <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded bg-carbon-tint opacity-60" />
      <article
        aria-label="Example invoice, file copy"
        className="relative flex flex-col gap-4 rounded border border-rule bg-sheet p-4 sm:p-7"
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
            <tr className="border-t border-rule-strong font-mono text-caption font-normal text-muted">
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
            {rows.map((row) => (
              <tr key={row.key} className={`border-t border-rule ${row.rowClass}`}>
                <th scope="row" className={`py-2 pr-3 text-left font-normal text-ink ${row.labelClass}`}>
                  {/*
                    Two guards, for two different widths. From sm up the card
                    has room, so the name stays on one line. Below sm it must
                    wrap, and the non-breaking hyphen makes it wrap at the
                    space: "Card, interchange-" above "plus" reads as a typo
                    rather than a rail name. The fee formula keeps nowrap at
                    every width: it is a value from the record and must not
                    break across lines.
                  */}
                  <span className="sm:whitespace-nowrap">{nonBreakingHyphens(row.label)}</span>
                  <span className="block text-caption text-muted">{row.detail}</span>
                </th>
                <td className="py-2 pl-3 text-right font-mono text-ink">
                  <span className="whitespace-nowrap">{row.fee}</span>
                  {row.feeSuffix}
                  <span className={`block text-caption sm:hidden ${row.receiveShortClass}`}>{row.receiveShort}</span>
                </td>
                <td className={`hidden py-2 pl-3 text-right font-mono sm:table-cell ${row.receiveClass}`}>
                  {row.receive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-caption text-muted">
          Card rates: CDG Commerce published online pricing
          {cardCheckedAt ? `, checked ${formatCheckedDate(cardCheckedAt)}` : ""}. ACH: an example fee of{" "}
          {formatCents(exampleInvoice.achFeeCents)}; your own bank&apos;s fee replaces it. Interchange varies by
          card and is not estimated.
        </p>
      </article>
    </div>
  );
}
