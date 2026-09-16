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
          className={`py-10 md:py-[100px] ${
            i === 0 ? "md:pr-12" : i === items.length - 1 ? "md:pl-12" : "md:px-12"
          } ${i > 0 ? "border-t border-brand-green/20 md:border-l md:border-t-0" : ""}`}
        >
          <h3 className="text-display-kicker text-brand-green">{item.heading}</h3>
          <span aria-hidden="true" className="mt-4 block h-px w-8 bg-brand-green/40" />
          <p className="mt-4 max-w-sm text-body text-ink/55">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
