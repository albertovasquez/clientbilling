"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";
import { fieldClass, labelClass } from "@/components/app/form-styles";

export function SendInvoiceForm({
  invoiceId,
  clientEmail,
}: {
  invoiceId: string;
  clientEmail?: string | null;
}) {
  const [to, setTo] = useState(clientEmail ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; mode?: string };
      if (!res.ok) {
        setMessage(data.error || "Could not send.");
      } else if (data.mode === "resend") {
        setMessage("Email sent via Resend.");
      } else {
        setMessage(
          "Email provider not configured. Use Copy public link, or set RESEND_API_KEY.",
        );
      }
    } catch {
      setMessage("Network error while sending.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label htmlFor="send-to" className={labelClass}>
          Send to
        </label>
        <input
          id="send-to"
          type="email"
          required
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={fieldClass}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {pending ? "Sending…" : "Email invoice link"}
      </button>
      {message ? <p className="text-small text-ink-soft">{message}</p> : null}
    </form>
  );
}
