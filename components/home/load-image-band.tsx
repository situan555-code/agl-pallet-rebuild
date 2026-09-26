"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type ImageBandProps = {
  eyebrow?: string;
  heading: string;
  body: string;
  image: { src: string; alt: string };
  cta?: { label: string; href: string };
  className?: string;
};

const ImageBand = dynamic<ImageBandProps>(
  () => import("@/components/ImageBand").then((m) => ({ default: m.ImageBand })),
  { ssr: false },
);

export function loadImageBand(): Promise<{ default: ComponentType<ImageBandProps> }> {
  return import("@/components/ImageBand").then(() => ({
    default: ImageBand,
  }));
}
