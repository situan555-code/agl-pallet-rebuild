import { Toggle, Truck, ShieldCheck, Repeat } from "agl-pallet";

export const Default = () => (
  <div className="flex flex-wrap items-center gap-3 bg-moss p-8 text-bone">
    <Toggle aria-label="Include freight"><Truck /> Freight</Toggle>
    <Toggle defaultPressed aria-label="Heat-treated (ISPM-15)"><ShieldCheck /> ISPM-15</Toggle>
    <Toggle aria-label="Recurring order"><Repeat /> Recurring</Toggle>
  </div>
);

export const Outline = () => (
  <div className="flex flex-wrap items-center gap-3 bg-moss p-8 text-bone">
    <Toggle variant="outline" aria-label="Include freight"><Truck /> Freight</Toggle>
    <Toggle variant="outline" defaultPressed aria-label="Heat-treated (ISPM-15)"><ShieldCheck /> ISPM-15</Toggle>
  </div>
);

export const Sizes = () => (
  <div className="flex flex-wrap items-center gap-3 bg-moss p-8 text-bone">
    <Toggle size="sm" variant="outline" aria-label="Freight"><Truck /></Toggle>
    <Toggle size="default" variant="outline" aria-label="Freight"><Truck /></Toggle>
    <Toggle size="lg" variant="outline" aria-label="Freight"><Truck /></Toggle>
  </div>
);

export const GlassOnLight = () => (
  <div className="surface-light flex flex-wrap items-center gap-3 bg-bone p-8 text-moss">
    <Toggle variant="glass" aria-label="Include freight"><Truck /> Freight</Toggle>
    <Toggle variant="glass" aria-label="Recurring order"><Repeat /> Recurring</Toggle>
  </div>
);
