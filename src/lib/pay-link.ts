/**
 * Merchant pay links (decision 0014, amended 2026-09-18). A merchant pastes any
 * https link. For providers whose link format carries an amount, the payer's
 * link is built per invoice so the balance is prefilled. Everything else is
 * passed through untouched.
 */

export type PayLinkKind = "paypal" | "generic";

/** PayPal.me usernames: letters and digits, as PayPal issues them. */
const paypalName = /^[A-Za-z0-9]{1,50}$/;

function paypalUsername(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  if (host === "paypal.me" || host === "www.paypal.me") {
    return parts[0] && paypalName.test(parts[0]) ? parts[0] : null;
  }
  if ((host === "paypal.com" || host === "www.paypal.com") && parts[0]?.toLowerCase() === "paypalme") {
    return parts[1] && paypalName.test(parts[1]) ? parts[1] : null;
  }
  return null;
}

export function payLinkKind(raw: string | null | undefined): PayLinkKind {
  if (!raw) return "generic";
  try {
    return paypalUsername(new URL(raw)) ? "paypal" : "generic";
  } catch {
    return "generic";
  }
}

/**
 * The link a payer should open for one invoice. PayPal.me links get the
 * balance appended in PayPal's own format (`/username/12.34USD`); any amount
 * the merchant typed into the link is replaced.
 */
export function payLinkForInvoice(raw: string | null | undefined, amountCents: number, currency = "USD"): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return trimmed;
  }
  const user = paypalUsername(url);
  if (!user) return trimmed;
  if (!(amountCents > 0)) return `https://paypal.me/${user}`;
  const amount = (amountCents / 100).toFixed(2);
  return `https://paypal.me/${user}/${amount}${currency.toUpperCase()}`;
}
