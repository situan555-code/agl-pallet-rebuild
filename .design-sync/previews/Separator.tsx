import { Separator, Phone, Mail } from "agl-pallet";

export const Horizontal = () => (
  <div className="bg-moss p-8 text-bone">
    <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">Same-day quotes</p>
    <p className="mt-2 text-body text-current/85">Send a spec and a quantity before lunch, get a number back the same day.</p>
    <Separator className="my-6 h-px w-full bg-ice/30" />
    <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">No minimums</p>
    <p className="mt-2 text-body text-current/85">One truckload or forty. Order size doesn't decide whether we pick up the phone.</p>
  </div>
);

export const Vertical = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="flex h-12 items-center gap-4 text-body">
      <span className="inline-flex items-center gap-2"><Phone className="size-4" aria-hidden /> 234-286-0402</span>
      <Separator orientation="vertical" className="h-5 w-px bg-ice/30" />
      <span className="inline-flex items-center gap-2"><Mail className="size-4" aria-hidden /> sales@aglpallet.com</span>
      <Separator orientation="vertical" className="h-5 w-px bg-ice/30" />
      <span>Same-day quotes</span>
    </div>
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <p className="font-semibold">Stock GMA pallets</p>
    <p className="mt-2 text-body text-current/85">48×40 four-way, the recurring-volume workhorse for grocery and general freight.</p>
    <Separator className="my-6 h-px w-full" />
    <p className="font-semibold">Heat-treated export</p>
    <p className="mt-2 text-body text-current/85">ISPM-15 stamped stock from certified mills for international shipments.</p>
  </div>
);
