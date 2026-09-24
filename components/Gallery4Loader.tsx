"use client";

// Loads the carousel after first paint. A static next/dynamic import was
// still emitted as an initial <script>, so the gallery bundle stayed on
// the mobile LCP graph.
import { useEffect, useState, type ComponentType } from "react";
import type { Gallery4Props } from "@/components/gallery4";

export function Gallery4Loader(props: Gallery4Props) {
  const [Gallery, setGallery] = useState<ComponentType<Gallery4Props> | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("@/components/gallery4").then((mod) => {
      if (!cancelled) setGallery(() => mod.Gallery4);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Gallery) return null;
  return <Gallery {...props} />;
}
