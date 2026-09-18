"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";

type Props = { publicId: string; merchantName: string };

/**
 * Payer card-intent signal (decision 0013). Not a payment. Records that a
 * payer would prefer to pay by card and lets the merchant know.
 */
export function CardIntentButton({ publicId, merchantName }: Props) {
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle");

  async function onClick() {
    setState("pending");
    try {
      const res = await fetch("/api/invoices/card-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 text-small text-ink-soft" role="status">
        Thanks. We let {merchantName} know. Card payment for this invoice is planned; use the
        instructions above in the meantime.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onClick}
        disabled={state === "pending"}
        className={buttonClass("secondary", "md")}
      >
        {state === "pending" ? "Sending" : `Prefer to pay by card? Let ${merchantName} know`}
      </button>
      {state === "error" ? (
        <p className="mt-2 text-caption text-muted" role="alert">
          That did not go through. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
}
