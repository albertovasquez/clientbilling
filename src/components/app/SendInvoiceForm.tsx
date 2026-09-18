"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/shadcn/alert";
import { Button } from "@/components/shadcn/button";

type Props = {
  invoiceId: string;
  clientId: string;
  clientEmail?: string | null;
};

/** Emails the public link to the client on file. The recipient is not editable here (decision 0004). */
export function SendInvoiceForm({ invoiceId, clientId, clientEmail }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: "POST" });
      const data = (await res.json()) as { ok?: boolean; error?: string; to?: string };
      if (!res.ok) {
        setMessage(data.error || "Could not send.");
      } else {
        setMessage(`Sent to ${data.to}.`);
        window.location.reload();
      }
    } catch {
      setMessage("Network error while sending. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (!clientEmail) {
    return (
      <p className="text-small text-ink-soft">
        This client has no email on file.{" "}
        <Link href={`/app/clients/${clientId}/edit`} className="text-primary underline-offset-4 hover:underline">
          Add one
        </Link>{" "}
        to email the invoice, or copy the public link above.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-small text-ink-soft">
        Emails the public link to <span className="font-semibold text-ink">{clientEmail}</span>.
        To send elsewhere, edit the client first.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending" : "Email invoice link"}
      </Button>
      {message ? (
        <Alert role="status">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
    </form>
  );
}
