import { Process1, Repeat, BadgeCheck, ShieldCheck, Settings2, Truck, Package, Boxes, Layers } from "agl-pallet";

export const HowWeWork = () => (
  <div className="bg-moss text-bone">
    <Process1
      steps={[
        {
          number: "01",
          title: "Understand your requirements.",
          description: "— Volume, specs, load behavior, delivery cadence — plus the handling conditions that decide whether a spec survives contact with your floor.",
          image: "/assets/stock/agl-geometry-wood-01_6d47.webp",
          href: "/request-a-quote/",
        },
        {
          number: "02",
          title: "Align supply and freight.",
          description: "— We match the spec to qualified shops — more than one — and plan the lanes at the same time, so sourcing and delivery aren't two separate problems.",
          image: "/assets/stock/agl-mill-lumber-01_0b74.webp",
          href: "/services/",
        },
        {
          number: "03",
          title: "Execute and communicate.",
          description: "— We book, track, and tell you early. Proactive updates, not status requests.",
          image: "/assets/stock/agl-freight-execute-01_0e78.webp",
          href: "/contact/",
        },
        {
          number: "04",
          title: "Keep adjusting.",
          description: "— Volumes move, specs change, plants open. We re-source and re-route rather than restating the original quote.",
          image: "/assets/stock/agl-broken-pallet-01_b7dc.webp",
          href: "/request-a-quote/",
        },
      ]}
    />
  </div>
);

export const SupplierOfferGrid = () => (
  <div className="bg-moss text-bone">
    <Process1
      layout="grid"
      heading="What working with AGL looks like"
      steps={[
        { title: "Recurring volume, not spot scraps.", description: "We're placing programs for manufacturers who order every week, not chasing one-off loads.", icon: Repeat, image: "/assets/stock/agl-filler-pallet-stack-05_3e39.webp", href: "#supplier-form" },
        { title: "Paid when we said we'd pay.", description: "Terms are terms. If that's the thing that's burned you before, ask us about it directly.", icon: BadgeCheck, image: "/assets/stock/agl-filler-pallet-stack-06_bb58.webp", href: "#supplier-form" },
        { title: "Zero channel conflict.", description: "We will never own manufacturing and we will never compete with you for your own accounts.", icon: ShieldCheck, image: "/assets/stock/agl-filler-pallet-stack-07_179a.webp", href: "/the-pledge/" },
        { title: "Work that fits your machines.", description: "We ask what your equipment runs well before we send you a spec, not after you've quoted it.", icon: Settings2, image: "/assets/stock/agl-industry-building-materials-02_188a.webp", href: "#supplier-form" },
        { title: "We handle the freight.", description: "You build. We book the truck and deal with the delivery window.", icon: Truck, image: "/assets/stock/agl-shipping-3pl-02_8474.webp", href: "/partners/carriers/" },
      ]}
    />
  </div>
);

export const Team = () => (
  <div className="bg-moss text-bone">
    <Process1
      layout="team"
      hairline
      eyebrow="The people who answer"
      heading="Five people, and you'll know which one is yours."
      description="AGL runs with a small team on purpose. Sourcing, freight, and the account are three people who sit near each other, not three queues in three systems."
      steps={[
        { title: "Owner", description: "Commercial, supply, and the last call on anything hard." },
        { title: "Logistics", description: "Books the freight and tracks the loads." },
        { title: "Supplier Relations", description: "Qualifies the mills and knows their machine constraints." },
        { title: "Operations", description: "" },
        { title: "IT", description: "" },
      ]}
    />
  </div>
);

export const IconStackOnLight = () => (
  <div className="surface-light bg-bone text-moss">
    <Process1
      heading="Where custom usually pays for itself"
      steps={[
        { title: "Overbuilt standard specs.", description: "Plenty of operations are buying more pallet than the load needs because the spec was set years ago for a heavier product.", icon: Package },
        { title: "Racking versus floor stacking.", description: "Static, dynamic, and racking are three separate load ratings, and the racking number is the one that gets missed.", icon: Boxes },
        { title: "Mixed programs.", description: "Multiple specs, staggered releases, several ship-to addresses — the coordination a single mill struggles with is the part we take on.", icon: Layers },
      ]}
    />
  </div>
);
