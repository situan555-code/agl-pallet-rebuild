import { QuoteCopyButton, Phone, Mail } from "agl-pallet";

export const OnContactCard = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="relative max-w-sm">
      <div className="rounded-card border border-current/15 p-6">
        <Phone className="size-5 text-ice" aria-hidden />
        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">Phone Number</p>
        <p className="mt-2 text-[22px] font-semibold leading-snug text-current">234-286-0402</p>
        <span className="mt-4 inline-flex text-body font-semibold text-ice">Call</span>
      </div>
      <div className="absolute right-4 top-4 z-10">
        <QuoteCopyButton value="234-286-0402" />
      </div>
    </div>
  </div>
);

export const Inline = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="flex items-center gap-2 text-body">
      <Mail className="size-4 text-current/70" aria-hidden />
      <span className="font-semibold">sales@aglpallet.com</span>
      <QuoteCopyButton value="sales@aglpallet.com" />
    </div>
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <div className="flex items-center gap-2 text-body">
      <Phone className="size-4 text-current/70" aria-hidden />
      <span className="font-semibold">234-286-0402</span>
      <QuoteCopyButton value="234-286-0402" />
    </div>
  </div>
);
