import { IconTile, Truck, ShieldCheck, Handshake, Phone, Mail, MessageSquare, Factory } from "agl-pallet";

export const FeatureIcon = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm">
      <IconTile icon={Truck} />
      <h3 className="mt-5 text-display-kicker text-current">Managed freight on every order</h3>
      <p className="mt-3 text-body text-current/80">We book the carrier, track the load, and own the delivery window.</p>
    </div>
  </div>
);

export const IconSet = () => (
  <div className="flex flex-wrap items-center gap-4 bg-moss p-8 text-bone">
    <IconTile icon={Phone} />
    <IconTile icon={Mail} />
    <IconTile icon={MessageSquare} />
    <IconTile icon={ShieldCheck} />
    <IconTile icon={Handshake} />
    <IconTile icon={Factory} />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light flex flex-wrap items-center gap-4 bg-bone p-8 text-moss">
    <IconTile icon={Truck} />
    <IconTile icon={ShieldCheck} />
    <IconTile icon={Handshake} />
  </div>
);
