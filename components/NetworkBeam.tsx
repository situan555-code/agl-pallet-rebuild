"use client";

import { useEffect, useRef, useState } from "react";
import { Factory, Landmark, Network, Truck } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

export function NetworkBeam({
  mills,
  center,
  right,
  className,
}: {
  mills: string[];
  center: string;
  right: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const millA = useRef<HTMLDivElement>(null);
  const millB = useRef<HTMLDivElement>(null);
  const millC = useRef<HTMLDivElement>(null);
  const millD = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const millRefs = [millA, millB, millC, millD];
  const labels = mills.slice(0, 4);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { rootMargin: "80px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section className={cn("px-6 py-10", className)}>
      <div
        ref={containerRef}
        className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-8 nav:flex-row nav:items-center nav:justify-between nav:gap-6"
      >
        <div className="flex w-full flex-col gap-3 nav:w-56">
          {labels.map((label, i) => {
            const Icon = i === 1 ? Landmark : Factory;
            return (
              <div
                key={label}
                ref={millRefs[i]}
                className="flex items-center gap-3 rounded-card border border-smoke bg-green px-4 py-3 text-bone"
              >
                <Icon className="size-5 shrink-0 text-ice" aria-hidden />
                <p className="text-sm font-semibold leading-snug">{label}</p>
              </div>
            );
          })}
        </div>

        <div
          ref={centerRef}
          className="flex items-center gap-3 rounded-card border border-ice/40 bg-moss px-5 py-4 text-bone"
        >
          <Network className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">{center}</p>
        </div>

        <div
          ref={rightRef}
          className="flex items-center gap-3 rounded-card border border-smoke bg-green px-5 py-4 text-bone"
        >
          <Truck className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">{right}</p>
        </div>

        {active
          ? labels.map((label, i) => (
              <AnimatedBeam
                key={label}
                containerRef={containerRef}
                fromRef={millRefs[i]}
                toRef={centerRef}
                curvature={i === 0 ? 36 : i === labels.length - 1 ? -36 : 0}
                delay={i * 0.2}
                pathColor="#AEB5AE"
                gradientStartColor="#DDE9E2"
                gradientStopColor="#DDE9E2"
              />
            ))
          : null}
        {active ? (
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={centerRef}
            toRef={rightRef}
            delay={0.8}
            pathColor="#AEB5AE"
            gradientStartColor="#DDE9E2"
            gradientStopColor="#DDE9E2"
          />
        ) : null}
      </div>
    </section>
  );
}
