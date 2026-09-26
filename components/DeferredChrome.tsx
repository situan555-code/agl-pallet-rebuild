"use client";

import { useEffect, useState, type ReactNode } from "react";

// Toaster (sonner) and Speed Insights are not needed for first paint on any
// marketing page. Load them after idle so they stay out of the LCP graph.
export function DeferredChrome() {
  const [nodes, setNodes] = useState<ReactNode>(null);

  useEffect(() => {
    let cancelled = false;
    const kick = () => {
      void Promise.all([
        import("@/components/Toaster"),
        import("@vercel/speed-insights/next"),
      ]).then(([toaster, insights]) => {
        if (cancelled) return;
        const Toaster = toaster.Toaster;
        const SpeedInsights = insights.SpeedInsights;
        setNodes(
          <>
            <Toaster />
            <SpeedInsights />
          </>,
        );
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(kick, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const t = window.setTimeout(kick, 1);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

  return nodes;
}
