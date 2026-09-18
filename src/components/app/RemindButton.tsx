"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";

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
      <Button type="button" variant="outline" onClick={onClick} disabled={pending}>
        {pending ? "Sending" : "Send a reminder"}
      </Button>
      {lastRemindedAt ? (
        <p className="text-caption text-muted">Last reminder sent {lastRemindedAt}.</p>
      ) : null}
      {message ? (
        <Alert role="status">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
