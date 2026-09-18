"use client";

import { useEffect } from "react";

/**
 * Records that a person opened the public invoice (decision 0008). Runs after
 * render so link scanners that fetch HTML without executing scripts do not
 * count as views.
 */
export function ViewBeacon({ publicId }: { publicId: string }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        fetch("/api/invoices/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId }),
          keepalive: true,
        }).catch(() => undefined);
      } catch {
        /* ignore */
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [publicId]);
  return null;
}
