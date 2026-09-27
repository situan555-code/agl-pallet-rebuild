import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const interactiveCardClass =
  "hover-lift group flex h-full flex-col overflow-hidden rounded-card border border-current/15 bg-transparent text-current hover:border-ring focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function InteractiveCard({
  href,
  id,
  className,
  children,
}: {
  href: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const classes = cn(interactiveCardClass, className);
  const internal = href.startsWith("/") || href.startsWith("#");
  if (internal) {
    return (
      <Link id={id} href={href} prefetch={false} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a id={id} href={href} className={classes}>
      {children}
    </a>
  );
}
