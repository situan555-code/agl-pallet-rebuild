"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { insetOuterClass, insetPadClass } from "@/components/Container";

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
        "fixed inset-x-0 top-0 z-60 flex justify-center transition-[padding] duration-300",
        insetOuterClass,
        scrolled ? "pt-2" : "pt-3"
      )}
    >
      <div
        className={cn(
          insetPadClass,
          "flex w-full max-w-[1280px] items-center justify-between gap-2 rounded-full border text-bone",
          scrolled
            ? "border-smoke bg-moss/85 py-2.5 shadow-md backdrop-blur-[16px]"
            : "border-transparent bg-transparent py-3 shadow-none has-[[data-nav-menu-trigger][aria-expanded=true]]:border-smoke has-[[data-nav-menu-trigger][aria-expanded=true]]:bg-moss/85 has-[[data-nav-menu-trigger][aria-expanded=true]]:py-2.5 has-[[data-nav-menu-trigger][aria-expanded=true]]:shadow-md has-[[data-nav-menu-trigger][aria-expanded=true]]:backdrop-blur-[16px]"
        )}
      >
        {children}
      </div>
    </header>
  );
}
