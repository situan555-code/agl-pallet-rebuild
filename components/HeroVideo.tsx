"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const FRAME_ASPECT = 16 / 9;

export function HeroVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [fill, setFill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) return;

    const syncFit = (el: HTMLVideoElement) => {
      if (!el.videoHeight) return;
      // Coded frame is 16:9; a non-1 SAR makes videoWidth wider (2304×1080).
      // object-fill undoes that stretch so the loop matches the poster.
      setFill(el.videoWidth / el.videoHeight > FRAME_ASPECT + 0.02);
    };

    const kick = () => {
      const el = videoRef.current;
      if (!el) return;
      el.muted = true;
      if (el.getAttribute("src") !== src) el.src = src;
      el.muted = true;
      syncFit(el);
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
        "absolute inset-0 h-full w-full transition-opacity duration-500",
        fill ? "object-fill" : "object-cover",
        playing ? "opacity-100" : "opacity-0",
      )}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onLoadedMetadata={(event) => {
        const el = event.currentTarget;
        if (!el.videoHeight) return;
        setFill(el.videoWidth / el.videoHeight > FRAME_ASPECT + 0.02);
      }}
      onPlaying={() => setPlaying(true)}
    />
  );
}
