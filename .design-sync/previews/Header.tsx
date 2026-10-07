import { Header } from "agl-pallet";

// Header is `position: fixed` (NavFrame); transform-gpu makes the story wrapper its
// containing block so each cell keeps its own pill nav.
export const OnMoss = () => (
  <div className="relative min-h-32 transform-gpu bg-moss text-bone">
    <Header />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light relative min-h-32 transform-gpu bg-bone text-moss">
    <Header />
  </div>
);
