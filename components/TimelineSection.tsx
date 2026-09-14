import { FadeIn } from "@/components/FadeIn";

export function TimelineSection({
  steps,
}: {
  steps: { number: string; heading: string; body: string }[];
}) {
  return (
    <section className="section-y bg-surface px-6">
      <div className="relative mx-auto max-w-[1440px]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 bg-brand-green nav:block"
        />
        <ol className="space-y-12 nav:space-y-0">
          {steps.map((step, i) => (
            <li key={step.number} className="relative nav:grid nav:grid-cols-2 nav:gap-x-20 nav:py-16">
              <div
                aria-hidden="true"
                className="relative z-10 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-surface bg-brand-green text-button text-white nav:absolute nav:left-1/2 nav:top-1/2 nav:mx-0 nav:mb-0 nav:-translate-x-1/2 nav:-translate-y-1/2"
              >
                {step.number}
              </div>
              <FadeIn className={i % 2 === 0 ? "text-center nav:col-start-1 nav:text-left" : "text-center nav:col-start-2 nav:text-left"}>
                <h5 className="text-step-lg text-brand-green">{step.heading}</h5>
                <p className="mx-auto mt-2 max-w-md text-body text-ink/80 nav:mx-0">{step.body}</p>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
