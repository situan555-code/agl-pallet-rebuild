import { OhioPlantMap } from "agl-pallet";

export const CaseStudyCardVisual = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm overflow-hidden rounded-card border border-current/15">
      <OhioPlantMap className="aspect-[4/3] w-full overflow-hidden rounded-t-card bg-green" />
      <div className="p-6">
        <h3 className="text-[22px] font-semibold leading-snug">Multi-plant program</h3>
        <p className="mt-5 text-body text-current/75">
          One brokerage relationship covering staggered plant schedules across regional lanes — mills and carriers coordinated from a single desk.
        </p>
      </div>
    </div>
  </div>
);

export const Standalone = () => (
  <div className="bg-moss p-8 text-bone">
    <OhioPlantMap className="aspect-[4/3] w-full max-w-xl" />
  </div>
);
