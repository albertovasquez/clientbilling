"use client";

import { useActionState } from "react";
import { requestCollectAction, type CollectRequestState } from "@/app/app/collect-actions";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/native-select";

type Props = {
  businessTypes: readonly string[];
  volumeBands: readonly string[];
  quoteUrl: string;
  applyUrl: string;
};

const initial: CollectRequestState = {};

/** Concierge Collect capture (decision 0009). Asks the two questions CDG asks, then hands off. */
export function CollectRequestForm({ businessTypes, volumeBands, quoteUrl, applyUrl }: Props) {
  const [state, action, pending] = useActionState(requestCollectAction, initial);

  if (state.ok) {
    return (
      <Alert role="status" className="mt-4">
        <AlertDescription>
          <p>
            Thanks. A person from ClientBilling will follow up within one business day to walk you through
            the CDG application. If you would rather start now, the quote form takes two minutes and CDG
            calls you back.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <TrackedAffiliateLink href={quoteUrl} ctaPosition="card" ctaText="Get a free quote from CDG" ctaType="quote">
                Get a free quote from CDG
              </TrackedAffiliateLink>
            </Button>
            <Button asChild variant="ghost">
              <TrackedAffiliateLink href={applyUrl} ctaPosition="card" ctaText="Start a CDG application" ctaType="apply">
                Start a CDG application
              </TrackedAffiliateLink>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={action} className="mt-4 max-w-xl space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="businessType">Business type</Label>
        <NativeSelect id="businessType" name="businessType" required className="w-full" defaultValue="">
          <NativeSelectOption value="" disabled>
            Choose one
          </NativeSelectOption>
          {businessTypes.map((t) => (
            <NativeSelectOption key={t} value={t}>
              {t}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="volumeBand">Monthly card volume</Label>
        <NativeSelect id="volumeBand" name="volumeBand" required className="w-full" defaultValue="">
          <NativeSelectOption value="" disabled>
            Choose one
          </NativeSelectOption>
          {volumeBands.map((b) => (
            <NativeSelectOption key={b} value={b}>
              {b}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="note">Anything we should know (optional)</Label>
        <Input id="note" name="note" maxLength={500} placeholder="For example: we invoice monthly, average invoice $2,000" />
      </div>
      {state.error ? (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending" : "Enable card payments"}
      </Button>
      <p className="text-caption text-muted">
        These are the two questions CDG asks first. Nothing is sent to CDG from this form; you apply
        with them directly. ClientBilling may earn a commission if you do; it does not change your pricing.
      </p>
    </form>
  );
}
