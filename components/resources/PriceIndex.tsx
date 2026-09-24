// BLS Producer Price Index for wood pallets, from content/resources/data/ppi.json
// (downloaded from FRED). One-series line chart with an HTML table behind it;
// the lumber index is compared in the table only (different base period, so
// it never shares the chart's axis).
import ppi from "@/content/resources/data/ppi.json";
import { ArticleSection, DataTable } from "@/components/resources/ResourceArticle";
import { fmt } from "@/lib/calculators";
import { PPI_CSV_PATH, PPI_DATASET_DESCRIPTION } from "@/lib/ppi-dataset";
import { formatDate } from "@/lib/resources";

type Obs = [string, number];

const [pallets, lumber] = ppi.series.map((s) => ({ ...s, observations: s.observations as Obs[] }));
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const PRICE_INDEX_TOC = { id: "price-index", label: "Pallet price index" };

function monthLabel(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

function pct(now: number, then: number) {
  const change = (now / then - 1) * 100;
  return `${change >= 0 ? "+" : "−"}${fmt(Math.abs(change), 1)}%`;
}

function valueAt(obs: Obs[], ym: string) {
  return obs.find(([d]) => d === ym)?.[1];
}

function priorYear(ym: string) {
  const [y, m] = ym.split("-");
  return `${Number(y) - 1}-${m}`;
}

/** Quarterly averages, newest first, with change vs. the same months a year earlier. */
function quarterRows(fromYear: number) {
  const quarters = new Map<string, string[]>();
  for (const [ym] of pallets.observations) {
    const [y, m] = ym.split("-").map(Number);
    if (y < fromYear) continue;
    const key = `${y} Q${Math.ceil(m / 3)}`;
    quarters.set(key, [...(quarters.get(key) ?? []), ym]);
  }
  const avg = (obs: Obs[], months: string[]) => {
    const values = months.map((m) => valueAt(obs, m)).filter((v): v is number => v !== undefined);
    return values.length === months.length ? values.reduce((a, b) => a + b, 0) / values.length : undefined;
  };
  return [...quarters.entries()].reverse().map(([key, months]) => {
    const partial = months.length < 3 ? ` (${MONTHS[Number(months[0].slice(5)) - 1]}–${MONTHS[Number(months.at(-1)!.slice(5)) - 1]})` : "";
    const cells = [pallets, lumber].flatMap((s) => {
      const now = avg(s.observations, months);
      const then = avg(s.observations, months.map(priorYear));
      return [now !== undefined ? fmt(now, 1) : "—", now !== undefined && then !== undefined ? pct(now, then) : "—"];
    });
    return [`${key}${partial}`, ...cells];
  });
}

function Chart() {
  const obs = pallets.observations;
  const W = 720;
  const H = 300;
  const m = { top: 16, right: 64, bottom: 30, left: 44 };
  const values = obs.map(([, v]) => v);
  const yMin = Math.floor(Math.min(...values) / 20) * 20;
  const yMax = Math.ceil(Math.max(...values) / 20) * 20;
  const ticks = Array.from({ length: (yMax - yMin) / 20 + 1 }, (_, i) => yMin + i * 20);
  const step = (W - m.left - m.right) / (obs.length - 1);
  const x = (i: number) => m.left + i * step;
  const y = (v: number) => m.top + ((yMax - v) / (yMax - yMin)) * (H - m.top - m.bottom);
  const path = obs.map(([, v], i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const last = obs.length - 1;
  const title = `${pallets.shortName}, monthly, ${monthLabel(obs[0][0])} to ${monthLabel(obs[last][0])} (${pallets.base})`;

  return (
    <figure className="mt-8">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="ppi-chart-title ppi-chart-desc" className="h-auto w-full overflow-visible">
        <title id="ppi-chart-title">{title}</title>
        <desc id="ppi-chart-desc">
          Line chart. The same data appears as quarterly averages in the table that follows. Latest value {fmt(obs[last][1], 1)} in{" "}
          {monthLabel(obs[last][0])}.
        </desc>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity={t === yMin ? 0.35 : 0.12} className="text-ink" />
            <text x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink/70 text-[12px]">
              {t}
            </text>
          </g>
        ))}
        {obs.map(([d], i) =>
          d.endsWith("-01") ? (
            <text key={d} x={x(i)} y={H - m.bottom + 18} textAnchor="middle" className="fill-ink/70 text-[12px]">
              {d.slice(0, 4)}
            </text>
          ) : null
        )}
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="text-brand-green" />
        <circle cx={x(last)} cy={y(obs[last][1])} r={4} className="fill-brand-green" />
        <text x={x(last) + 8} y={y(obs[last][1])} dy="0.32em" className="fill-ink text-[12px] font-semibold">
          {fmt(obs[last][1], 1)}
        </text>
        {obs.map(([d, v], i) => (
          <g key={d} className="group">
            <rect x={x(i) - step / 2} y={m.top} width={step} height={H - m.top - m.bottom} fill="transparent">
              <title>{`${monthLabel(d)}: ${fmt(v, 1)}`}</title>
            </rect>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={m.top}
              y2={H - m.bottom}
              stroke="currentColor"
              strokeOpacity={0.3}
              className="pointer-events-none text-ink opacity-0 group-hover:opacity-100"
            />
            <circle cx={x(i)} cy={y(v)} r={4} className="pointer-events-none fill-brand-green opacity-0 group-hover:opacity-100" />
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-[14px] leading-relaxed text-ink/70">
        {title}. Source: {pallets.publisher}, series{" "}
        <a href={pallets.href} rel="noopener" className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4">
          {pallets.id}
        </a>
        , via FRED. Retrieved {formatDate(ppi.retrieved)}.
      </figcaption>
    </figure>
  );
}

export function PriceIndex() {
  const obs = pallets.observations;
  const [latestMonth, latest] = obs[obs.length - 1];
  const yearAgo = valueAt(obs, priorYear(latestMonth));
  const peak = obs.reduce((a, b) => (b[1] > a[1] ? b : a));
  const lumberLatest = lumber.observations[lumber.observations.length - 1];
  const lumberYearAgo = valueAt(lumber.observations, priorYear(lumberLatest[0]));

  return (
    <ArticleSection section={{ id: PRICE_INDEX_TOC.id, heading: "The pallet price index, 2019 to date" }}>
      <div className="prose-measure mt-6 space-y-4 text-body text-ink/85">
        <p>
          The BLS index for wood pallets stood at {fmt(latest, 1)} in {monthLabel(latestMonth)}
          {yearAgo !== undefined && <>, {pct(latest, yearAgo)} from a year earlier</>}. It peaked at {fmt(peak[1], 1)} in{" "}
          {monthLabel(peak[0])}, after the 2021 lumber price spike. The lumber index was{" "}
          {lumberYearAgo !== undefined ? pct(lumberLatest[1], lumberYearAgo) : "—"} year over year in {monthLabel(lumberLatest[0])}.
        </p>
        <p>
          An index shows the direction and size of a change, not a dollar price. A rising index means producer selling prices for
          the category rose on average across the products BLS samples; it does not say what any one pallet costs.
        </p>
      </div>
      <Chart />
      <DataTable
        table={{
          caption: "Quarterly average index values and change vs. the same months a year earlier",
          columns: ["Quarter", `${pallets.shortName} (${pallets.base})`, "Year over year", `${lumber.shortName} (${lumber.base})`, "Year over year"],
          rows: quarterRows(2022),
          note: `Averages of monthly, not seasonally adjusted values for series [${pallets.id}](${pallets.href}) and [${lumber.id}](${lumber.href}), retrieved from FRED on ${formatDate(ppi.retrieved)}. BLS revises data up to four months after first publication; the next PPI release is scheduled for ${formatDate(ppi.nextRelease)}.`,
        }}
      />
      <p className="prose-measure mt-6 text-body text-ink/85">
        {PPI_DATASET_DESCRIPTION}{" "}
        <a
          href={PPI_CSV_PATH}
          className="font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-4 hover:decoration-brand-green"
        >
          Download the monthly series (CSV)
        </a>
        .
      </p>
    </ArticleSection>
  );
}
