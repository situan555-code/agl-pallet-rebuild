import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupplyDestination } from "./supply-network.types";

export function DestinationNode({
  destination,
  active,
  onActive,
}: {
  destination: SupplyDestination;
  active: boolean;
  onActive: (id: string | null) => void;
}) {
  return (
    <div
      onPointerEnter={() => onActive("destination")}
      onPointerLeave={() => onActive(null)}
      className={cn(
        "flex min-h-[68px] items-center gap-4 rounded-card border bg-ice/[0.02] px-4 py-3 transition-colors duration-300",
        "min-[1024px]:min-h-[90px] min-[1024px]:px-5",
        active ? "border-ice/[0.16]" : "border-ice/[0.09]",
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-ice/[0.06] bg-ice/[0.04]">
        <Truck className="size-5 text-ice/75" strokeWidth={1.7} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-base font-medium tracking-[-0.015em] text-bone/90">{destination.title}</p>
        <p className="mt-1 text-[13px] leading-snug text-gray">{destination.description}</p>
      </div>
    </div>
  );
}
