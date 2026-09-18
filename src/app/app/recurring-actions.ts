"use server";

import type { RecurringCadence } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { runSchedule } from "@/lib/invoices/recurring";
import { parseDueDate, parseLines } from "@/lib/invoices/service";
import { percentToBps } from "@/lib/money";
import { requireBusiness, requireUser } from "@/lib/session";

export type RecurringState = { error?: string; ok?: boolean };

const cadenceValues: RecurringCadence[] = ["weekly", "monthly", "quarterly", "yearly"];

type Parsed =
  | { ok: true; data: { clientId: string; cadence: RecurringCadence; nextRunAt: Date; dueInDays: number; taxRateBps: number; notes: string | null; linesJson: string; autoSend: boolean } }
  | { ok: false; error: string };

async function parseForm(userId: string, formData: FormData): Promise<Parsed> {
  const clientId = String(formData.get("clientId") ?? "").trim();
  const client = clientId ? await prisma.client.findFirst({ where: { id: clientId, userId }, select: { id: true } }) : null;
  if (!client) return { ok: false, error: "Pick a client. Add one under Clients first if needed." };

  const cadence = String(formData.get("cadence") ?? "monthly") as RecurringCadence;
  if (!cadenceValues.includes(cadence)) return { ok: false, error: "Pick how often to bill." };

  const nextRunAt = parseDueDate(String(formData.get("nextRunAt") ?? ""));
  if (!nextRunAt) return { ok: false, error: "Pick the first billing date." };

  const dueInDays = Number(formData.get("dueInDays") ?? 14);
  if (!Number.isInteger(dueInDays) || dueInDays < 0 || dueInDays > 365) return { ok: false, error: "Due in days must be between 0 and 365." };

  const taxRateBps = percentToBps(String(formData.get("taxRate") ?? "0"));
  if (taxRateBps < 0 || taxRateBps > 10_000) return { ok: false, error: "Tax rate must be between 0% and 100%." };

  const descriptions = formData.getAll("line_description").map(String);
  const quantities = formData.getAll("line_quantity").map(String);
  const prices = formData.getAll("line_unit_price").map(String);
  const lines = parseLines(descriptions.map((description, i) => ({ description, quantity: quantities[i] ?? "1", unitPrice: prices[i] ?? "0" })));
  if (!lines.ok) return { ok: false, error: lines.error };

  return {
    ok: true,
    data: {
      clientId,
      cadence,
      nextRunAt,
      dueInDays,
      taxRateBps,
      notes: String(formData.get("notes") ?? "").trim().slice(0, 4000) || null,
      linesJson: JSON.stringify(lines.lines),
      autoSend: formData.get("autoSend") === "on",
    },
  };
}

export async function createScheduleAction(_prev: RecurringState, formData: FormData): Promise<RecurringState> {
  const user = await requireUser();
  await requireBusiness(user.id);
  const parsed = await parseForm(user.id, formData);
  if (!parsed.ok) return { error: parsed.error };
  const schedule = await prisma.recurringSchedule.create({ data: { userId: user.id, ...parsed.data } });
  revalidatePath("/app/recurring");
  redirect(`/app/recurring/${schedule.id}`);
}

export async function updateScheduleAction(_prev: RecurringState, formData: FormData): Promise<RecurringState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.recurringSchedule.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!existing) return { error: "Schedule not found." };
  const parsed = await parseForm(user.id, formData);
  if (!parsed.ok) return { error: parsed.error };
  await prisma.recurringSchedule.update({ where: { id }, data: parsed.data });
  revalidatePath("/app/recurring");
  revalidatePath(`/app/recurring/${id}`);
  return { ok: true };
}

export async function toggleScheduleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.recurringSchedule.findFirst({ where: { id, userId: user.id }, select: { active: true } });
  if (!existing) return;
  await prisma.recurringSchedule.update({ where: { id }, data: { active: !existing.active } });
  revalidatePath("/app/recurring");
  revalidatePath(`/app/recurring/${id}`);
}

export async function deleteScheduleAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.recurringSchedule.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/app/recurring");
  redirect("/app/recurring");
}

/** Generate the next invoice now instead of waiting for the daily run. */
export async function runScheduleNowAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.recurringSchedule.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!existing) return;
  const result = await runSchedule(id);
  revalidatePath("/app");
  revalidatePath("/app/recurring");
  revalidatePath(`/app/recurring/${id}`);
  if (result.invoiceId) redirect(`/app/invoices/${result.invoiceId}`);
  redirect(`/app/recurring/${id}?error=run`);
}
