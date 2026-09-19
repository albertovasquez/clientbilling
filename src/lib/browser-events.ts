/**
 * First-party browser events (decision 0007). The allowlist is the contract
 * between the page and the events route: a name not listed here is refused.
 */
export const browserEventNames = [
  "affiliate_cta_click",
  "calculator_complete",
  "payer_pay_link_click",
  "cost_table_edit",
  "hero_signup_click",
  "proof_strip_click",
] as const;

export type BrowserEventName = (typeof browserEventNames)[number];

/** Fire and forget from the browser. Never throws: measurement must not break a click. */
export function sendBrowserEvent(name: BrowserEventName, payload?: Record<string, unknown>): void {
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
}
