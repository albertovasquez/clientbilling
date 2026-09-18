"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { buttonClass } from "@/components/ui";
import type { ButtonSize, ButtonVariant } from "@/components/ui/Button";
import { trackInvoiceFakeDoorClick } from "@/lib/affiliate-track";

type Props = {
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/** Internal CTA that opens the invoice early-access landing and fires tracking. */
export function InvoiceFakeDoorLink({
  href = "/invoices",
  variant = "primary",
  size = "lg",
  className = "",
  children,
}: Props) {
  const label = typeof children === "string" ? children : "Create an invoice";

  function onClick() {
    trackInvoiceFakeDoorClick({
      page: window.location.pathname,
      cta_text: label,
    });
  }

  return (
    <Link
      href={href}
      className={buttonClass(variant, size, className)}
      onClick={onClick}
      data-invoice-fake-door="true"
    >
      {children}
    </Link>
  );
}
