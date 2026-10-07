import { Hero1 } from "agl-pallet";

export const WithCapabilities = () => (
  <div className="bg-moss pb-12 text-bone">
    <Hero1
      eyebrow="Pallet brokerage · North Canton, Ohio"
      heading="Never one mill between you and your line."
      description="AGL Pallet sources new, custom, and engineered pallets from a network of family-run mills across the Midwest and Mid-Atlantic — and manages the freight on every order."
      buttons={[
        { label: "Request a quote", href: "/request-a-quote/", variant: "primary" },
        { label: "Supply pallets to AGL", href: "/partners/suppliers/", variant: "secondary" },
      ]}
      image={{ src: "/assets/stock/agl-filler-pallet-stack-02_0659.webp", alt: "Stacked pallets at a partner mill" }}
      secondaryImage={{ src: "/assets/stock/agl-manufacturing-forklift-01_86f4.webp", alt: "Forklift moving a pallet load" }}
      capabilities={[
        { heading: "Same-day quotes", body: "Send a spec and a quantity. We come back the same day with sources and a ship window." },
        { heading: "No minimums", body: "One truckload or forty. Order size does not decide whether we pick up the phone." },
        { heading: "Freight managed", body: "We book the carrier and own the delivery window from mill to dock." },
      ]}
    />
  </div>
);

export const PhotoOnly = () => (
  <div className="bg-moss text-bone">
    <Hero1
      eyebrow="For carriers"
      heading="Freight on every order means we always need capacity."
      description="Regional, repeatable lanes from family mills in Eastern Ohio and Western Pennsylvania out to plants across the Midwest and Mid-Atlantic."
      buttons={[{ label: "Get set up as a carrier", href: "/partners/carriers/", variant: "primary" }]}
      image={{ src: "/assets/stock/agl-carriers-01_8a45.webp", alt: "Truck loaded with pallets" }}
    />
  </div>
);
