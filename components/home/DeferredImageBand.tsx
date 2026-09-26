"use client";

import Image from "next/image";
import { Button } from "@/components/Button";
import { insetOuterClass, insetPadClass, insetSurfaceClass } from "@/components/Container";
import { WhenNear } from "@/components/home/WhenNear";
import type { ImageBandProps } from "@/components/home/load-image-band";
import { getBlurDataURL } from "@/lib/blur";
import { cn } from "@/lib/utils";

function load() {
  return import("@/components/home/load-image-band").then((mod) => mod.loadImageBand());
}

function ImageBandPlaceholder({ eyebrow, heading, body, image, cta, className }: ImageBandProps) {
  const blur = getBlurDataURL(image.src);
  return (
    <section className={cn("section-rhythm scroll-mt-24 bg-moss", insetOuterClass, className)}>
      <div className={cn(insetSurfaceClass, insetPadClass, "relative isolate min-h-96 overflow-hidden nav:min-h-120")}>
        <div className="absolute inset-0">
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
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-moss/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-moss/70 via-moss/25 to-transparent"
        />
        <div className="relative z-10 flex min-h-96 items-center py-16 text-bone nav:min-h-120 nav:py-20">
          <div className="max-w-xl">
            {eyebrow && (
              <p className="text-eyebrow font-semibold uppercase tracking-wide text-ice">
                <span aria-hidden="true" className="mr-2 font-bold">
                  /
                </span>
                {eyebrow}
              </p>
            )}
            <h2 className="mt-3 text-display-2 text-bone">{heading}</h2>
            <p className="prose-measure mt-5 text-body text-bone/85">{body}</p>
            {cta && (
              <div className="mt-8">
                <Button href={cta.href} label={cta.label} variant="secondary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function DeferredImageBand(props: ImageBandProps) {
  return (
    <WhenNear
      load={load}
      componentProps={props}
      placeholder={<ImageBandPlaceholder {...props} />}
    />
  );
}
