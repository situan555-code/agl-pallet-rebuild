"use client";

import { useState } from "react";
import { Check, Copy, Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/IconTile";

export interface QuoteContactItem {
  kind: "phone" | "email" | "text";
  label: string;
  value: string;
  href: string;
}

const icons: Record<QuoteContactItem["kind"], LucideIcon> = {
  phone: Phone,
  email: Mail,
  text: MessageSquare,
};

const actions: Record<QuoteContactItem["kind"], string> = {
  phone: "Call",
  email: "Email",
  text: "Text",
};

function CopyButton({ value }: { value: string }) {
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

export function QuoteContacts({
  items,
  className,
}: {
  items: QuoteContactItem[];
  className?: string;
}) {
  return (
    <ul className={cn("mt-16 grid grid-cols-1 items-start gap-4 nav:grid-cols-3", className)}>
      {items.map((item) => {
        const Icon = icons[item.kind];
        return (
          <li
            key={item.label}
            className="hover-lift rounded-card border border-smoke bg-moss p-6 text-bone hover:border-ice"
          >
            <div className="flex items-start justify-between gap-3">
              <IconTile icon={Icon} />
              <CopyButton value={item.value} />
            </div>
            <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">{item.label}</p>
            <p className="mt-2 text-[22px] font-semibold leading-snug text-bone">{item.value}</p>
            <a href={item.href} className="mt-4 inline-flex text-body font-semibold text-ice">
              {actions[item.kind]}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
