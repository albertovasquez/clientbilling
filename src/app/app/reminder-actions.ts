"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

/** Toggle opt-in automatic reminders (decision 0015). Off by default. */
export async function setAutoRemindersAction(formData: FormData) {
  const user = await requireUser();
  const enabled = formData.get("autoReminders") === "on";
  await prisma.businessProfile.updateMany({
    where: { userId: user.id },
    data: { autoReminders: enabled },
  });
  revalidatePath("/app/settings/payments");
}
