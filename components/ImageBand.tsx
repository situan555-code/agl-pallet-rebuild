// Dense full-bleed photographic band for mid-page visual weight.
// Quiet B2B: AGL-green wash over local imagery, clay rule, cream type.
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getBlurDataURL } from "@/lib/blur";

interface ImageBandProps {
  eyebrow?: string;
  heading: string;
  body: string;
  image: { src: string; alt: string };
  cta?: { label: string; href: string };
  className?: string;
}

export function ImageBand({ eyebrow, heading, body, image, cta, className }: ImageBandProps) {
  const blur = getBlurDataURL(image.src);
  return (
    <section className={cn("relative isolate min-h-112 overflow-hidden scroll-mt-24 nav:min-h-136", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        quality={72}
        sizes="100vw"
        className="object-cover"
        placeholder={blur ? "blur" : undefined}
        blurDataURL={blur}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-brand-green/82" />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-r from-brand-green via-brand-green/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-112 max-w-[1440px] items-center px-6 py-20 nav:min-h-136 nav:py-28">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="text-eyebrow font-semibold uppercase tracking-wide text-fog-green">
              <span aria-hidden="true" className="mr-2 font-bold text-clay">
                /
              </span>
              {eyebrow}
            </p>
          )}
          <span aria-hidden="true" className="mt-5 block h-0.5 w-14 bg-clay" />
          <h2 className="mt-6 text-display-2 text-cream">{heading}</h2>
          <p className="prose-measure mt-5 text-body text-cream/85">{body}</p>
          {cta && (
            <div className="mt-8">
              <Button href={cta.href} label={cta.label} variant="pill-light" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
