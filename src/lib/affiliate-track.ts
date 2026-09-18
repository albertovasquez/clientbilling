import type { CtaPosition, CtaType } from "@/lib/cta";

export type AffiliateClickPayload = {
  page: string;
  article_slug?: string;
  cta_position: CtaPosition;
  cta_text: string;
  cta_type: CtaType;
};

/**
 * Affiliate click instrumentation. Fires a DOM event and pushes to a
 * dataLayer so a tag manager or analytics tool can pick clicks up later
 * without page changes. No analytics script is loaded by the site itself.
 */
export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(
      new CustomEvent("affiliate_cta_click", { detail: payload }),
    );
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "affiliate_cta_click", ...payload });
  } catch {
    /* ignore */
  }
}

export type CalculatorCompletePayload = {
  page: string;
  processor: string;
  channel: string;
  volume_band: string;
  volume: number;
};

/** Fires when the fee calculator has enough inputs to show a result. */
export function trackCalculatorComplete(
  payload: CalculatorCompletePayload,
): void {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(
      new CustomEvent("calculator_complete", { detail: payload }),
    );
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "calculator_complete", ...payload });
  } catch {
    /* ignore */
  }
}

export type InvoiceFakeDoorClickPayload = {
  page: string;
  cta_text: string;
};

/** Homepage (or other) CTA that opens the invoice fake-door landing. */
export function trackInvoiceFakeDoorClick(
  payload: InvoiceFakeDoorClickPayload,
): void {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(
      new CustomEvent("invoice_fake_door_click", { detail: payload }),
    );
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "invoice_fake_door_click", ...payload });
  } catch {
    /* ignore */
  }
}

export type InvoiceWaitlistSignupPayload = {
  page: string;
  email_domain?: string;
};

/** Fires just before the waitlist form submits (FormSubmit or API). */
export function trackInvoiceWaitlistSignup(
  payload: InvoiceWaitlistSignupPayload,
): void {
  if (typeof window === "undefined") return;

  try {
    window.dispatchEvent(
      new CustomEvent("invoice_waitlist_signup", { detail: payload }),
    );
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "invoice_waitlist_signup", ...payload });
  } catch {
    /* ignore */
  }
}
