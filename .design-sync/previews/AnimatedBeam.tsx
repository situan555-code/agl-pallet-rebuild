import * as React from "react";
import { AnimatedBeam, Factory, Building2, Layers, Network, Truck } from "agl-pallet";

const beam = {
  pathColor: "#DDE9E2",
  pathWidth: 2.5,
  pathOpacity: 0.9,
  gradientStartColor: "#DDE9E2",
  gradientStopColor: "#ECE8DF",
};

const nodeClass =
  "relative z-10 flex items-center gap-3 rounded-card border border-current/15 bg-moss px-4 py-3 text-current";
const hubClass =
  "relative z-10 rounded-card border border-ice bg-moss px-6 py-5 text-current shadow-[0_0_28px_rgba(221,233,226,0.35)] ring-4 ring-ice/25";

export const MillsToLine = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const millA = React.useRef<HTMLDivElement>(null);
  const millB = React.useRef<HTMLDivElement>(null);
  const millC = React.useRef<HTMLDivElement>(null);
  const hub = React.useRef<HTMLDivElement>(null);
  const line = React.useRef<HTMLDivElement>(null);
  const mills = [
    { ref: millA, label: "Family-run mills", Icon: Factory },
    { ref: millB, label: "Qualified shops", Icon: Building2 },
    { ref: millC, label: "More than one source", Icon: Layers },
  ];
  return (
    <div className="bg-moss p-8 text-bone">
      <div ref={containerRef} className="relative mx-auto flex w-fit items-center gap-12">
        <div className="flex w-64 flex-col gap-3">
          {mills.map(({ ref, label, Icon }) => (
            <div key={label} ref={ref} className={nodeClass}>
              <Icon className="size-5 shrink-0 text-ice" aria-hidden />
              <p className="text-sm font-semibold leading-snug">{label}</p>
            </div>
          ))}
        </div>
        <div ref={hub} className={hubClass}>
          <div className="flex items-center gap-3">
            <Network className="size-7 shrink-0 text-ice" aria-hidden />
            <p className="text-lg font-semibold">AGL Pallet</p>
          </div>
        </div>
        <div ref={line} className={nodeClass}>
          <Truck className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">Your line</p>
        </div>
        {mills.map(({ ref, label }, i) => (
          <AnimatedBeam
            key={label}
            containerRef={containerRef}
            fromRef={ref}
            toRef={hub}
            curvature={i === 0 ? 28 : i === mills.length - 1 ? -28 : 0}
            delay={i * 0.2}
            {...beam}
          />
        ))}
        <AnimatedBeam containerRef={containerRef} fromRef={hub} toRef={line} delay={0.6} {...beam} />
      </div>
    </div>
  );
};

export const SingleLink = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const from = React.useRef<HTMLDivElement>(null);
  const to = React.useRef<HTMLDivElement>(null);
  return (
    <div className="bg-moss p-8 text-bone">
      <div ref={containerRef} className="relative mx-auto flex w-full max-w-xl items-center justify-between">
        <div ref={from} className={nodeClass}>
          <Factory className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">Ohio mill</p>
        </div>
        <div ref={to} className={nodeClass}>
          <Truck className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">Your dock</p>
        </div>
        <AnimatedBeam containerRef={containerRef} fromRef={from} toRef={to} curvature={40} {...beam} />
      </div>
    </div>
  );
};

export const ReverseDefaultColors = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const from = React.useRef<HTMLDivElement>(null);
  const to = React.useRef<HTMLDivElement>(null);
  return (
    <div className="bg-moss p-8 text-bone">
      <div ref={containerRef} className="relative mx-auto flex w-full max-w-xl items-center justify-between">
        <div ref={from} className={nodeClass}>
          <Network className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">AGL Pallet</p>
        </div>
        <div ref={to} className={nodeClass}>
          <Building2 className="size-5 shrink-0 text-ice" aria-hidden />
          <p className="text-sm font-semibold">Qualified shop</p>
        </div>
        <AnimatedBeam containerRef={containerRef} fromRef={from} toRef={to} reverse />
      </div>
    </div>
  );
};
