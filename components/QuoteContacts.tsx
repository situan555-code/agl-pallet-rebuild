import { Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/IconTile";
import { QuoteCopyButton } from "@/components/QuoteCopyButton";

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
              <QuoteCopyButton value={item.value} />
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
