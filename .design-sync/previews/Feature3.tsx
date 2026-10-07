import { Feature3, Truck, ShieldCheck, Handshake } from "agl-pallet";

export const Numbered = () => (
  <div className="bg-moss py-12 text-bone">
    <Feature3
      variant="numbered"
      features={[
        {
          eyebrow: "01",
          title: "You hear it from us first",
          description: "Proactive updates, not status requests. If a load slips, the call comes from us with the fix already in motion — not from your receiving dock at 6am.",
          href: "/how-we-work/",
          src: "/assets/stock/agl-filler-pallet-stack-02_0659.webp",
        },
        {
          eyebrow: "02",
          title: "More than one mill per spec",
          description: "Every spec we sell has multiple qualified shops behind it. No single facility, no single region, no single point of failure between a lumber market and your line.",
          href: "/partners/suppliers/",
          src: "/assets/stock/agl-partner-mills-01_6763.webp",
        },
        {
          eyebrow: "03",
          title: "We've run the floor",
          description: "AGL was started by people who bought pallets for production lines. We know which corners cost money later and which specs are overbuilt for the job.",
          href: "/who-we-are/",
          src: "/assets/stock/agl-manufacturing-forklift-01_86f4.webp",
          imageClassName: "object-[center_78%]",
        },
      ]}
    />
  </div>
);

export const CardTwoUp = () => (
  <div className="bg-moss py-12 text-bone">
    <Feature3
      variant="card"
      columns={2}
      features={[
        {
          eyebrow: "For mills & shops",
          title: "We buy pallets. We'll never build them.",
          description: "Steady recurring volume, paid on time, from a broker with no plant of its own to feed.",
          href: "/partners/suppliers/",
          cta: { label: "Supply pallets to AGL", href: "/partners/suppliers/" },
          src: "/assets/stock/agl-mill-lumber-01_0b74.webp",
        },
        {
          eyebrow: "For carriers",
          title: "Freight on every order means we always need capacity.",
          description: "Regional lanes across the Midwest and Mid-Atlantic, moving pallets from mill to plant.",
          href: "/partners/carriers/",
          cta: { label: "Haul for AGL", href: "/partners/carriers/" },
          src: "/assets/stock/agl-carriers-01_8a45.webp",
        },
      ]}
    />
  </div>
);

export const DividedWithIcons = () => (
  <div className="bg-moss py-12 text-bone">
    <Feature3
      variant="divided"
      columns={3}
      eyebrow="Why AGL"
      heading="One call covers the pallet and the truck"
      features={[
        { title: "Managed freight on every order", description: "We book the carrier, track the load, and own the delivery window from mill to dock.", icon: Truck },
        { title: "ISPM-15 when you need it", description: "Heat-treated, stamped stock for export loads, sourced from certified mills.", icon: ShieldCheck },
        { title: "No minimums", description: "One truckload or forty. Order size does not decide whether we pick up the phone.", icon: Handshake },
      ]}
    />
  </div>
);

export const RuledOnLight = () => (
  <div className="surface-light bg-bone py-12 text-moss">
    <Feature3
      variant="ruled"
      columns={2}
      heading="Pallet types"
      features={[
        { title: "Stock GMA pallets", description: "48×40 four-way, the recurring-volume workhorse for grocery and general freight.", href: "/products/" },
        { title: "Custom footprints", description: "Built to your load, your racking, and your dock — any size, any deck pattern.", href: "/custom-engineered/" },
        { title: "Heat-treated export", description: "ISPM-15 stamped stock from certified mills for international shipments.", href: "/products/" },
        { title: "Crates & shipping blocks", description: "Dunnage, blocks, and stakes sourced alongside the pallet order.", href: "/products/" },
      ]}
    />
  </div>
);
