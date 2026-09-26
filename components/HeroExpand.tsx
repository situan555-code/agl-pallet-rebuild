"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";
import { containerClass } from "@/components/Container";
import { Button } from "@/components/Button";

type HeroButton = {
  label: string;
  href: string;
};

function useWideScreen() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return wide;
}

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
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startScaleRef = useRef(0.56);
  const reduce = useReducedMotion();
  const wide = useWideScreen();
  const animate = wide && reduce === false;
  const [playing, setPlaying] = useState(false);
  const [primary, ...rest] = buttons;

  useEffect(() => {
    if (!animate) return;
    const measure = () => {
      const width = frameRef.current?.clientWidth ?? 0;
      if (width <= 0) return;
      startScaleRef.current = Math.min(width * 0.56, 820) / width;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [animate]);

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) => {
    const track = trackRef.current;
    if (!track) return 0;
    const from = track.offsetTop;
    const span = window.innerHeight || 1;
    return Math.min(1, Math.max(0, (y - from) / span));
  });
  const scale = useTransform(progress, (p) => {
    const start = startScaleRef.current;
    return start + (1 - start) * p;
  });
  const radius = useTransform(progress, (p) => {
    const start = startScaleRef.current;
    const current = start + (1 - start) * p;
    const visual = 28 + (20 - 28) * p;
    return visual / Math.max(current, 0.05);
  });

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
    <div ref={trackRef} data-hero-track className="relative bg-moss text-bone">
      <div className={cn(animate ? "sticky top-0" : "relative")}>
        <div className={cn(containerClass, "pt-28 pb-6 nav:pt-32")}>
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

        <div className={cn(containerClass, "pb-8")}>
          <VideoCard
            animate={animate}
            frameRef={frameRef}
            videoRef={videoRef}
            scale={scale}
            radius={radius}
            poster={video.poster}
            reduce={reduce === true}
            playing={playing}
            onPlaying={() => setPlaying(true)}
          />
        </div>
      </div>
      {animate ? <div aria-hidden="true" className="h-svh" /> : null}
    </div>
  );
}

function VideoCard({
  animate,
  frameRef,
  videoRef,
  scale,
  radius,
  poster,
  reduce,
  playing,
  onPlaying,
}: {
  animate: boolean;
  frameRef: RefObject<HTMLDivElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  scale: MotionValue<number>;
  radius: MotionValue<number>;
  poster: string;
  reduce: boolean;
  playing: boolean;
  onPlaying: () => void;
}) {
  return (
    <motion.div
      ref={frameRef}
      className={cn(
        "relative mx-auto w-full overflow-hidden shadow-lg",
        animate ? "aspect-video origin-center" : "aspect-[4/5] rounded-section md:aspect-video"
      )}
      style={animate ? { scale, borderRadius: radius } : { borderRadius: 28 }}
    >
      <Image
        src={poster}
        alt=""
        fill
        priority
        quality={60}
        sizes="(min-width: 1280px) 1184px, 100vw"
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
          poster={poster}
          onPlaying={onPlaying}
        />
      )}
    </motion.div>
  );
}
