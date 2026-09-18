"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/app/app/actions";
import { deletePayment, recordPayment } from "@/lib/invoices/payments";
import { dollarsToCents } from "@/lib/money";
import { requireUser } from "@/lib/session";

/** Record a payment against an invoice (decision 0019). */
export async function recordPaymentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const invoiceId = String(formData.get("invoiceId") ?? "");
  const result = await recordPayment(
    user.id,
    invoiceId,
    {
      amountCents: dollarsToCents(String(formData.get("amount") ?? "")),
      method: String(formData.get("method") ?? "other"),
      paidOn: String(formData.get("paidOn") ?? ""),
      note: String(formData.get("note") ?? ""),
    },
    "app",
  );
  if (!result.ok) return { error: result.error };
  revalidatePath(`/app/invoices/${invoiceId}`);
  revalidatePath(`/i/${result.invoice.publicId}`);
  revalidatePath("/app");
  redirect(`/app/invoices/${invoiceId}`);
}

export async function deletePaymentAction(formData: FormData) {
  const user = await requireUser();
  const paymentId = String(formData.get("paymentId") ?? "");
  const result = await deletePayment(user.id, paymentId);
  if (!result.ok) return;
  revalidatePath(`/app/invoices/${result.invoice.id}`);
  revalidatePath(`/i/${result.invoice.publicId}`);
  revalidatePath("/app");
  redirect(`/app/invoices/${result.invoice.id}`);
}
