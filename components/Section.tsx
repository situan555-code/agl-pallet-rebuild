import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
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
  const light = variant === "light" || variant === "inset-light";

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 overflow-hidden",
        grain && "grain",
        className
      )}
    >
      {dots ? (
        <DotPattern className={cn("text-ice/20", light && "text-moss/10")} />
      ) : null}
      <div className={cn(containerClass, "relative py-16 nav:py-20", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
