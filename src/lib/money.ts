/** Format integer cents as USD display (e.g. 1250 -> "$12.50"). */
export function formatCents(cents: number, currency = "USD"): string {
  const value = (cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function dollarsToCents(raw: string | number): number {
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[$,\s]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function percentToBps(raw: string | number): number {
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/%/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export function bpsToPercentLabel(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/** Form value for a tax rate input (no % suffix). Trailing zeros trimmed when whole. */
export function bpsToPercentInput(bps: number): string {
  const n = bps / 100;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

/** YYYY-MM-DD due date that is `days` UTC calendar days after today. */
export function dueDateIsoFromDays(days: number, now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days));
  return d.toISOString().slice(0, 10);
}

/** Quantities are stored as Decimal(12,4). Round before computing so display matches storage. */
export function normalizeQuantity(raw: string | number): number {
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[,\s]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 10_000) / 10_000;
}

export function lineTotalCents(quantity: number | string, unitPriceCents: number): number {
  return Math.round(normalizeQuantity(quantity) * unitPriceCents);
}

export function computeInvoiceTotals(
  lines: { quantity: number; unitPriceCents: number }[],
  taxRateBps: number,
): { subtotalCents: number; taxCents: number; totalCents: number } {
  const subtotalCents = lines.reduce((sum, line) => {
    return sum + lineTotalCents(line.quantity, line.unitPriceCents);
  }, 0);
  const taxCents = Math.round((subtotalCents * taxRateBps) / 10_000);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
  };
}
