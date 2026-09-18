"use client";

import { buttonClass } from "@/components/ui";

type Props = { href: string; merchantName: string };

/**
 * Merchant-provided pay link (decision 0014). Opens the merchant's own hosted
 * payment page. ClientBilling adds nothing to the URL and sees no payment.
 */
export function PayLinkButton({ href, merchantName }: Props) {
  function onClick() {
    try {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "payer_pay_link_click", path: window.location.pathname }),
        keepalive: true,
      }).catch(() => undefined);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mt-4">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={buttonClass("primary", "lg")}
      >
        Pay online
      </a>
      <p className="mt-2 text-caption text-muted">
        Opens {merchantName}&apos;s payment page in a new tab. Card details are entered there, never on
        ClientBilling. {merchantName} will mark this invoice paid once payment arrives.
      </p>
    </div>
  );
}
