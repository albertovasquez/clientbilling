"use client";

import { useActionState } from "react";
import { recordPaymentAction } from "@/app/app/payment-actions";
import type { ActionState } from "@/app/app/actions";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";

const initial: ActionState = {};

type Props = {
  invoiceId: string;
  balanceDollars: string;
  today: string;
  methods: { value: string; label: string }[];
};

/** Record a payment received outside ClientBilling (decision 0019). */
export function PaymentForm({ invoiceId, balanceDollars, today, methods }: Props) {
  const [state, action, pending] = useActionState(recordPaymentAction, initial);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input id="amount" name="amount" inputMode="decimal" required defaultValue={balanceDollars} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="method">Method</Label>
          <NativeSelect id="method" name="method" defaultValue="bank_transfer" className="w-full">
            {methods.map((m) => (
              <NativeSelectOption key={m.value} value={m.value}>
                {m.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="paidOn">Received on</Label>
          <Input id="paidOn" name="paidOn" type="date" required defaultValue={today} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" name="note" maxLength={500} placeholder="Check 1042, deposit for phase 1" />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Recording" : "Record payment"}
      </Button>
    </form>
  );
}
