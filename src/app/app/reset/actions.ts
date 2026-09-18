"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertDatabase } from "@/lib/db";
import { emailEnabled, sendEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { createResetToken, resetPasswordWithToken } from "@/lib/password-reset";
import { allow } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";

export type ResetState = { error?: string; ok?: boolean };

async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
}

/**
 * Request a reset link. The response is the same whether or not the email
 * exists (decision 0006). Without an email provider, the link is logged so
 * the owner can help by hand.
 */
export async function requestPasswordResetAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  try {
    assertDatabase();
  } catch {
    return { error: "Password reset is not available right now. Try again later." };
  }

  const parsed = z.string().email().safeParse(String(formData.get("email") ?? "").toLowerCase().trim());
  if (!parsed.success) return { error: "Enter the email on your account." };
  const email = parsed.data;

  const ip = await clientIp();
  const [ipOk, emailOk] = await Promise.all([
    allow(`reset:ip:${ip}`, 20, 3600),
    allow(`reset:email:${email}`, 5, 3600),
  ]);
  if (!ipOk || !emailOk) {
    return { error: "Too many reset requests. Wait an hour and try again." };
  }

  const raw = await createResetToken(email);
  if (raw) {
    const link = `${siteConfig.url}/app/reset/confirm?email=${encodeURIComponent(email)}&token=${raw}`;
    const text = [
      "Someone asked to reset the password for your ClientBilling invoices account.",
      "",
      `Set a new password here (the link works for one hour): ${link}`,
      "",
      "If that was not you, ignore this email. Your password has not changed.",
    ].join("\n");
    if (emailEnabled()) {
      await sendEmail({ to: email, subject: "Reset your ClientBilling password", text });
    } else {
      console.info("[password-reset] email not configured; reset link:", link);
    }
    await recordEvent({ name: "password_reset_requested", path: "/app/reset" });
  }

  return { ok: true };
}

const confirmSchema = z.object({
  email: z.string().email(),
  token: z.string().min(20).max(200),
  password: z.string().min(8).max(128),
});

export async function confirmPasswordResetAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  try {
    assertDatabase();
  } catch {
    return { error: "Password reset is not available right now. Try again later." };
  }

  const parsed = confirmSchema.safeParse({
    email: String(formData.get("email") ?? "").toLowerCase().trim(),
    token: String(formData.get("token") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: "Choose a password of at least 8 characters." };
  }
  if (parsed.data.password !== String(formData.get("confirm") ?? "")) {
    return { error: "The two passwords do not match." };
  }

  const ip = await clientIp();
  if (!(await allow(`reset-confirm:ip:${ip}`, 20, 3600))) {
    return { error: "Too many attempts. Wait an hour and try again." };
  }

  const ok = await resetPasswordWithToken(parsed.data.email, parsed.data.token, parsed.data.password);
  if (!ok) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }
  await recordEvent({ name: "password_reset_completed", path: "/app/reset/confirm" });
  redirect("/app/sign-in?reset=1");
}
