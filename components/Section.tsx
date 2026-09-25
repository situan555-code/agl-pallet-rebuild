import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";

export type SectionVariant = "dark" | "inset-green" | "light" | "inset-light";

export function Section({
  id,
  variant = "dark",
  grain = false,
  dots = false,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  variant?: SectionVariant;
  grain?: boolean;
  dots?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const inset = variant === "inset-green" || variant === "inset-light";
  const light = variant === "light" || variant === "inset-light";

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 overflow-hidden",
        variant === "dark" && "bg-moss text-bone",
        variant === "inset-green" && "bg-moss px-4 py-6 nav:px-6 nav:py-8",
        variant === "light" && "surface-light bg-bone text-moss",
        variant === "inset-light" && "bg-moss px-4 py-6 nav:px-6 nav:py-8",
        grain && "grain",
        className
      )}
    >
      {dots ? (
        <DotPattern className={cn("text-ice/20", light && "text-moss/10")} />
      ) : null}
      <div
        className={cn(
          inset && "relative rounded-section px-6 py-16 nav:px-10 nav:py-20",
          variant === "inset-green" && "bg-green text-bone",
          variant === "inset-light" && "surface-light bg-bone text-moss",
          innerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
