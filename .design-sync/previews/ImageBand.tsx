import { ImageBand } from "agl-pallet";

export const Brokerage = () => (
  <div className="bg-moss pb-12 text-bone">
    <ImageBand
      eyebrow="Brokerage, not manufacturing"
      heading="We grow by coordinating more — never by owning a mill."
      body="After the lumber shock, too many brokers became competitors to the shops they used to buy from. AGL's pledge is the operating model: no plant of our own to feed."
      image={{ src: "/assets/stock/agl-filler-pallet-stack-03_3ef4.webp", alt: "Pallet stacks ready for dispatch" }}
      cta={{ label: "Read the pledge", href: "/the-pledge/" }}
    />
  </div>
);

export const HowWeWork = () => (
  <div className="bg-moss pb-12 text-bone">
    <ImageBand
      eyebrow="How we work"
      heading="Coordination is the product."
      body="We qualify the shops that supply them well, hold more than one source for every spec we quote, and book the freight so the pallets land when your line needs them."
      image={{ src: "/assets/agl_home_video_poster.jpg", alt: "" }}
      cta={{ label: "See how we work", href: "/how-we-work/" }}
    />
  </div>
);

export const NoCtaOnLight = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <ImageBand
      heading="Freight on every order."
      body="Pallets move from family mills in Eastern Ohio and Western Pennsylvania out to manufacturing plants across the Midwest and Mid-Atlantic — regional, repeatable lanes."
      image={{ src: "/assets/stock/agl-carriers-01_8a45.webp", alt: "Flatbed loaded with pallets" }}
    />
  </div>
);
