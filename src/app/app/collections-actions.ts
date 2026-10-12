"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { importAccountsCsv, type RowError } from "@/lib/collections/csv";
import { parseQuestionnaire, statusAfterQuestionnaire } from "@/lib/collections/questionnaire";
import { requireUser } from "@/lib/session";

const MAX_FILE_BYTES = 1_000_000;

export type ImportState = { error?: string; rowErrors?: RowError[]; imported?: number };
export type QuestionnaireState = { error?: string; ok?: boolean };

/**
 * Import debtor accounts from CSV (decision 0020). Requires the business-debt
 * confirmation. Nothing is sent to anyone; accounts land in needs_review.
 */
export async function importAccountsAction(_prev: ImportState, formData: FormData): Promise<ImportState> {
  const user = await requireUser();

  if (formData.get("businessDebtAttest") !== "on") {
    return { error: "Confirm that every account is a business debt owed by a company. Consumer debts are not supported." };
  }

  const file = formData.get("file");
  let text = String(formData.get("csvText") ?? "");
  let fileName: string | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) return { error: "The file is larger than 1 MB. Split it and import in parts." };
    text = await file.text();
    fileName = file.name.slice(0, 200);
  }
  if (!text.trim()) return { error: "Choose a CSV file or paste CSV rows." };

  const { accounts, errors } = importAccountsCsv(text);
  if (accounts.length === 0) return { error: "No accounts could be imported.", rowErrors: errors };

  await prisma.$transaction(async (tx) => {
    const imp = await tx.collectionImport.create({
      data: { userId: user.id, fileName, rowCount: accounts.length, businessDebtAttest: true, attestedAt: new Date() },
    });
    await tx.collectionAccount.createMany({
      data: accounts.map((a) => ({ ...a, userId: user.id, importId: imp.id })),
    });
  });

  revalidatePath("/app/collections");
  return { imported: accounts.length, rowErrors: errors };
}

export async function saveQuestionnaireAction(_prev: QuestionnaireState, formData: FormData): Promise<QuestionnaireState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const account = await prisma.collectionAccount.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!account) return { error: "Account not found." };

  const parsed = parseQuestionnaire((k) => {
    const v = formData.get(k);
    return v === null ? null : String(v);
  });
  if (!parsed.ok) return { error: parsed.error };

  await prisma.collectionAccount.update({
    where: { id: account.id },
    data: { ...parsed.data, status: statusAfterQuestionnaire(parsed.data), questionnaireDoneAt: new Date() },
  });
  revalidatePath("/app/collections");
  revalidatePath(`/app/collections/${account.id}`);
  return { ok: true };
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  await prisma.collectionAccount.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/app/collections");
  redirect("/app/collections");
}
