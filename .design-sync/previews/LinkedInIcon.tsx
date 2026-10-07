import { LinkedInIcon } from "agl-pallet";

export const Sizes = () => (
  <div className="flex items-center gap-6 bg-moss p-8 text-bone">
    <LinkedInIcon className="size-4" />
    <LinkedInIcon className="size-5" />
    <LinkedInIcon className="size-8" />
    <LinkedInIcon className="size-8 text-ice" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-6 bg-moss p-8 text-bone">
    <span className="inline-flex items-center gap-2 text-link font-semibold">
      <LinkedInIcon className="size-4" />
      LinkedIn
    </span>
    <span className="surface-light inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-link font-semibold text-moss">
      <LinkedInIcon className="size-4" />
      LinkedIn
    </span>
  </div>
);
