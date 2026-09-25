"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        "fixed inset-x-0 top-0 z-50 flex justify-center px-3 transition-[padding] duration-300",
        compact ? "pt-2" : "pt-3"
      )}
    >
      <div
        className={cn(
          "flex w-full max-w-[1200px] items-center justify-between gap-2 border-0 bg-moss/85 text-bone shadow-md backdrop-blur-xl supports-backdrop-filter:bg-moss/80",
          compact ? "rounded-full px-3 py-1.5" : "rounded-full px-4 py-2"
        )}
      >
        {children}
      </div>
    </header>
  );
}
