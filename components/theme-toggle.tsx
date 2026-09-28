"use client";

// Adapted from @shadcnblocks/theme-toggle-theme-toggle-icon-8
// (ghost icon button, sun/moon). Icons follow html[data-field] so they
// match the blocking boot script without a hydration flash.
import { Moon, Sun } from "lucide-react";
import { applyTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function nextTheme(): Theme {
  return document.documentElement.dataset.field === "light" ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        const theme = nextTheme();
        applyTheme(theme);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
          /* private mode */
        }
      }}
      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "size-9", className)}
      aria-label="Toggle color theme"
    >
      <Moon className="size-4 in-[html[data-field=light]]:hidden" aria-hidden />
      <Sun className="hidden size-4 in-[html[data-field=light]]:block" aria-hidden />
      <span className="sr-only in-[html[data-field=light]]:hidden">Switch to light theme</span>
      <span className="sr-only hidden in-[html[data-field=light]]:inline">Switch to dark theme</span>
    </button>
  );
}
