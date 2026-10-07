import { NetworkBeam } from "agl-pallet";

export const HomeNetwork = () => (
  <div className="bg-moss text-bone">
    <NetworkBeam
      mills={["Family-run mills", "Qualified shops", "More than one source"]}
      center="AGL Pallet"
      right="Your line"
    />
  </div>
);

export const FourSources = () => (
  <div className="bg-moss text-bone">
    <NetworkBeam
      mills={["Eastern Ohio mills", "Western PA shops", "Heat-treat partners", "Regional carriers"]}
      center="AGL Pallet"
      right="Your receiving dock"
    />
  </div>
);
