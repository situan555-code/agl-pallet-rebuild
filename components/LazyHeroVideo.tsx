"use client";

import { useEffect, useState, type ComponentType } from "react";

export function LazyHeroVideo({ src }: { src: string }) {
  const [Video, setVideo] = useState<ComponentType<{ src: string }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    const kick = () => {
      void import("@/components/HeroVideo").then((mod) => {
        if (!cancelled) setVideo(() => mod.HeroVideo);
      });
    };
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(kick);
      } else {
        window.setTimeout(kick, 1);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start);
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, []);

  if (!Video) return null;
  return <Video src={src} />;
}
