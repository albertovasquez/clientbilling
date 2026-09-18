"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";

type Props = { invoiceId: string; lastRemindedAt?: string | null; clientEmail?: string | null };

/** Sends one reminder to the client on file (decision 0015). */
export function RemindButton({ invoiceId, lastRemindedAt, clientEmail }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!clientEmail) {
    return (
      <p className="text-small text-ink-soft">Add a client email to send reminders from here.</p>
    );
  }

  async function onClick() {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/remind`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string; to?: string };
      if (!res.ok) setMessage(data.error || "Could not send the reminder.");
      else {
        setMessage(`Reminder sent to ${data.to}.`);
        window.location.reload();
      }
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={onClick} disabled={pending} className={buttonClass("secondary", "md")}>
        {pending ? "Sending" : "Send a reminder"}
      </button>
      {lastRemindedAt ? (
        <p className="text-caption text-muted">Last reminder sent {lastRemindedAt}.</p>
      ) : null}
      {message ? (
        <p className="text-small text-ink-soft" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
