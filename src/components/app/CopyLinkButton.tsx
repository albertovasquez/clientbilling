"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";

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
    <Button type="button" variant="outline" onClick={onCopy}>
      {copied ? "Copied" : "Copy public link"}
    </Button>
  );
}
