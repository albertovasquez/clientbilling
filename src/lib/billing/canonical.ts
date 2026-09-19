/**
 * Canonical JSON for billing events and invoice versions (decision 0025).
 * UTF-8, sorted keys, integer cents only at the call site, UTC timestamps,
 * dates as YYYY-MM-DD, explicit null versus omitted left to the caller.
 */

export const BILLING_SCHEMA_VERSION = "1";

/** Stable JSON: sorted object keys, no undefined, arrays keep order. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortValue);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    const v = obj[key];
    if (v === undefined) continue;
    out[key] = sortValue(v);
  }
  return out;
}

export function utcDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function utcTimestamp(d: Date): string {
  return d.toISOString();
}
