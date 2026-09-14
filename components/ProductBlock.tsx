import Image from "next/image";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";
import { getBlurDataURL } from "@/lib/blur";

export function ProductBlock({
  id,
  heading,
  tagline,
  body,
  image,
  alt,
  imageSide,
  edgeShape,
  cta,
  priority,
}: {
  id: string;
  heading: string;
  tagline: string;
  body: string;
  image: string;
  alt: string;
  imageSide: "left" | "right";
  edgeShape?: "left" | "right";
  cta: { label: string; href: string };
  priority?: boolean;
}) {
  const blurDataURL = getBlurDataURL(image);
  const textBlock = (
    <FadeIn key="text">
      <h2 className="text-display-2 text-brand-green">{heading}</h2>
      <div className="mt-6 space-y-4">
        <p className="text-lead prose-measure">{tagline}</p>
        <p className="prose-measure text-body">{body}</p>
      </div>
      <div className="mt-8">
        <Button href={cta.href} label={cta.label} />
      </div>
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
        priority={priority}
        sizes="(min-width: 1488px) 696px, (min-width: 980px) calc(50vw - 48px), calc(100vw - 48px)"
        className="object-cover"
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
    </FadeIn>
  );

  return (
    <section id={id} className="section-y overflow-hidden px-6">
      <div className="mx-auto grid max-w-[1440px] items-start gap-12 nav:grid-cols-2">
        {imageSide === "left" ? [imageBlock, textBlock] : [textBlock, imageBlock]}
      </div>
    </section>
  );
}
