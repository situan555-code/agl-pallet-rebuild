import { DotPattern, SectionHeading } from "agl-pallet";

export const SectionBackdrop = () => (
  <div className="relative overflow-hidden bg-moss p-12 text-bone">
    <DotPattern className="text-ice/20" />
    <div className="relative max-w-md">
      <SectionHeading eyebrow="Network" heading="Family-run mills behind every spec" />
    </div>
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light relative overflow-hidden bg-bone p-12 text-moss">
    <DotPattern className="text-moss/10" />
    <div className="relative max-w-md">
      <SectionHeading eyebrow="Partners" heading="We buy pallets. We'll never build them." />
    </div>
  </div>
);

export const WideSpacing = () => (
  <div className="relative py-24 overflow-hidden bg-moss text-bone">
    <DotPattern width={28} height={28} cx={2} cy={2} cr={2} className="text-ice/40" />
  </div>
);
