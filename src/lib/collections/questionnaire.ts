/** Per-account questionnaire validation (decision 0020). Pure, unit tested. */
import type { CollectionEscalation, CollectionRelationship, CollectionTone } from "@prisma/client";

export const relationships: { value: CollectionRelationship; label: string }[] = [
  { value: "active", label: "Still a client" },
  { value: "ended", label: "No longer a client" },
  { value: "one_off", label: "One-off job" },
];

export const tones: { value: CollectionTone; label: string }[] = [
  { value: "warm", label: "Warm" },
  { value: "neutral", label: "Neutral" },
  { value: "firm", label: "Firm" },
];

export const escalations: { value: CollectionEscalation; label: string }[] = [
  { value: "owner_follow_up", label: "Hand it to me to follow up personally" },
  { value: "pause", label: "Pause and check with me" },
  { value: "write_off", label: "Stop and write it off" },
];

export type QuestionnaireInput = {
  relationship: CollectionRelationship;
  disputed: boolean;
  disputeNotes: string | null;
  minSettlementPct: number;
  maxPlanMonths: number;
  tone: CollectionTone;
  escalation: CollectionEscalation;
  escalationNotes: string | null;
};

export type QuestionnaireResult = { ok: true; data: QuestionnaireInput } | { ok: false; error: string };

type Getter = (key: string) => string | null;

export function parseQuestionnaire(get: Getter): QuestionnaireResult {
  const relationship = get("relationship") as CollectionRelationship;
  if (!relationships.some((r) => r.value === relationship)) return { ok: false, error: "Pick the relationship." };

  const disputedRaw = get("disputed");
  if (disputedRaw !== "yes" && disputedRaw !== "no") return { ok: false, error: "Say whether the client disputes the debt." };
  const disputed = disputedRaw === "yes";
  const disputeNotes = (get("disputeNotes") ?? "").trim().slice(0, 2000) || null;
  if (disputed && !disputeNotes) return { ok: false, error: "Describe the dispute so a person can handle it." };

  const minSettlementPct = Number(get("minSettlementPct"));
  if (!Number.isInteger(minSettlementPct) || minSettlementPct < 1 || minSettlementPct > 100) {
    return { ok: false, error: "Minimum settlement must be a whole percent from 1 to 100." };
  }

  const maxPlanMonths = Number(get("maxPlanMonths"));
  if (!Number.isInteger(maxPlanMonths) || maxPlanMonths < 0 || maxPlanMonths > 36) {
    return { ok: false, error: "Longest plan must be 0 to 36 months (0 means no plans)." };
  }

  const tone = get("tone") as CollectionTone;
  if (!tones.some((t) => t.value === tone)) return { ok: false, error: "Pick a tone." };

  const escalation = get("escalation") as CollectionEscalation;
  if (!escalations.some((e) => e.value === escalation)) return { ok: false, error: "Pick what happens when there is no reply." };

  return {
    ok: true,
    data: {
      relationship,
      disputed,
      disputeNotes: disputed ? disputeNotes : null,
      minSettlementPct,
      maxPlanMonths,
      tone,
      escalation,
      escalationNotes: (get("escalationNotes") ?? "").trim().slice(0, 2000) || null,
    },
  };
}

/** Disputed accounts never become ready for the agent; a person handles them. */
export function statusAfterQuestionnaire(data: QuestionnaireInput): "ready" | "paused" {
  return data.disputed ? "paused" : "ready";
}
