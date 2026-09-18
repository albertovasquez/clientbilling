import type { CtaPosition, CtaType } from "@/lib/cta";

export type AffiliateClickPayload = {
  page: string;
  article_slug?: string;
  cta_position: CtaPosition;
  cta_text: string;
  cta_type: CtaType;
};

export type CalculatorCompletePayload = {
  page: string;
  processor: string;
  channel: string;
  volume_band: string;
  volume: number;
};

/**
 * Browser-side event emitter (decision 0007). Posts to the first-party events
 * endpoint, and also fires a DOM event and a dataLayer push for anyone who later
 * wires a tag manager. Never throws.
 */
function emit(name: string, payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, path: window.location.pathname, payload }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* ignore */
  }

  try {
    window.dispatchEvent(new CustomEvent(name, { detail: payload }));
  } catch {
    /* ignore */
  }

  try {
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

export function trackAffiliateClick(payload: AffiliateClickPayload): void {
  emit("affiliate_cta_click", payload);
}

/** Fires when the fee calculator has enough inputs to show a result. */
export function trackCalculatorComplete(payload: CalculatorCompletePayload): void {
  emit("calculator_complete", payload);
}
