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

export function computeInvoiceTotals(
  lines: { quantity: number; unitPriceCents: number }[],
  taxRateBps: number,
): { subtotalCents: number; taxCents: number; totalCents: number } {
  const subtotalCents = lines.reduce((sum, line) => {
    return sum + Math.round(line.quantity * line.unitPriceCents);
  }, 0);
  const taxCents = Math.round((subtotalCents * taxRateBps) / 10_000);
  return {
    subtotalCents,
    taxCents,
    totalCents: subtotalCents + taxCents,
  };
}
