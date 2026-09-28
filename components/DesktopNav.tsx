"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Remount on route change so a focused mega-menu link cannot leave the panel open. */
export function DesktopNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <nav key={pathname} className="hidden min-w-0 xl:block" aria-label="Main">
      <ul className="flex items-center gap-0.5">{children}</ul>
    </nav>
  );
}
