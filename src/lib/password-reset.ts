import { createHash, randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";

/**
 * Password reset tokens (decision 0006). The raw token goes in the email link;
 * only its SHA-256 is stored, in VerificationToken keyed by email. Tokens live
 * one hour and are deleted on use.
 */
const TOKEN_TTL_MS = 60 * 60 * 1000;

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Returns the raw token to embed in the link, or null when no such user exists. */
export async function createResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return null;

  const raw = randomBytes(32).toString("base64url");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
    prisma.verificationToken.create({
      data: { identifier: email, token: sha256(raw), expires: new Date(Date.now() + TOKEN_TTL_MS) },
    }),
  ]);
  return raw;
}

/** Consumes the token and sets the new password. False when invalid or expired. */
export async function resetPasswordWithToken(
  email: string,
  rawToken: string,
  newPassword: string,
): Promise<boolean> {
  const token = sha256(rawToken);
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });
  if (!record) return false;

  // Always delete a matched token, valid or expired, so it cannot be retried.
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } });
  if (record.expires.getTime() < Date.now()) return false;

  const passwordHash = await hash(newPassword, 12);
  const result = await prisma.user.updateMany({ where: { email }, data: { passwordHash } });
  return result.count === 1;
}
