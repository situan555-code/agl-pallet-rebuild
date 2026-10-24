import { Building2, Factory, Layers3, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupplyIconName, SupplySource } from "./supply-network.types";

const icons: Record<SupplyIconName, LucideIcon> = {
  factory: Factory,
  building: Building2,
  layers: Layers3,
};

export function SupplyNode({
  source,
  active,
  onActive,
}: {
  source: SupplySource;
  active: boolean;
  onActive: (id: string | null) => void;
}) {
  const Icon = icons[source.icon];
  return (
    <div
      onPointerEnter={() => onActive(source.id)}
      onPointerLeave={() => onActive(null)}
      className={cn(
        "flex min-h-[68px] items-center gap-4 rounded-card border bg-ice/[0.02] px-4 py-3 transition-colors duration-300",
        "min-[1024px]:min-h-[82px] min-[1024px]:px-5 min-[1024px]:py-4",
        active ? "border-ice/[0.16] bg-ice/[0.035]" : "border-ice/[0.09] hover:border-ice/[0.14]",
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-ice/[0.06] bg-ice/[0.04]">
        <Icon
          className={cn("size-5 transition-colors duration-300", active ? "text-ice" : "text-ice/75")}
          strokeWidth={1.7}
          aria-hidden
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-medium tracking-[-0.015em] text-bone/90">{source.label}</h3>
        <p className="mt-1 text-[13px] leading-snug text-gray">{source.description}</p>
      </div>
    </div>
  );
}
