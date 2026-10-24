import { ArrowRight, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupplyHub } from "./supply-network.types";

export function HubNode({
  hub,
  active,
  onActive,
}: {
  hub: SupplyHub;
  active: boolean;
  onActive: (id: string | null) => void;
}) {
  return (
    <div
      onPointerEnter={() => onActive("agl")}
      onPointerLeave={() => onActive(null)}
      className={cn(
        "flex flex-col gap-4 rounded-section border bg-green px-6 py-6 transition-colors duration-300 min-[1024px]:px-7 min-[1024px]:py-7",
        "shadow-[0_0_0_6px_rgba(221,233,226,0.035),0_18px_60px_rgba(0,0,0,0.18)]",
        active ? "border-ice/60" : "border-ice/40",
      )}
    >
      <div className="flex items-center gap-4">
        <Network
          className={cn("size-7 shrink-0 transition-colors duration-300", active ? "text-ice" : "text-ice/80")}
          strokeWidth={1.7}
          aria-hidden
        />
        <p className="text-[28px] font-medium leading-none tracking-[-0.035em] text-bone min-[1024px]:text-[30px]">
          {hub.title}
        </p>
      </div>
      {/* Arrows are icons, not text: the banned-words gate flags the arrow glyph as an emoji. */}
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase leading-relaxed tracking-[0.18em] text-ice/80">
        {hub.steps.map((step, i) => (
          <span key={step} className="inline-flex items-center gap-2">
            {i > 0 ? <ArrowRight className="size-3" strokeWidth={1.7} aria-hidden /> : null}
            {step}
          </span>
        ))}
      </p>
    </div>
  );
}
