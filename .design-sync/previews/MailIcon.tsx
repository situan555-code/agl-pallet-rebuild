import { MailIcon } from "agl-pallet";

export const Sizes = () => (
  <div className="flex items-center gap-6 bg-moss p-8 text-bone">
    <MailIcon className="size-4" />
    <MailIcon className="size-5" />
    <MailIcon className="size-8" />
    <MailIcon className="size-8 text-ice" />
  </div>
);

export const InContext = () => (
  <div className="flex flex-wrap items-center gap-6 bg-moss p-8 text-bone">
    <span className="inline-flex items-center gap-2 text-link font-semibold">
      <MailIcon className="size-4" />
      sales@aglpallet.com
    </span>
    <span className="surface-light inline-flex items-center gap-2 rounded-full bg-bone px-4 py-2 text-link font-semibold text-moss">
      <MailIcon className="size-4" />
      sales@aglpallet.com
    </span>
  </div>
);
