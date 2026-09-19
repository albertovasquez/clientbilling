"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { sendBrowserEvent, type BrowserEventName } from "@/lib/browser-events";

type EventLinkProps = {
  href: string;
  event: BrowserEventName;
  className?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | undefined>;

/** An internal link that records a browser event when clicked. Works as a plain link without JavaScript. */
export function EventLink({ href, event, className, children, ...rest }: EventLinkProps) {
  return (
    <Link href={href} className={className} onClick={() => sendBrowserEvent(event)} {...rest}>
      {children}
    </Link>
  );
}
