"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function HeroVideo({ src }: { src: string }) {
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

    const kick = () => {
      const el = videoRef.current;
      if (!el) return;
      el.muted = true;
      if (el.getAttribute("src") !== src) el.src = src;
      el.muted = true;
      void el.play().catch(() => {});
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => kick());
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(kick, 1);
    return () => window.clearTimeout(t);
  }, [reduce, src]);

  if (reduce) return null;

  return (
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
  );
}
