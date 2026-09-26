"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;

    const start = () => {
      const kick = () => {
        const el = videoRef.current;
        if (!el) return;
        el.muted = true;
        if (el.getAttribute("src") !== src) el.src = src;
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
  }, [reduce, src]);

  return (
    <div className="hero-frame relative mx-auto w-full overflow-hidden shadow-lg aspect-video rounded-section">
      <Image
        src={poster}
        alt=""
        fill
        priority
        fetchPriority="high"
        quality={60}
        sizes="min(100vw, 828px)"
        className="object-cover object-center"
      />
      {reduce ? null : (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onPlaying={() => setPlaying(true)}
        />
      )}
    </div>
  );
}
