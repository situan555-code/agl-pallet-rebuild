import { FadeIn } from "@/components/FadeIn";

export function TimelineSection({
  steps,
}: {
  steps: { number: string; heading: string; body: string }[];
}) {
  return (
    <section className="section-y px-6">
      <div className="relative mx-auto max-w-[1440px]">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-5 top-0 w-px bg-brand-green"
        />
        <ol className="space-y-20">
          {steps.map((step) => (
            <li key={step.number} className="relative pl-16">
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-mint font-display text-[12px] uppercase leading-none text-brand-green ring-4 ring-paper"
              >
                {step.number}
              </div>
              <FadeIn>
                <h5 className="text-step-lg text-brand-green">{step.heading}</h5>
                <p className="mt-2 max-w-2xl text-body text-ink/55">{step.body}</p>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
