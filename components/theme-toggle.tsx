// Adapted from @shadcnblocks/theme-toggle-theme-toggle-icon-8
// (ghost icon button, sun/moon). Server-rendered; the boot script in
// layout toggles html[data-field] and localStorage on click.
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      data-theme-toggle
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-transparent bg-transparent text-current shadow-none outline-hidden transition-colors select-none hover:bg-current/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      aria-label="Toggle color theme"
    >
      <Moon className="size-4 in-[html[data-field=light]]:hidden" aria-hidden />
      <Sun className="hidden size-4 in-[html[data-field=light]]:block" aria-hidden />
      <span className="sr-only in-[html[data-field=light]]:hidden">Switch to light theme</span>
      <span className="sr-only hidden in-[html[data-field=light]]:inline">Switch to dark theme</span>
    </button>
  );
}
