"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";

type HeroButton = {
  label: string;
  href: string;
};

export function HeroExpand({
  eyebrow,
  heading,
  description,
  buttons,
  video,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  buttons: HeroButton[];
  video: { src: string; poster: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [primary, ...rest] = buttons;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.55], [0.92, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [18, 0]);

  useEffect(() => {
    if (reduce) return;

    const start = () => {
      const kick = () => {
        const el = videoRef.current;
        if (!el) return;
        el.muted = true;
        if (el.getAttribute("src") !== video.src) {
          el.src = video.src;
        }
        el.muted = true;
        void el.play().catch(() => {});
      };
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => kick());
      } else {
        setTimeout(kick, 1);
      }
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start);
    return () => window.removeEventListener("load", start);
  }, [reduce, video.src]);

  return (
    <div ref={trackRef} className={cn("relative bg-moss text-bone", reduce ? "" : "h-[165vh]")}>
      <div className={cn("flex flex-col justify-end", reduce ? "relative" : "sticky top-0 min-h-svh")}>
        <div className={cn(containerClass, "pt-28 pb-8 nav:pt-32")}>
          <p className="mx-auto text-center text-eyebrow font-semibold uppercase tracking-wide text-ice">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {eyebrow}
          </p>
          <h1 className="display mx-auto mt-4 max-w-3xl text-center text-display-1 text-bone nav:text-[56px] nav:leading-[1.08]">
            {heading}
          </h1>
          <p className="prose-measure mx-auto mt-5 max-w-3xl text-center text-body text-bone/80">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            {primary ? <Button href={primary.href} label={primary.label} variant="primary" /> : null}
            {rest.length > 0 ? (
              <div className="flex flex-col items-center gap-3 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:justify-center">
                {rest.map((button) => (
                  <Button
                    key={button.label}
                    href={button.href}
                    label={button.label}
                    variant="secondary"
                    arrow={false}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={containerClass}>
        <motion.div
          className={cn(
            "relative w-full overflow-hidden will-change-transform",
            reduce && "rounded-card"
          )}
          style={reduce ? undefined : { scale, borderRadius: radius }}
        >
          <div className="relative aspect-3/4 w-full md:aspect-video">
            <Image
              src={video.poster}
              alt=""
              fill
              priority
              quality={60}
              sizes="100vw"
              className="object-cover object-center"
            />
            {reduce ? null : (
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                  playing ? "opacity-100" : "opacity-0"
                )}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster={video.poster}
                onPlaying={() => setPlaying(true)}
              />
            )}
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
