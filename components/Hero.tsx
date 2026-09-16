import Image from "next/image";
import { Button } from "@/components/Button";
import { getBlurDataURL } from "@/lib/blur";

export function Hero({
  eyebrow,
  heading,
  body,
  image,
  buttons,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  buttons: { label: string; href: string; variant: "pill-light" | "ghost-light" }[];
}) {
  const blurDataURL = getBlurDataURL(image);
  return (
    <section className="scroll-mt-24 relative overflow-hidden pt-36">
      <Image
        src={image}
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover"
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
      />
      <div className="absolute inset-0 bg-brand-green/50" />
      <div className="relative mx-auto max-w-[1440px] px-6 pt-8 pb-40 text-white">
        <p className="text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-[720px] break-words text-display-1">{heading}</h1>
        {/* Lede-only scrim: opaque brand-green panel behind body copy only (About G3 used /70 full-hero; local lede panel is opaque so bright pallet stacks cannot punch through) — not the headline. */}
        <p className="mt-6 max-w-2xl rounded-md bg-brand-green px-4 py-3 text-body">
          {body}
        </p>
        <div className="mt-8 flex flex-col items-start gap-4 min-[560px]:flex-row min-[560px]:flex-wrap">
          {buttons.map((button) => (
            <Button key={button.label} href={button.href} label={button.label} variant={button.variant} />
          ))}
        </div>
      </div>
    </section>
  );
}
