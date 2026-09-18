"use client";

import { useActionState } from "react";
import { requestCollectAction, type CollectRequestState } from "@/app/app/collect-actions";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

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
      <div className="mt-4 space-y-3" role="status">
        <p className="text-small text-ink">
          Thanks. A person from ClientBilling will follow up within one business day to walk you through
          the CDG application. If you would rather start now, the quote form takes two minutes and CDG
          calls you back.
        </p>
        <div className="flex flex-wrap gap-3">
          <TrackedAffiliateLink href={quoteUrl} ctaPosition="card" ctaText="Get a free quote from CDG" ctaType="quote" className={buttonClass("primary", "md")}>
            Get a free quote from CDG
          </TrackedAffiliateLink>
          <TrackedAffiliateLink href={applyUrl} ctaPosition="card" ctaText="Start a CDG application" ctaType="apply" className={buttonClass("quiet", "md")}>
            Start a CDG application
          </TrackedAffiliateLink>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="mt-4 max-w-xl space-y-4">
      <div>
        <label htmlFor="businessType" className={labelClass}>
          Business type
        </label>
        <select id="businessType" name="businessType" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {businessTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="volumeBand" className={labelClass}>
          Monthly card volume
        </label>
        <select id="volumeBand" name="volumeBand" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {volumeBands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="note" className={labelClass}>
          Anything we should know (optional)
        </label>
        <input id="note" name="note" maxLength={500} className={fieldClass} placeholder="For example: we invoice monthly, average invoice $2,000" />
      </div>
      {state.error ? (
        <p className="text-small text-verdict" role="alert">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? "Sending" : "Enable card payments"}
      </button>
      <p className="text-caption text-muted">
        These are the two questions CDG asks first. Nothing is sent to CDG from this form; you apply
        with them directly. ClientBilling may earn a commission if you do; it does not change your pricing.
      </p>
    </form>
  );
}
