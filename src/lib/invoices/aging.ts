import { balanceCents } from "@/lib/invoices/payments";

/**
 * Outstanding aging buckets for the dashboard (roadmap P0/P1).
 * Balances are net of partial payments. Invoices without a due date sit in
 * "current". Day boundaries use UTC calendar days so the buckets match the
 * overdue cron's date comparison style.
 */

export type AgingInvoice = {
  dueDate: Date | null;
  totalCents: number;
  paidCents: number;
};

export type AgingBucket = {
  balanceCents: number;
  count: number;
};

export type AgingBuckets = {
  current: AgingBucket;
  d1to30: AgingBucket;
  d31to60: AgingBucket;
  d60plus: AgingBucket;
};

function emptyBucket(): AgingBucket {
  return { balanceCents: 0, count: 0 };
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Whole UTC days past the due date. Zero or negative means current / not yet due. */
export function daysPastDue(dueDate: Date, now: Date): number {
  const due = startOfUtcDay(dueDate);
  const today = startOfUtcDay(now);
  return Math.floor((today.getTime() - due.getTime()) / 86_400_000);
}

export function agingBuckets(invoices: AgingInvoice[], now = new Date()): AgingBuckets {
  const buckets: AgingBuckets = {
    current: emptyBucket(),
    d1to30: emptyBucket(),
    d31to60: emptyBucket(),
    d60plus: emptyBucket(),
  };

  for (const invoice of invoices) {
    const balance = balanceCents(invoice);
    if (balance <= 0) continue;

    let key: keyof AgingBuckets = "current";
    if (invoice.dueDate) {
      const days = daysPastDue(invoice.dueDate, now);
      if (days >= 61) key = "d60plus";
      else if (days >= 31) key = "d31to60";
      else if (days >= 1) key = "d1to30";
    }

    buckets[key].balanceCents += balance;
    buckets[key].count += 1;
  }

  return buckets;
}
