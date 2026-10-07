import { Gallery4, CardMedia, OhioPlantMap } from "agl-pallet";

const studies = [
  {
    id: "food-packaging-line",
    title: "Food packaging line",
    description: "Dual-source stock pallet program with managed inbound freight for a recurring Midwest packaging schedule.",
    href: "/case-studies/#food-packaging-line",
    image: "/assets/stock/agl-industry-food-beverage-02_e497.webp",
  },
  {
    id: "engineered-oversize",
    title: "Engineered oversize",
    description: "Custom footprint and deck rating sourced through more than one qualified shop, freight booked to a single receiving window.",
    href: "/case-studies/#engineered-oversize",
    image: "/assets/stock/agl-filler-pallet-stack-01_6e56.webp",
  },
  {
    id: "multi-plant-program",
    title: "Multi-plant program",
    description: "One brokerage relationship covering staggered plant schedules across regional lanes — mills and carriers coordinated from a single desk.",
    href: "/case-studies/#multi-plant-program",
    image: "",
  },
  {
    id: "crate-and-dunnage",
    title: "Crate and dunnage",
    description: "Containment package beyond the pallet: crates and dunnage specified with the load, not as an afterthought.",
    href: "/case-studies/#crate-and-dunnage",
    image: "/assets/stock/agl-crates-02_58f6.webp",
  },
];

export const CaseStudies = () => (
  <div className="bg-moss text-bone">
    <Gallery4
      tone="paper"
      eyebrow="Selected work"
      title="Programs worth the write-up — when the facts are ready."
      description="Structural examples only. Titles and outcomes stay unpublished until approved. Brokerage story only — we don't pretend to be the mill."
      items={studies.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        href: s.href,
        visual:
          s.id === "multi-plant-program" ? (
            <OhioPlantMap className="aspect-[4/3] w-full overflow-hidden rounded-t-card bg-green" />
          ) : (
            <CardMedia src={s.image} alt={s.title} className="overflow-hidden rounded-t-card" />
          ),
      }))}
    />
  </div>
);

export const PlaceholderVisualsOnLight = () => (
  <div className="surface-light bg-bone text-moss">
    <Gallery4
      eyebrow="Case studies"
      title="Brokerage work, written up when it's cleared."
      items={studies.map((s) => ({ id: `${s.id}-ph`, title: s.title, description: s.description, href: s.href }))}
    />
  </div>
);
