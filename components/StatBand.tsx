import { FadeIn } from "@/components/FadeIn";

export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="bg-brand-green px-6 py-[85px] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 text-center nav:grid-cols-2">
        {stats.map((stat) => (
          <FadeIn key={stat.label}>
            <p className="text-display-1">{stat.value}</p>
            <p className="mt-2 text-body">{stat.label}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
