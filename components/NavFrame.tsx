import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { insetOuterClass, insetPadClass } from "@/components/Container";

export function NavFrame({ children }: { children: ReactNode }) {
  return (
    <header
      className={cn(
        "nav-frame pointer-events-auto fixed inset-x-0 top-0 z-60 flex justify-center",
        insetOuterClass,
      )}
    >
      <div
        className={cn(
          "nav-frame-inner flex w-full max-w-[1280px] items-center justify-between gap-2 rounded-full border text-bone",
          insetPadClass,
        )}
      >
        {children}
      </div>
    </header>
  );
}
