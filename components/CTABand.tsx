import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";

export function CTABand({
  eyebrow,
  heading,
  body,
  backgroundImage,
  cta,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  backgroundImage: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden px-6 py-[150px] text-white">
      <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-brand-green/50" />
      <FadeIn className="relative mx-auto max-w-[1440px] text-center">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" theme="dark" />
        <p className="mx-auto mt-6 max-w-2xl text-body">{body}</p>
        <div className="mt-8 flex justify-center">
          <Button href={cta.href} label={cta.label} variant="pill-light" />
        </div>
      </FadeIn>
    </section>
  );
}
