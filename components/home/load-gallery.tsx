"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Gallery4Props } from "@/components/gallery4";

const Gallery4 = dynamic<Gallery4Props>(
  () => import("@/components/gallery4").then((m) => ({ default: m.Gallery4 })),
  { ssr: false },
);

export function loadGallery(): Promise<{ default: ComponentType<Gallery4Props> }> {
  return import("@/components/gallery4").then(() => ({
    default: Gallery4,
  }));
}
