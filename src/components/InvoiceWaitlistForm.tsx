"use client";

import type { FormEvent } from "react";
import { buttonClass } from "@/components/ui";
import { trackInvoiceWaitlistSignup } from "@/lib/affiliate-track";
import { siteConfig } from "@/lib/site";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/alberto@clientbilling.com";
const THANKS_URL = `${siteConfig.url}/invoices/thanks`;

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-rule-strong bg-paper px-3 py-2.5 text-small text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

const labelClass = "block text-small font-semibold text-ink";

/**
 * Fake-door waitlist: validates email client-side, fires analytics, then POSTs
 * to FormSubmit so Alberto receives the signup by email.
 */
export function InvoiceWaitlistForm() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement | null;
    const email = emailInput?.value?.trim() ?? "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    const domain = email.includes("@") ? email.split("@")[1]?.toLowerCase() : undefined;
    trackInvoiceWaitlistSignup({
      page: window.location.pathname,
      email_domain: domain,
    });
  }

  return (
    <form
      action={FORMSUBMIT_ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      className="mt-6 space-y-4"
      noValidate={false}
    >
      <input type="hidden" name="_next" value={THANKS_URL} />
      <input type="hidden" name="_subject" value="ClientBilling invoice early access" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      {/* Honeypot: leave empty. FormSubmit ignores real submissions that fill it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <label htmlFor="invoice-waitlist-name" className={labelClass}>
          Name <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="invoice-waitlist-name"
          name="name"
          type="text"
          autoComplete="name"
          className={fieldClass}
          placeholder="Alex Merchant"
        />
      </div>

      <div>
        <label htmlFor="invoice-waitlist-email" className={labelClass}>
          Work email
        </label>
        <input
          id="invoice-waitlist-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@yourbusiness.com"
        />
      </div>

      <div>
        <label htmlFor="invoice-waitlist-note" className={labelClass}>
          What would you invoice for?{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="invoice-waitlist-note"
          name="use_case"
          rows={3}
          className={fieldClass}
          placeholder="Client retainers, project milestones, product orders…"
        />
      </div>

      <button type="submit" className={buttonClass("primary", "lg")}>
        Join early access
      </button>

      <p className="text-caption text-muted">
        Invoices are not live yet. We will email you when create and send opens.
        No card data is collected on this form.
      </p>
    </form>
  );
}
