import { describe, expect, it } from "vitest";
import { parseQuestionnaire, statusAfterQuestionnaire } from "./questionnaire";

const base: Record<string, string> = {
  relationship: "ended",
  disputed: "no",
  minSettlementPct: "70",
  maxPlanMonths: "6",
  tone: "warm",
  escalation: "owner_follow_up",
};
const getter = (o: Record<string, string>) => (k: string) => o[k] ?? null;

describe("parseQuestionnaire", () => {
  it("accepts a complete answer set", () => {
    const r = parseQuestionnaire(getter(base));
    expect(r.ok).toBe(true);
    if (r.ok) expect(statusAfterQuestionnaire(r.data)).toBe("ready");
  });
  it("requires notes for a dispute and pauses the account", () => {
    expect(parseQuestionnaire(getter({ ...base, disputed: "yes" })).ok).toBe(false);
    const r = parseQuestionnaire(getter({ ...base, disputed: "yes", disputeNotes: "Says work was late" }));
    expect(r.ok && statusAfterQuestionnaire(r.data)).toBe("paused");
  });
  it("bounds settlement and plan length", () => {
    expect(parseQuestionnaire(getter({ ...base, minSettlementPct: "0" })).ok).toBe(false);
    expect(parseQuestionnaire(getter({ ...base, minSettlementPct: "101" })).ok).toBe(false);
    expect(parseQuestionnaire(getter({ ...base, maxPlanMonths: "37" })).ok).toBe(false);
    expect(parseQuestionnaire(getter({ ...base, maxPlanMonths: "0" })).ok).toBe(true);
  });
  it("rejects unknown enum values", () => {
    expect(parseQuestionnaire(getter({ ...base, tone: "angry" })).ok).toBe(false);
    expect(parseQuestionnaire(getter({ ...base, relationship: "x" })).ok).toBe(false);
  });
});
