import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Continuous moss page. Grain sits behind the copy so it does not tint glyphs. */
export function FlowPage({ children }: { children: ReactNode }) {
  return (
    <div className="flow-page">
      <div className="flow-grain" aria-hidden="true" />
      {children}
    </div>
  );
}

export function FlowAnchor({
  glow,
  children,
}: {
  glow: "hero" | "network" | "cta";
  children: ReactNode;
}) {
  return (
    <div className="flow-anchor">
      <div aria-hidden="true" className={cn("flow-glow", `flow-glow-${glow}`)} />
      {children}
    </div>
  );
}
