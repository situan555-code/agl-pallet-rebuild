import Image from "next/image";
import { Button } from "@/components/Button";

export function Hero({
  eyebrow,
  heading,
  body,
  image,
  cta,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  cta: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden pt-[144px]">
      <Image
        src={image}
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-green/50" />
      <div className="relative mx-auto max-w-[1440px] px-6 pt-8 pb-[162px] text-white">
        <p className="text-eyebrow font-semibold uppercase tracking-wide">
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-[720px] break-words text-display-1">{heading}</h1>
        <p className="mt-6 max-w-2xl text-body">{body}</p>
        <div className="mt-8">
          <Button href={cta.href} label={cta.label} variant="pill-light" />
        </div>
      </div>
    </section>
  );
}
