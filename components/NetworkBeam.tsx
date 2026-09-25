import { cn } from "@/lib/utils";

export function NetworkBeam({
  left,
  center,
  right,
  className,
}: {
  left: string;
  center: string;
  right: string;
  className?: string;
}) {
  return (
    <section className={cn("section-y px-6", className)}>
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-8 nav:flex-row nav:justify-between">
        <p className="rounded-card border border-smoke bg-green px-6 py-8 text-center text-body text-bone nav:w-56">
          {left}
        </p>
        <svg className="h-16 w-full max-w-xs text-ice" viewBox="0 0 200 40" aria-hidden>
          <line x1="4" y1="20" x2="196" y2="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="20" r="5" fill="currentColor" className="motion-safe:animate-pulse" />
        </svg>
        <p className="rounded-card border border-ice/40 bg-moss px-6 py-8 text-center text-body font-semibold text-bone nav:w-56">
          {center}
        </p>
        <svg className="h-16 w-full max-w-xs text-ice" viewBox="0 0 200 40" aria-hidden>
          <line x1="4" y1="20" x2="196" y2="20" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="20" r="5" fill="currentColor" className="motion-safe:animate-pulse" />
        </svg>
        <p className="rounded-card border border-smoke bg-green px-6 py-8 text-center text-body text-bone nav:w-56">
          {right}
        </p>
      </div>
    </section>
  );
}
