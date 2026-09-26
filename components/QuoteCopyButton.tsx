"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function QuoteCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-bone hover:text-ice"
      aria-label={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied ? (
        <span
          role="status"
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bone px-2 py-1 text-[12px] font-semibold text-moss"
        >
          Copied
        </span>
      ) : null}
    </button>
  );
}
