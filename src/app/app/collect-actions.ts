"use server";

import { z } from "zod";
import { adminEmails } from "@/lib/admin";
import { cdgBusinessTypes, cdgPlans } from "@/lib/cdg";
import { assertDatabase, prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { recordEvent } from "@/lib/events";
import { allow } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";
import { siteConfig } from "@/lib/site";

export type CollectRequestState = { error?: string; ok?: boolean };

const volumeBands = cdgPlans.map((p) => p.bandShort);

const schema = z.object({
  businessType: z.enum(cdgBusinessTypes),
  volumeBand: z.string().refine((v) => volumeBands.includes(v), "Pick a volume band"),
  note: z.string().max(500).optional(),
});

/**
 * Concierge Collect (decision 0009). Records that a merchant wants to collect
 * cards, in CDG's own labels, and tells the founder. No data goes to CDG from
 * here; the merchant uses CDG's public quote form themselves.
 */
export async function requestCollectAction(
  _prev: CollectRequestState,
  formData: FormData,
): Promise<CollectRequestState> {
  const user = await requireUser();
  try {
    assertDatabase();
  } catch {
    return { error: "Not available right now. Try again later." };
  }

  const parsed = schema.safeParse({
    businessType: formData.get("businessType"),
    volumeBand: formData.get("volumeBand"),
    note: String(formData.get("note") ?? "").trim() || undefined,
  });
  if (!parsed.success) {
    return { error: "Pick your business type and monthly card volume." };
  }
  if (!(await allow(`collect:${user.id}`, 3, 86_400))) {
    return { error: "We already have your request. We will be in touch within one business day." };
  }

  const business = await prisma.businessProfile.findUnique({ where: { userId: user.id } });
  await recordEvent({
    name: "collect_requested",
    userId: user.id,
    path: "/app/settings/payments",
    payload: { businessType: parsed.data.businessType, volumeBand: parsed.data.volumeBand, hasPayLink: Boolean(business?.payLinkUrl) },
  });

  const admins = adminEmails();
  if (admins.length > 0) {
    await sendEmail({
      to: admins[0],
      subject: `Collect request: ${business?.name ?? user.email} (${parsed.data.volumeBand})`,
      text: [
        `A merchant asked to enable card payments.`,
        "",
        `Business: ${business?.name ?? "(no profile)"}`,
        `Account email: ${user.email}`,
        `Business email: ${business?.email ?? ""}`,
        `Business type: ${parsed.data.businessType}`,
        `Monthly card volume: ${parsed.data.volumeBand}`,
        `Has a pay link already: ${business?.payLinkUrl ? "yes" : "no"}`,
        parsed.data.note ? `Note from merchant: ${parsed.data.note}` : null,
        "",
        `Follow the runbook: docs/agents/runbooks/concierge-collect.md`,
        `CDG quote form to send them: ${siteConfig.quoteUrl}`,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  }

  return { ok: true };
}
