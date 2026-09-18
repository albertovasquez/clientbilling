"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={onCopy} className={buttonClass("secondary", "md")}>
      {copied ? "Copied" : "Copy public link"}
    </button>
  );
}
