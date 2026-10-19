// Header shortcut to the internal brand lab (/accent-lab/). Same ghost icon
// button as ThemeToggle. Header only renders it on demo hosts (*.vercel.app,
// localhost), so it never ships on aglpallet.com.
import Link from "next/link";
import { Palette } from "lucide-react";
import lab from "@/content/brand/accent-lab.json";
import { cn } from "@/lib/utils";

export function BrandLabLink({ className }: { className?: string }) {
  return (
    <Link
      href="/accent-lab/"
      prefetch={false}
      aria-label={lab.copy.navLabel}
      title={lab.copy.title}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-current/25 bg-transparent text-current shadow-none outline-hidden transition-colors select-none hover:bg-current/8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
    >
      <Palette className="size-4" aria-hidden />
    </Link>
  );
}
