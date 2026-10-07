import { Container, SectionHeading } from "agl-pallet";

const cards = [
  { heading: "Same-day quotes", body: "Send a spec and a quantity before lunch, get a number back the same day." },
  { heading: "No minimums", body: "One truckload or forty. Order size doesn't decide whether we pick up the phone." },
  { heading: "Freight on every order", body: "We book and track the truck. One number covers the pallets and the delivery." },
];

export const CapabilityGrid = () => (
  <section className="bg-moss py-12 text-bone">
    <Container className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((cap) => (
        <div key={cap.heading} className="flex flex-col rounded-card border border-current/15 p-6">
          <h2 className="text-[22px] font-semibold leading-snug text-current">{cap.heading}</h2>
          <p className="mt-5 max-w-sm text-body text-current/75">{cap.body}</p>
        </div>
      ))}
    </Container>
  </section>
);

export const HeadingAndCopy = () => (
  <section className="bg-moss py-12 text-bone">
    <Container>
      <SectionHeading eyebrow="What we do" heading="One number for the spec, the pallets, and the truck." />
      <p className="prose-measure mt-5 text-body text-current/85">
        When something moves — a spec change, a volume spike, a mill running behind — you hear it from
        us before it becomes your problem. That's the job.
      </p>
    </Container>
  </section>
);

export const AsSectionOnLight = () => (
  <div className="surface-light bg-bone text-moss">
    <Container as="section" className="py-12">
      <SectionHeading eyebrow="How we work" heading="Four steps, and you know who owns each one." />
      <p className="prose-measure mt-5 text-body text-current/85">
        We match the spec to qualified shops — more than one — and plan the lanes at the same time, so
        sourcing and delivery aren't two separate problems.
      </p>
    </Container>
  </div>
);
