import { Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconTile } from "@/components/IconTile";
import { QuoteCopyButton } from "@/components/QuoteCopyButton";
import { interactiveCardClass } from "@/components/InteractiveCard";

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
          <li key={item.label} className="relative">
            <a href={item.href} className={cn(interactiveCardClass, "p-6")}>
              <IconTile icon={Icon} />
              <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">{item.label}</p>
              <p className="mt-2 text-[22px] font-semibold leading-snug text-current">{item.value}</p>
              <span className="mt-4 inline-flex text-body font-semibold text-ice">{actions[item.kind]}</span>
            </a>
            <div className="absolute right-4 top-4 z-10">
              <QuoteCopyButton value={item.value} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
