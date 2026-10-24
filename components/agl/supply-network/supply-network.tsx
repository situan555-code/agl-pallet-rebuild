"use client";

import { useEffect, useRef, useState } from "react";
import { LazyMotion, useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { ConnectorLayer } from "./connector-layer";
import { DestinationNode } from "./destination-node";
import { HubNode } from "./hub-node";
import { SupplyNode } from "./supply-node";
import type { ActiveNode, Geometry, Point, SupplyNetworkProps } from "./supply-network.types";

const loadFeatures = () => import("./features").then((mod) => mod.default);

const GRID_STYLE = {
  backgroundSize: "64px 64px",
  backgroundImage:
    "linear-gradient(to right, rgba(221,233,226,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(221,233,226,0.03) 1px, transparent 1px)",
  maskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
  WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 78%)",
} as const;

const DESKTOP = "(min-width: 1024px)";

function edge(el: HTMLElement, container: DOMRect, side: "left" | "right"): Point {
  const rect = el.getBoundingClientRect();
  return {
    x: (side === "right" ? rect.right : rect.left) - container.left,
    y: rect.top - container.top + rect.height / 2,
  };
}

export function SupplyNetwork({ sources, hub, destination, className }: SupplyNetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hubRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState<ActiveNode>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const inView = useInView(containerRef, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion() ?? false;
  const animated = !reduce;

  useEffect(() => {
    const container = containerRef.current;
    const hubEl = hubRef.current;
    const destinationEl = destinationRef.current;
    if (!container || !hubEl || !destinationEl) return;

    const measure = () => {
      const refs = sources.map((s) => sourceRefs.current[s.id]);
      if (!window.matchMedia(DESKTOP).matches || refs.some((r) => !r)) {
        setGeometry(null);
        return;
      }
      const box = container.getBoundingClientRect();
      setGeometry({
        width: box.width,
        height: box.height,
        sources: Object.fromEntries(
          sources.map((s) => [s.id, edge(sourceRefs.current[s.id]!, box, "right")]),
        ),
        hubLeft: edge(hubEl, box, "left"),
        hubRight: edge(hubEl, box, "right"),
        destinationLeft: edge(destinationEl, box, "left"),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    [hubEl, destinationEl, ...Object.values(sourceRefs.current)].forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sources]);

  // Opacity-only entrance (plus a 6px rise for non-reduced motion), sequenced
  // sources, then hub, then destination. Measured wrappers never transform.
  const reveal = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 6 },
          animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        }
      : {};

  return (
    <section className={cn("py-10", className)}>
      <Container>
        <LazyMotion features={loadFeatures} strict>
          <m.div
            ref={containerRef}
            initial={animated ? { opacity: 0 } : false}
            animate={{ opacity: inView || !animated ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative isolate mx-auto w-full max-w-[1280px] overflow-hidden rounded-section bg-moss px-5 py-10 text-bone min-[1024px]:min-h-[520px] min-[1024px]:px-12 min-[1024px]:py-16"
          >
            <div aria-hidden className="absolute inset-0 z-0" style={GRID_STYLE} />

            {geometry ? (
              <ConnectorLayer geometry={geometry} active={active} show={inView} animated={animated} />
            ) : null}

            <div className="relative z-10 mx-auto flex max-w-[360px] flex-col items-stretch min-[1024px]:grid min-[1024px]:max-w-none min-[1024px]:grid-cols-[27fr_15fr_28fr_30fr] min-[1024px]:items-center">
              <div className="flex flex-col gap-3 rounded-card border border-ice/[0.06] p-3 min-[1024px]:gap-5 min-[1024px]:rounded-none min-[1024px]:border-0 min-[1024px]:p-0">
                {sources.map((source, i) => (
                  <div
                    key={source.id}
                    ref={(el) => {
                      sourceRefs.current[source.id] = el;
                    }}
                  >
                    <m.div {...reveal(0.3 + i * 0.08)}>
                      <SupplyNode source={source} active={active === source.id} onActive={setActive} />
                    </m.div>
                  </div>
                ))}
              </div>

              <div aria-hidden className="mx-auto h-10 w-px bg-ice/30 min-[1024px]:hidden" />

              <div className="min-[1024px]:col-start-3">
                <div ref={hubRef} className="w-full min-[1024px]:max-w-[360px]">
                  <m.div {...reveal(0.9)}>
                    <HubNode hub={hub} active={active === "agl"} onActive={setActive} />
                  </m.div>
                </div>
              </div>

              <div aria-hidden className="mx-auto h-10 w-px bg-ice/30 min-[1024px]:hidden" />

              <div className="min-[1024px]:col-start-4 min-[1024px]:justify-self-end min-[1024px]:w-full min-[1024px]:max-w-[280px]">
                <div ref={destinationRef}>
                  <m.div {...reveal(1.2)}>
                    <DestinationNode
                      destination={destination}
                      active={active === "destination"}
                      onActive={setActive}
                    />
                  </m.div>
                </div>
              </div>
            </div>
          </m.div>
        </LazyMotion>
      </Container>
    </section>
  );
}
