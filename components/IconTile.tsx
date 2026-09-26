import type { LucideIcon } from "lucide-react";

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-[12px] border border-gray/20 bg-smoke text-ice">
      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
    </span>
  );
}
