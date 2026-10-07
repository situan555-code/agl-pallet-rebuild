import { ArrowRightIcon } from "agl-pallet";

export const Sizes = () => (
  <div className="flex items-center gap-6 bg-moss p-8 text-bone">
    <ArrowRightIcon className="size-4" />
    <ArrowRightIcon className="size-5" />
    <ArrowRightIcon className="size-8" />
    <ArrowRightIcon className="size-8 text-ice" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-6 bg-moss p-8 text-bone">
    <span className="inline-flex items-center gap-2 text-link font-semibold">
      <ArrowRightIcon className="size-4" />
      Request a quote
    </span>
    <span className="surface-light inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-link font-semibold text-moss">
      <ArrowRightIcon className="size-4" />
      Request a quote
    </span>
  </div>
);
