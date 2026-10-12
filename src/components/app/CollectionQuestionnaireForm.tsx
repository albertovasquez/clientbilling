"use client";

import { useActionState } from "react";
import { saveQuestionnaireAction, type QuestionnaireState } from "@/app/app/collections-actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";
import { Textarea } from "@/components/shadcn/textarea";

type Option = { value: string; label: string };

type Props = {
  accountId: string;
  relationships: Option[];
  tones: Option[];
  escalations: Option[];
  defaults: {
    relationship?: string;
    disputed?: boolean | null;
    disputeNotes?: string;
    minSettlementPct?: string;
    maxPlanMonths?: string;
    tone?: string;
    escalation?: string;
    escalationNotes?: string;
  };
};

const initial: QuestionnaireState = {};

function Select({ name, label, options, value }: { name: string; label: string; options: Option[]; value?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <NativeSelect id={name} name={name} required defaultValue={value ?? ""} className="w-full">
        <NativeSelectOption value="" disabled>
          Choose one
        </NativeSelectOption>
        {options.map((o) => (
          <NativeSelectOption key={o.value} value={o.value}>
            {o.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

export function CollectionQuestionnaireForm({ accountId, relationships, tones, escalations, defaults }: Props) {
  const [state, formAction, pending] = useActionState(saveQuestionnaireAction, initial);
  const disputed = defaults.disputed === true ? "yes" : defaults.disputed === false ? "no" : "";

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={accountId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select name="relationship" label="Relationship" options={relationships} value={defaults.relationship} />
        <Select
          name="disputed"
          label="Does the client dispute this debt?"
          options={[
            { value: "no", label: "No" },
            { value: "yes", label: "Yes" },
          ]}
          value={disputed}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="disputeNotes">If disputed, what is the disagreement?</Label>
        <Textarea id="disputeNotes" name="disputeNotes" rows={2} defaultValue={defaults.disputeNotes} />
        <p className="text-small text-ink-soft">Disputed accounts are paused for you to handle. The assistant will not negotiate them.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="minSettlementPct">Minimum acceptable settlement (% of balance)</Label>
          <Input id="minSettlementPct" name="minSettlementPct" type="number" min={1} max={100} required defaultValue={defaults.minSettlementPct ?? "100"} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="maxPlanMonths">Longest payment plan (months, 0 for none)</Label>
          <Input id="maxPlanMonths" name="maxPlanMonths" type="number" min={0} max={36} required defaultValue={defaults.maxPlanMonths ?? "3"} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select name="tone" label="Tone" options={tones} value={defaults.tone} />
        <Select name="escalation" label="If there is no reply" options={escalations} value={defaults.escalation} />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="escalationNotes">Anything the assistant should know (optional)</Label>
        <Textarea id="escalationNotes" name="escalationNotes" rows={2} defaultValue={defaults.escalationNotes} />
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.ok ? (
        <Alert>
          <AlertDescription>Saved.</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving" : "Save answers"}
      </Button>
    </form>
  );
}
