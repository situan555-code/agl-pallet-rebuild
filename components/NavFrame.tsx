"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";

export function NavFrame({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-300",
        scrolled ? "pt-2" : "pt-3"
      )}
    >
      <div
        className={cn(
          containerClass,
          "flex items-center justify-between gap-2 rounded-full border text-bone",
          scrolled
            ? "border-smoke bg-moss/85 py-2.5 shadow-md backdrop-blur-[16px]"
            : "border-transparent bg-transparent py-3 shadow-none"
        )}
      >
        {children}
      </div>
    </header>
  );
}
