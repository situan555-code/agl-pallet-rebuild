import { ThemeToggle, Button } from "agl-pallet";

export const InHeader = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="flex items-center justify-end gap-3">
      <ThemeToggle />
      <Button href="/request-a-quote/" label="Request a quote" arrow={false} />
    </div>
  </div>
);

export const OnDark = () => (
  <div className="bg-moss p-8 text-bone">
    <ThemeToggle />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <ThemeToggle />
  </div>
);
