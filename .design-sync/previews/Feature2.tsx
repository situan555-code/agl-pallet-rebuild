import { Feature2 } from "agl-pallet";

export const Pledge = () => (
  <div className="bg-moss pb-12 text-bone">
    <Feature2
      eyebrow="The pledge"
      heading="We will never own a mill."
      paragraphs={[
        "After the COVID lumber shock, a lot of pallet brokers bought factories. Volume that had run through family mills for years quietly moved to the broker's own plants. It left both sides wary — mills don't trust a broker who competes with them, and buyers don't trust a broker who became a manufacturer.",
        "AGL doesn't own manufacturing and has no intention of ever owning it. We grow by coordinating more, not by building plants. That's why good mills give us capacity, and it's why there's always more than one shop that can build your spec.",
      ]}
      cta={{ label: "Read the pledge", href: "/the-pledge/" }}
    />
  </div>
);

export const NoCtaOnLight = () => (
  <div className="surface-light bg-bone pb-12 text-moss">
    <Feature2
      heading="Our position is structural, not a slogan"
      paragraphs={[
        "AGL owns no manufacturing and has no intention of acquiring any, indefinitely. We grow by coordinating more volume and more lanes — not by buying plants. There is no roadmap where we compete with the shops that supply us.",
        "That's the reason good mills give us capacity, and it's the reason we can put more than one qualified source behind every spec we quote.",
      ]}
    />
  </div>
);
