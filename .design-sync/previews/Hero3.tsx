import { Hero3, CardMedia } from "agl-pallet";

export const InsetDark = () => (
  <div className="bg-moss text-bone">
    <Hero3
      eyebrow="For mills and shops"
      heading="We buy pallets. We'll never build them."
      description="AGL is a brokerage with no plant of its own and no intention of ever having one. When we bring you volume, we're not building a book to move in-house in three years."
      cta={{ label: "Tell us what you build", href: "#supplier-form" }}
    />
  </div>
);

export const LightTextWithBreadcrumb = () => (
  <div className="bg-moss text-bone">
    <Hero3
      variant="light-text"
      eyebrow="Resources"
      heading="Pallet buying, explained by people who did it."
      description="Plain answers on pallet types, specs, heat treatment, and what a second source means when AGL is a brokerage — not a mill."
      cta={{ label: "Request a quote", href: "/request-a-quote/" }}
      breadcrumb={[{ name: "Home", href: "/" }, { name: "Resources" }]}
    />
  </div>
);

export const LightImage = () => (
  <div className="bg-moss text-bone">
    <Hero3
      variant="light-image"
      eyebrow="Who we are"
      heading="We were the ones waiting on the pallets."
      description={[
        "AGL Pallet started on the buying side of the dock — by people who spent years specifying, buying, and waiting on pallets while a production schedule ran regardless.",
        "That's the experience the company is built out of, and it's why AGL is a brokerage rather than a plant.",
      ]}
      image={
        <div className="overflow-hidden rounded-card">
          <CardMedia src="/assets/stock/agl-filler-pallet-tagged-01_97bd.webp" alt="Tagged pallets in a mill yard" />
        </div>
      }
    />
  </div>
);

export const HeadingOnlyOnLight = () => (
  <div className="surface-light bg-bone text-moss">
    <Hero3 variant="light-text" eyebrow="How we work" heading="You hear it from us first." />
  </div>
);
