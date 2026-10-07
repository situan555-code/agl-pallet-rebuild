import { Cta4 } from "agl-pallet";

export const ClosingBand = () => (
  <div className="bg-moss text-bone">
    <Cta4
      heading="Let's talk about your pallet supply."
      description="Send a spec and a quantity, or just call and describe the problem."
      button={{ label: "Request a quote", href: "/request-a-quote/" }}
    />
  </div>
);

export const WithEyebrowAndFeatures = () => (
  <div className="bg-moss text-bone">
    <Cta4
      eyebrow="Request a quote"
      heading="Send us a spec and a quantity."
      description="We'll come back the same day, with more than one qualified source behind whatever you're buying."
      features={["Same-day quotes", "No minimums", "Managed freight on every order"]}
      button={{ label: "Request a quote", href: "/request-a-quote/" }}
    />
  </div>
);

export const CaseStudiesOnLight = () => (
  <div className="surface-light bg-bone text-moss">
    <Cta4
      heading="Have a supply problem worth documenting?"
      description="If your line needs a dual-source plan or a cleaner freight story, we'll build it quietly — and publish the write-up only when the facts are cleared."
      button={{ label: "Request a quote", href: "/request-a-quote/" }}
    />
  </div>
);
