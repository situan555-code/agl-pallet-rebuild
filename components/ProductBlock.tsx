import Image from "next/image";
import { Button } from "@/components/Button";
import { FadeIn } from "@/components/FadeIn";

export function ProductBlock({
  id,
  heading,
  tagline,
  body,
  image,
  imageSide,
  edgeShape,
  cta,
}: {
  id: string;
  heading: string;
  tagline: string;
  body: string;
  image: string;
  imageSide: "left" | "right";
  edgeShape?: "left" | "right";
  cta: { label: string; href: string };
}) {
  const textBlock = (
    <FadeIn key="text">
      <h2 className="text-display-2 text-brand-green">{heading}</h2>
      <div className="mt-6 space-y-4">
        <p className="text-body font-bold">{tagline}</p>
        <p className="text-body">{body}</p>
      </div>
      <div className="mt-8">
        <Button href={cta.href} label={cta.label} />
      </div>
    </FadeIn>
  );

  const imageBlock = (
    <FadeIn key="image" className="relative aspect-[4/3] w-full">
      {edgeShape && (
        <div
          aria-hidden="true"
          className={`absolute top-1/2 hidden h-[180px] w-[400px] -translate-y-1/2 bg-brand-green nav:block ${
            edgeShape === "right" ? "right-[-100px]" : "left-[-100px]"
          }`}
        />
      )}
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 980px) 50vw, 100vw"
        className="object-cover"
      />
    </FadeIn>
  );

  return (
    <section id={id} className="scroll-mt-24 overflow-hidden px-6 py-[75px]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 nav:grid-cols-2">
        {imageSide === "left" ? [imageBlock, textBlock] : [textBlock, imageBlock]}
      </div>
    </section>
  );
}
