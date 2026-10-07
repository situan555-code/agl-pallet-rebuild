import { Feature1, CardMedia } from "agl-pallet";

const Photo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-card">
    <CardMedia src={src} alt={alt} />
  </div>
);

export const WithMedia = () => (
  <div className="bg-moss pb-12 text-bone">
    <Feature1
      eyebrow="What we do"
      heading="One number for the spec, the pallets, and the truck."
      paragraphs={[
        "AGL is a pallet brokerage. We don't own a mill and we don't own trucks. What we own is the coordination: we qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them.",
        "When something moves — a spec change, a volume spike, a mill running behind — you hear it from us before it becomes your problem. That's the job.",
      ]}
      media={<Photo src="/assets/stock/agl-partner-mills-01_6763.webp" alt="Partner mill floor" />}
    />
  </div>
);

export const PanelMediaLeft = () => (
  <div className="bg-moss pb-12 text-bone">
    <Feature1
      panel
      mediaSide="left"
      eyebrow="Who we are"
      heading="People who stood on the other side of the dock."
      paragraphs={[
        "AGL started in North Canton, Ohio in January 2026, run by people who spent years buying pallets for manufacturers — living through capacity crunches, material shortages, and pricing whiplash from the receiving end.",
      ]}
      cta={{ label: "Meet the team", href: "/who-we-are/" }}
      media={<Photo src="/assets/stock/agl-manufacturing-forklift-01_86f4.webp" alt="Forklift on a plant floor" />}
    />
  </div>
);

export const TextOnly = () => (
  <div className="bg-moss pb-12 text-bone">
    <Feature1
      heading="What we need from you"
      paragraphs={[
        "Consistent build quality against the spec, honest lead times — including when they slip — and a phone call when something changes. That's most of it. We qualify shops on whether the pallets are right and whether we hear the truth early, not on being the cheapest quote in the file.",
      ]}
    />
  </div>
);

export const OnLightWithCta = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <Feature1
      eyebrow="How engagement works"
      heading="A quote is a plan, not a price scrap."
      paragraphs={[
        "Send a spec and a quantity — or describe the failure mode you're tired of living with. We come back with sources, a freight path, and the assumptions underneath the number.",
      ]}
      cta={{ label: "Talk through a spec", href: "/request-a-quote/" }}
      media={<Photo src="/assets/stock/agl-crates-01_4b0f.webp" alt="Custom crates staged for shipment" />}
    />
  </div>
);
