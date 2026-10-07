import { InteractiveCard, CardMedia, IconTile, Phone } from "agl-pallet";

export const CapabilityCard = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm">
      <InteractiveCard href="/request-a-quote/">
        <CardMedia alt="Same-day quotes" src="/assets/stock/agl-filler-pallet-tagged-01_97bd.webp" />
        <div className="flex flex-1 flex-col p-6">
          <h2 className="text-[22px] font-semibold leading-snug text-current">Same-day quotes</h2>
          <p className="mt-5 max-w-sm text-body text-current/75">
            Send a spec and a quantity before lunch, get a number back the same day.
          </p>
        </div>
      </InteractiveCard>
    </div>
  </div>
);

export const ProductLineOnLight = () => (
  <div className="surface-light bg-bone p-8 text-moss">
    <div className="max-w-sm">
      <InteractiveCard id="crates" href="/request-a-quote/">
        <CardMedia alt="Crates" src="/assets/stock/agl-crates-03_1540.webp" />
        <div className="flex flex-1 flex-col p-6">
          <h2 className="text-[22px] font-semibold leading-snug text-current">Crates</h2>
          <p className="mt-5 text-body text-current/75">
            Custom and stock crating for equipment, components, and high-value goods that need containment beyond palletization.
          </p>
        </div>
      </InteractiveCard>
    </div>
  </div>
);

export const ContactTile = () => (
  <div className="bg-moss p-8 text-bone">
    <div className="max-w-sm">
      <InteractiveCard href="tel:+12342860402" className="p-6">
        <IconTile icon={Phone} />
        <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray">Call sales</p>
        <p className="mt-2 text-[22px] font-semibold leading-snug text-current">234-286-0402</p>
        <span className="mt-4 inline-flex text-body font-semibold text-ice">Call</span>
      </InteractiveCard>
    </div>
  </div>
);
