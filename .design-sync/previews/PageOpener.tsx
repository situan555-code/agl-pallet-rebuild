import { PageOpener } from "agl-pallet";

export const InsetDark = () => (
  <div className="bg-moss text-bone">
    <PageOpener
      variant="inset-dark"
      eyebrow="Services"
      heading="Sourcing, qualification, and freight — as one desk."
      description="AGL is a pallet brokerage. We don't own mills and we don't own trucks. These are the coordinated services behind every quote."
    />
  </div>
);

export const LightTextWithBreadcrumb = () => (
  <div className="bg-moss text-bone">
    <PageOpener
      variant="light-text"
      eyebrow="Resources"
      heading="Pallet buying, explained by people who did it."
      description="Plain answers on pallet types, specs, heat treatment, and what a second source actually means — written from the buying side of the dock."
      cta={{ label: "Request a quote", href: "/request-a-quote/" }}
      breadcrumb={[{ name: "Home", href: "/" }, { name: "Resources" }]}
    />
  </div>
);

export const LightImage = () => (
  <div className="bg-moss text-bone">
    <PageOpener
      variant="light-image"
      eyebrow="Who we are"
      heading="We were the ones waiting on the pallets."
      description={[
        "AGL Pallet started on the buying side of the dock — by people who spent years specifying, buying, and waiting on pallets while a production schedule ran regardless.",
        "That's the experience the company is built out of, and it's why AGL is a brokerage rather than a plant.",
      ]}
      image={{ src: "/assets/stock/agl-filler-pallet-stack-02_0659.webp", alt: "Stacked pallets at a partner mill" }}
    />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone text-moss">
    <PageOpener
      variant="light-text"
      eyebrow="The pledge"
      heading="AGL will never own manufacturing."
      description="We grow by coordinating more volume and more lanes — not by buying plants. There is no roadmap where we compete with the shops that supply us."
      cta={{ label: "Read the pledge", href: "/the-pledge/" }}
    />
  </div>
);
