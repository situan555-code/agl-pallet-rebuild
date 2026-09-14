import Image from "next/image";

type ContactInfoItem = {
  icon: string;
  hoverIcon: string;
  label: string;
  value: string;
  href: string;
};

export function ContactInfoStrip({ items }: { items: ContactInfoItem[] }) {
  return (
    <section className="section-y mx-auto max-w-[1440px] px-6">
      <div className="grid grid-cols-1 gap-8 nav:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group flex flex-col items-center gap-4 rounded-input bg-surface-alt p-8 text-center transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            <span className="relative block h-12 w-12">
              <Image
                src={item.icon}
                alt=""
                fill
                sizes="48px"
                className="object-contain opacity-100 transition-opacity duration-300 group-hover:opacity-0"
              />
              <Image
                src={item.hoverIcon}
                alt=""
                fill
                sizes="48px"
                className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <span className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
              {item.label}
            </span>
            <span className="text-step-sm font-semibold text-brand-green">{item.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
