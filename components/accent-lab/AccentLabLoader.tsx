"use client";

import dynamic from "next/dynamic";

// Client-only: the lab reads the tester's saved picks from localStorage on
// first render, which would mismatch server HTML. It is an internal tool, so
// skipping SSR costs nothing that matters (route is noindex and unlisted).
const AccentLab = dynamic(() => import("./AccentLab"), {
  ssr: false,
  loading: () => <main className="min-h-[70vh]" aria-busy="true" />,
});

export function AccentLabLoader() {
  return <AccentLab />;
}
