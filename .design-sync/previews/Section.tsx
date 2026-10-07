import { Section, SectionHeading, Button } from "agl-pallet";

const Body = () => (
  <>
    <SectionHeading eyebrow="What we do" heading="One number for the spec, the pallets, and the truck." />
    <p className="prose-measure mt-5 text-body text-current/85">
      AGL is a pallet brokerage. We don't own a mill and we don't own trucks. What we own is the
      coordination: we qualify the shops that supply them well, hold more than one source for every
      spec we quote, and book the freight so the pallets land when your line needs them.
    </p>
    <div className="mt-8 flex flex-wrap items-center gap-4">
      <Button href="/request-a-quote/" label="Request a quote" />
      <Button href="/how-we-work/" label="How we work" variant="secondary" arrow={false} />
    </div>
  </>
);

export const Dark = () => (
  <div className="bg-moss text-bone">
    <Section id="what-we-do" variant="dark">
      <Body />
    </Section>
  </div>
);

export const DarkWithGrainAndDots = () => (
  <div className="bg-moss text-bone">
    <Section variant="dark" grain dots>
      <Body />
    </Section>
  </div>
);

export const InsetGreen = () => (
  <div className="bg-moss px-4 py-12 text-bone md:px-6">
    <Section variant="inset-green" dots className="mx-auto w-full max-w-[1280px] rounded-section bg-green">
      <Body />
    </Section>
  </div>
);

export const Light = () => (
  <div className="surface-light bg-bone text-moss">
    <Section variant="light" grain>
      <Body />
    </Section>
  </div>
);

export const InsetLight = () => (
  <div className="bg-moss px-4 py-12 md:px-6">
    <Section
      variant="inset-light"
      dots
      className="surface-light mx-auto w-full max-w-[1280px] rounded-section bg-bone text-moss"
    >
      <Body />
    </Section>
  </div>
);
