"use client";

import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { WhenNear } from "@/components/home/WhenNear";
import type { NetworkBeamProps } from "@/components/home/load-network";

function load() {
  return import("@/components/home/load-network").then((mod) => mod.loadNetwork());
}

function NetworkPlaceholder({ mills, center, right, className }: NetworkBeamProps) {
  const labels = mills.slice(0, 4);
  return (
    <section className={cn("py-10", className)}>
      <Container>
        <div className="relative grid items-center gap-10 nav:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] nav:gap-8">
          <div className="flex w-full flex-col gap-3 nav:max-w-64 nav:justify-self-end">
            {labels.map((label) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-card border border-smoke bg-green px-4 py-3 text-bone"
              >
                <span className="size-5 shrink-0" aria-hidden />
                <p className="text-sm font-semibold leading-snug">{label}</p>
              </div>
            ))}
          </div>
          <div className="justify-self-center rounded-card border border-ice bg-moss px-6 py-5 text-bone shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25">
            <div className="flex items-center gap-3">
              <span className="size-7 shrink-0" aria-hidden />
              <p className="text-lg font-semibold">{center}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-self-start rounded-card border border-smoke bg-green px-5 py-4 text-bone">
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
