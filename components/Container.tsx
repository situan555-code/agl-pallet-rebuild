import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Content column: 1280px max, centered, 24 / 32 / 48px inline padding. */
export const containerClass = "mx-auto w-full max-w-[1280px] px-6 md:px-8 lg:px-12";

export function Container({
  as,
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  const Tag = as ?? "div";
  return <Tag className={cn(containerClass, className)}>{children}</Tag>;
}
