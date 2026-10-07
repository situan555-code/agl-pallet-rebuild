import { PhoneIcon } from "agl-pallet";

export const Sizes = () => (
  <div className="flex items-center gap-6 bg-moss p-8 text-bone">
    <PhoneIcon className="size-4" />
    <PhoneIcon className="size-5" />
    <PhoneIcon className="size-8" />
    <PhoneIcon className="size-8 text-ice" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-6 bg-moss p-8 text-bone">
    <span className="inline-flex items-center gap-2 text-link font-semibold">
      <PhoneIcon className="size-4" />
      Call AGL Pallet
    </span>
    <span className="surface-light inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-link font-semibold text-moss">
      <PhoneIcon className="size-4" />
      Call AGL Pallet
    </span>
  </div>
);
