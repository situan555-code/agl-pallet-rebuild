import { BlurFade } from "agl-pallet";

export const Default = () => (
  <div className="bg-moss p-8 text-bone">
    <BlurFade>
      <h2 className="font-display text-display-row uppercase">More than one mill per spec</h2>
      <p className="mt-3 max-w-md text-body text-current/80">
        Every spec we sell has multiple qualified shops behind it. No single point of failure between a lumber market and your line.
      </p>
    </BlurFade>
  </div>
);

export const Directions = () => (
  <div className="grid grid-cols-2 gap-4 bg-moss p-8 text-bone">
    {(["up", "down", "left", "right"] as const).map((direction, i) => (
      <BlurFade key={direction} direction={direction} offset={16} delay={i * 0.1}>
        <div className="rounded-card border border-current/15 p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">direction</p>
          <p className="mt-1 text-[22px] font-semibold text-ice">{direction}</p>
        </div>
      </BlurFade>
    ))}
  </div>
);

export const InViewOnLight = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <BlurFade inView duration={0.6} blur="10px">
      <p className="max-w-md text-[22px] font-semibold leading-snug">
        One truckload or forty. Order size doesn't decide whether we pick up the phone.
      </p>
    </BlurFade>
  </div>
);
