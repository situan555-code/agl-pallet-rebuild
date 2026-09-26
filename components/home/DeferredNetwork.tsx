"use client";

import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { WhenNear } from "@/components/home/WhenNear";
import type { NetworkBeamProps } from "@/components/home/load-network";

function load() {
  return import("@/components/home/load-network").then((mod) => mod.loadNetwork());
}

const nodeClass =
  "relative z-10 flex items-center gap-3 rounded-card border border-smoke bg-green px-4 py-3 text-bone";

function NetworkPlaceholder({ mills, center, right, className }: NetworkBeamProps) {
  const labels = mills.slice(0, 4);
  return (
    <section className={cn("py-10", className)}>
      <Container>
        <div className="flex flex-col items-center gap-4 md:hidden">
          {labels.map((label, i) => (
            <div key={label} className="flex w-full max-w-64 flex-col items-center gap-4">
              {i > 0 ? <div aria-hidden className="h-4 w-px bg-ice/30" /> : null}
              <div className={cn(nodeClass, "w-full")}>
                <span className="size-5 shrink-0" aria-hidden />
                <p className="text-sm font-semibold leading-snug">{label}</p>
              </div>
            </div>
          ))}
          <div aria-hidden className="h-4 w-px bg-ice/30" />
          <div className="relative z-10 rounded-card border border-ice bg-green px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25">
            <div className="flex items-center gap-3">
              <span className="size-7 shrink-0" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>
          <div aria-hidden className="h-4 w-px bg-ice/30" />
          <div className={nodeClass}>
            <span className="size-5 shrink-0" aria-hidden />
            <p className="text-sm font-semibold">{right}</p>
          </div>
        </div>

        <div className="relative mx-auto hidden w-fit items-center gap-8 md:flex">
          <div className="flex w-64 flex-col gap-3">
            {labels.map((label) => (
              <div key={label} className={nodeClass}>
                <span className="size-5 shrink-0" aria-hidden />
                <p className="text-sm font-semibold leading-snug">{label}</p>
              </div>
            ))}
          </div>
          <div className="relative z-10 rounded-card border border-ice bg-green px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25">
            <div className="flex items-center gap-3">
              <span className="size-7 shrink-0" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>
          <div className={nodeClass}>
            <span className="size-5 shrink-0" aria-hidden />
            <p className="text-sm font-semibold">{right}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function DeferredNetwork(props: NetworkBeamProps) {
  return <WhenNear load={load} componentProps={props} placeholder={<NetworkPlaceholder {...props} />} />;
}
