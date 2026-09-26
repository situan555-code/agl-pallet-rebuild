import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Moss gutter around inset surfaces: 16px at 390, 24px from 768. */
export const insetOuterClass = "px-4 md:px-6";

/** Rounded 1280 surface. Pair with insetOuterClass and insetPadClass. */
export const insetSurfaceClass = "mx-auto w-full max-w-[1280px] rounded-section";

/** Content padding inside an inset surface. */
export const insetPadClass = "px-6 md:px-8 lg:px-12";

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
