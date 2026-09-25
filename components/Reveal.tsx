"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { BlurFade } from "@/components/ui/blur-fade";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <BlurFade className={className} delay={delay} inView>
      {children}
    </BlurFade>
  );
}
