type CapabilityItem = {
  heading: string;
  body: string;
};

export function CapabilityTrio({ items }: { items: CapabilityItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      {items.map((item, i) => (
        <div
          key={item.heading}
          className={`py-10 md:px-12 md:py-0 ${
            i > 0 ? "border-t border-brand-green/15 md:border-l md:border-t-0" : ""
          }`}
        >
          <h3 className="text-display-kicker text-brand-green">{item.heading}</h3>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-brand-green/30" />
          <p className="mt-4 max-w-sm text-body text-ink/55">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
