// Adapted from @shadcnblocks/hero1 (free). Layout kept: copy column + media
// column on a two-column grid. Demo defaultProps removed: every string comes
// from content JSON. Restyled to the AGL green ground; image is a local
// next/image with priority (LCP) instead of the demo CDN <img>.
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Button";
import { getBlurDataURL } from "@/lib/blur";

type Hero1Button = {
  label: string;
  href: string;
  variant: "pill-light" | "ghost-light";
};

interface Hero1Props {
  eyebrow: string;
  heading: string;
  description: string;
  buttons: Hero1Button[];
  image: { src: string; alt: string };
  className?: string;
}

const Hero1 = ({ eyebrow, heading, description, buttons, image, className }: Hero1Props) => {
  const blurDataURL = getBlurDataURL(image.src);
  return (
    <section className={cn("scroll-mt-24 bg-brand-green px-6 pb-16 pt-36 text-white nav:pb-24", className)}>
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 nav:grid-cols-12 nav:gap-16">
        <div className="flex flex-col items-start nav:col-span-7">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-[720px] break-words text-display-1 nav:text-[56px] nav:leading-[1.1]">
            {heading}
          </h1>
          <p className="prose-measure mt-6 text-body text-white/85">{description}</p>
          <div className="mt-10 flex flex-col items-start gap-4 min-[560px]:flex-row min-[560px]:flex-wrap">
            {buttons.map((button) => (
              <Button key={button.label} href={button.href} label={button.label} variant={button.variant} />
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm nav:col-span-5 nav:aspect-[4/5]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={75}
            sizes="(min-width: 980px) 38vw, 100vw"
            className="object-cover"
            placeholder={blurDataURL ? "blur" : undefined}
            blurDataURL={blurDataURL}
          />
        </div>
      </div>
    </section>
  );
};

export { Hero1 };
