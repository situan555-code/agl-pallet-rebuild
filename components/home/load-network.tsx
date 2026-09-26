"use client";

// Imported only after the network diagram is near the viewport, so this
// next/dynamic split is not an initial home-page script.
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export type NetworkBeamProps = {
  mills: string[];
  center: string;
  right: string;
  className?: string;
};

const NetworkBeam = dynamic<NetworkBeamProps>(
  () => import("@/components/NetworkBeam").then((m) => ({ default: m.NetworkBeam })),
  { ssr: false },
);

export function loadNetwork(): Promise<{ default: ComponentType<NetworkBeamProps> }> {
  return import("@/components/NetworkBeam").then(() => ({
    default: NetworkBeam,
  }));
}
