import { SectionHeading } from "agl-pallet";

export const WithEyebrow = () => (
  <div className="bg-moss p-8 text-bone">
    <SectionHeading eyebrow="What we do" heading="One number for the spec, the pallets, and the truck." />
  </div>
);

export const HeadingOnly = () => (
  <div className="bg-moss p-8 text-bone">
    <SectionHeading heading="Buyer questions" />
  </div>
);

export const Centered = () => (
  <div className="bg-moss p-8 text-bone">
    <SectionHeading align="center" eyebrow="How we work" heading="Four steps, and you know who owns each one." />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <SectionHeading eyebrow="Why AGL" heading="One call covers the pallet and the truck" />
  </div>
);
