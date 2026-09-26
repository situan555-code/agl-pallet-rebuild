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
        <div
          ref={containerRef}
          className="relative grid items-center gap-10 nav:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] nav:gap-8"
        >
          <div className="flex w-full flex-col gap-3 nav:max-w-64 nav:justify-self-end">
            {labels.map((label, i) => {
              const Icon = sourceIcons[i] ?? Factory;
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
            className="justify-self-center rounded-card border border-ice bg-moss px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25"
          >
            <div className="flex items-center gap-3">
              <Network className="size-7 shrink-0 text-ice" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>

          <div
            ref={rightRef}
            className="flex items-center gap-3 justify-self-start rounded-card border border-smoke bg-green px-5 py-4 text-bone"
          >
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
              {...beam}
            />
          ))}
          <AnimatedBeam
            containerRef={containerRef}
            fromRef={centerRef}
            toRef={rightRef}
            delay={0.6}
            {...beam}
          />
        </div>
      </Container>
    </section>
  );
}
