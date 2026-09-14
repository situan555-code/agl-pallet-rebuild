import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { FadeIn } from "@/components/FadeIn";

export function ProcessStepGrid({
  eyebrow,
  heading,
  steps,
}: {
  eyebrow: string;
  heading: string;
  steps: { icon: string; heading: string; body: string }[];
}) {
  return (
    <section className="section-y bg-brand-green px-6 text-white">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" theme="dark" />
        <div className="mt-12 grid gap-10 nav:grid-cols-4">
          {steps.map((step) => (
            <FadeIn key={step.heading} className="text-center">
              <Image src={step.icon} alt="" width={48} height={48} className="mx-auto" />
              <h5 className="mt-4 text-step-sm">{step.heading}</h5>
              <p className="mt-2 text-body text-white/80">{step.body}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
