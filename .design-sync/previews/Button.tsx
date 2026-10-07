import { Button } from "agl-pallet";

export const Primary = () => (
  <div className="flex flex-wrap items-center gap-4 bg-moss p-8 text-bone">
    <Button href="/request-a-quote/" label="Request a quote" />
    <Button href="/request-a-quote/" label="Request a quote" arrow={false} />
  </div>
);

export const Secondary = () => (
  <div className="flex flex-wrap items-center gap-4 bg-moss p-8 text-bone">
    <Button href="/" label="Back to Home" variant="secondary" />
    <Button href="/how-we-work/" label="How we work" variant="secondary" arrow={false} />
  </div>
);

export const Ghost = () => (
  <div className="flex flex-wrap items-center gap-4 bg-moss p-8 text-bone">
    <Button href="/faq/" label="Read the FAQ" variant="ghost" />
  </div>
);

export const OnLightSurface = () => (
  <div className="surface-light flex flex-wrap items-center gap-4 bg-bone p-8 text-moss">
    <Button href="/request-a-quote/" label="Request a quote" />
    <Button href="/partners/suppliers/" label="Supply pallets to AGL" variant="secondary" />
  </div>
);
