import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type { ButtonVariant };

export function Button({
  href,
  label,
  variant = "primary",
  arrow = true,
}: {
  href: string;
  label: string;
  variant?: ButtonVariant;
  arrow?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={cn(buttonVariants({ variant, arrow }))}
    >
      {label}
      {arrow ? (
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-current/10">
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      ) : null}
    </Link>
  );
}
