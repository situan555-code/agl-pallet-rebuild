"use client";

import { useRef } from "react";
import { Building2, Factory, Layers, Network, Truck, type LucideIcon } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";
import { Container } from "@/components/Container";

const sourceIcons: LucideIcon[] = [Factory, Building2, Layers, Truck];

const beam = {
  pathColor: "#DDE9E2",
  pathWidth: 2.5,
  pathOpacity: 0.9,
  gradientStartColor: "#DDE9E2",
  gradientStopColor: "#ECE8DF",
};

const nodeClass =
  "relative z-10 flex items-center gap-3 rounded-card border border-smoke bg-green px-4 py-3 text-bone";

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

  const millRefs = [millA, millB, millC, millD];
  const labels = mills.slice(0, 4);

  return (
    <section className={cn("py-10", className)}>
      <Container>
        <div className="flex flex-col items-center gap-4 md:hidden">
          {labels.map((label, i) => {
            const Icon = sourceIcons[i] ?? Factory;
            return (
              <div key={label} className="flex w-full max-w-64 flex-col items-center gap-4">
                {i > 0 ? <div aria-hidden className="h-4 w-px bg-ice/30" /> : null}
                <div className={cn(nodeClass, "w-full")}>
                  <Icon className="size-5 shrink-0 text-ice" aria-hidden />
                  <p className="text-sm font-semibold leading-snug">{label}</p>
                </div>
              </div>
            );
          })}
          <div aria-hidden className="h-4 w-px bg-ice/30" />
          <div className="relative z-10 rounded-card border border-ice bg-green px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25">
            <div className="flex items-center gap-3">
              <Network className="size-7 shrink-0 text-ice" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>
          <div aria-hidden className="h-4 w-px bg-ice/30" />
          <div className={nodeClass}>
            <Truck className="size-5 shrink-0 text-ice" aria-hidden />
            <p className="text-sm font-semibold">{right}</p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto hidden w-fit items-center gap-8 md:flex"
        >
          <div className="flex w-64 flex-col gap-3">
            {labels.map((label, i) => {
              const Icon = sourceIcons[i] ?? Factory;
              return (
                <div key={label} ref={millRefs[i]} className={nodeClass}>
                  <Icon className="size-5 shrink-0 text-ice" aria-hidden />
                  <p className="text-sm font-semibold leading-snug">{label}</p>
                </div>
              );
            })}
          </div>

          <div
            ref={centerRef}
            className="relative z-10 rounded-card border border-ice bg-green px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25"
          >
            <div className="flex items-center gap-3">
              <Network className="size-7 shrink-0 text-ice" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>

          <div ref={rightRef} className={nodeClass}>
            <Truck className="size-5 shrink-0 text-ice" aria-hidden />
            <p className="text-sm font-semibold">{right}</p>
          </div>

          {labels.map((label, i) => (
            <AnimatedBeam
              key={label}
              containerRef={containerRef}
              fromRef={millRefs[i]}
              toRef={centerRef}
              curvature={i === 0 ? 28 : i === labels.length - 1 ? -28 : 0}
              delay={i * 0.2}
              className="hidden md:block"
              {...beam}
            />
          ))}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={centerRef}
            toRef={rightRef}
            delay={0.6}
            className="hidden md:block"
            {...beam}
          />
        </div>
      </Container>
    </section>
  );
}
