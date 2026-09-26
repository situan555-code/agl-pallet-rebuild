"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { insetOuterClass, insetPadClass, insetSurfaceClass } from "@/components/Container";
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
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className={cn("section-rhythm scroll-mt-24 bg-moss", insetOuterClass, className)}>
      <div className={cn(insetSurfaceClass, insetPadClass, "relative isolate min-h-96 overflow-hidden nav:min-h-120")}>
        <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
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
        </motion.div>
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
