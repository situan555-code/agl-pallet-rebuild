import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { getBlurDataURL } from "@/lib/blur";

export function TextWithSideImage({
  eyebrow,
  heading,
  paragraphs,
  image,
  alt,
  imageSide,
  edgeShape,
  cta,
}: {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  image: string;
  alt: string;
  imageSide: "left" | "right";
  edgeShape?: "left" | "right";
  cta?: { label: string; href: string };
}) {
  const blurDataURL = getBlurDataURL(image);
  const textBlock = (
    <FadeIn key="text">
      <SectionHeading eyebrow={eyebrow} heading={heading} />
      <div className="mt-6 space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="prose-measure text-body">
            {p}
          </p>
        ))}
      </div>
      {cta && (
        <div className="mt-8">
          <Button href={cta.href} label={cta.label} />
        </div>
      )}
    </FadeIn>
  );

  const imageBlock = (
    <FadeIn key="image" className="relative aspect-[4/3] w-full overflow-hidden">
      {edgeShape && (
        <div
          aria-hidden="true"
          className={`absolute top-1/2 hidden h-[180px] w-[120px] -translate-y-1/2 bg-brand-green nav:block ${
            edgeShape === "right" ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
          }`}
        />
      )}
      <Image
        src={image}
        alt={alt}
        fill
        quality={75}
        sizes="(min-width: 1488px) 696px, (min-width: 980px) calc(50vw - 48px), calc(100vw - 48px)"
        className="object-cover"
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
    </FadeIn>
  );

  return (
    <section className="section-y overflow-hidden px-6">
      <div className="mx-auto grid max-w-[1440px] items-start gap-10 nav:grid-cols-2 nav:gap-12">
        {imageSide === "left" ? [imageBlock, textBlock] : [textBlock, imageBlock]}
      </div>
    </section>
  );
}
