import { FadeIn } from "@/components/FadeIn";

export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section className="section-y bg-brand-green px-6 text-white">
      <div className="mx-auto grid max-w-3xl gap-6 text-center nav:grid-cols-2 nav:gap-10">
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
