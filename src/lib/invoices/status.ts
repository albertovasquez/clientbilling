import type { InvoiceStatus } from "@prisma/client";

/** Allowed status transitions. Anything not listed is rejected. */
const transitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ["sent", "paid", "void"],
  sent: ["viewed", "overdue", "paid", "void"],
  viewed: ["overdue", "paid", "void"],
  overdue: ["paid", "void"],
  paid: ["void"],
  void: [],
};

export function canTransition(from: InvoiceStatus, to: InvoiceStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

/** Statuses that still expect payment. */
export const openStatuses: InvoiceStatus[] = ["sent", "viewed", "overdue"];

/** Merchant-facing words for each status. */
export function merchantStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    draft: "Draft",
    sent: "Sent",
    viewed: "Opened",
    overdue: "Overdue",
    paid: "Paid",
    void: "Void",
  };
  return labels[status];
}

/** What a payer should read on the public invoice. Internal states are not shown. */
export function payerStatusLabel(status: InvoiceStatus, dueDate: Date | null): string {
  if (status === "paid") return "Paid";
  if (status === "void") return "Void";
  if (dueDate) {
    const due = dueDate.toISOString().slice(0, 10);
    return dueDate.getTime() < Date.now() ? `Past due since ${due}` : `Due ${due}`;
  }
  return "Due on receipt";
}
