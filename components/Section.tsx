import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { insetOuterClass, insetPadClass, insetSurfaceClass } from "@/components/Container";
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
        variant === "inset-green" && cn("bg-moss py-6 nav:py-8", insetOuterClass),
        variant === "light" && "surface-light bg-bone text-moss",
        variant === "inset-light" && cn("bg-moss py-6 nav:py-8", insetOuterClass),
        grain && "grain",
        className
      )}
    >
      {dots ? (
        <DotPattern className={cn("text-ice/20", light && "text-moss/10")} />
      ) : null}
      <div
        className={cn(
          inset && cn(insetSurfaceClass, insetPadClass, "relative py-16 nav:py-20"),
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
