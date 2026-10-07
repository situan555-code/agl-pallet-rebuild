import { HamburgerIcon } from "agl-pallet";

export const Sizes = () => (
  <div className="flex items-center gap-6 bg-moss p-8 text-bone">
    <HamburgerIcon className="size-4" />
    <HamburgerIcon className="size-5" />
    <HamburgerIcon className="size-8" />
    <HamburgerIcon className="size-8 text-ice" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-6 bg-moss p-8 text-bone">
    <span className="inline-flex items-center gap-2 text-link font-semibold">
      <HamburgerIcon className="size-4" />
      Menu
    </span>
    <span className="surface-light inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-link font-semibold text-moss">
      <HamburgerIcon className="size-4" />
      Menu
    </span>
  </div>
);
