"use client";

import { useState } from "react";

export function CopyValue({
  value,
  href,
  label,
}: {
  value: string;
  href: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <span className="flex flex-col">
      <span className="text-eyebrow font-semibold uppercase tracking-wide text-white/70">{label}</span>
      <a href={href} className="text-step-sm font-semibold hover:underline">
        {value}
      </a>
      <button
        type="button"
        className="mt-1 self-start text-link text-bone/70 underline-offset-4 hover:underline"
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}
