import { Reveal, SectionHeading } from "agl-pallet";

export const SectionIntro = () => (
  <div className="bg-moss p-8 text-bone">
    <Reveal className="max-w-md">
      <SectionHeading eyebrow="FAQ" heading="Buyer questions" />
      <p className="prose-measure mt-5 text-body">Straight answers to the questions buyers ask on the first call.</p>
    </Reveal>
  </div>
);

export const StaggeredOnLight = () => (
  <div className="surface-light flex max-w-md flex-col gap-4 bg-bone p-8 text-moss">
    {[
      "Send a spec and a quantity.",
      "We match it to a qualified mill.",
      "We book and track the truck.",
    ].map((line, i) => (
      <Reveal key={line} delay={i * 0.12}>
        <p className="border-t border-current/15 pt-4 text-body font-semibold">
          {`0${i + 1}  ${line}`}
        </p>
      </Reveal>
    ))}
  </div>
);
