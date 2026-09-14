import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { getBlurDataURL } from "@/lib/blur";

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
  const blurDataURL = getBlurDataURL(backgroundImage);
  return (
    <section className="section-y-cta relative overflow-hidden px-6 text-white">
      <Image
        src={backgroundImage}
        alt=""
        fill
        quality={75}
        sizes="100vw"
        className="object-cover"
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
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
