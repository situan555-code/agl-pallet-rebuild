import { RuleList } from "agl-pallet";

export const ContactRows = () => (
  <div className="bg-moss py-8 text-bone">
    <RuleList
      layout="contact"
      items={[
        { title: "I need a quote", body: "— specs and quantity, and we'll come back the same day.", href: "/request-a-quote/" },
        { title: "I build pallets", body: "— tell us what your shop runs.", href: "/partners/suppliers/#supplier-form" },
        { title: "I haul freight", body: "— get set up as a carrier.", href: "/partners/carriers/#carrier-form" },
        { title: "Something else", body: "— an existing order, a spec question, or anything that isn't the above.", href: "#general-form" },
      ]}
    />
  </div>
);

export const IndustriesOnLight = () => (
  <div className="surface-light bg-bone py-8 text-moss">
    <RuleList
      layout="industries"
      items={[
        { title: "Building materials", body: "Lumber, stone, roofing, and construction components. Heavy, dense, often irregular, and frequently stored outdoors." },
        { title: "Chemicals & coatings", body: "Drums, totes, and bulk containers where load stability isn't optional." },
        { title: "Shipping, distribution & 3PL", body: "High throughput, multiple ship-to points, and mixed specs across sites." },
      ]}
    />
  </div>
);
