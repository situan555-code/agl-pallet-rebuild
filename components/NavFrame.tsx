"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";

export function NavFrame({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300",
        compact ? "pt-2" : "pt-3"
      )}
    >
      <div
        className={cn(
          containerClass,
          "flex items-center justify-between gap-2 border-0 bg-moss/85 text-bone shadow-md backdrop-blur-xl supports-backdrop-filter:bg-moss/80",
          compact ? "rounded-full py-1.5" : "rounded-full py-2"
        )}
      >
        {children}
      </div>
    </header>
  );
}
