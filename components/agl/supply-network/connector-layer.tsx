import * as m from "motion/react-m";
import { SignalDot } from "./signal-dot";
import type { ActiveNode, Geometry, Point } from "./supply-network.types";

/** Distance before the hub where the three source lines merge. */
const MERGE_OFFSET = 48;
const EASE = [0.16, 1, 0.3, 1] as const;

export function createConvergingPath(start: Point, end: Point) {
  const dx = end.x - start.x;
  const c1 = { x: start.x + dx * 0.45, y: start.y };
  const c2 = { x: end.x - dx * 0.35, y: end.y };
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

function opacityFor(id: string, active: ActiveNode, sourceIds: string[]) {
  const isSource = sourceIds.includes(id);
  if (active === null) return isSource ? 0.28 : id === "trunk" ? 0.5 : 0.6;
  if (active === "agl") return isSource ? 0.5 : 0.75;
  if (active === "destination") return id === "output" ? 0.75 : isSource ? 0.2 : 0.4;
  if (isSource) return active === id ? 0.75 : 0.12;
  return id === "trunk" ? 0.75 : 0.45;
}

export function ConnectorLayer({
  geometry,
  active,
  show,
  animated,
}: {
  geometry: Geometry;
  active: ActiveNode;
  show: boolean;
  animated: boolean;
}) {
  const { width, height, sources, hubLeft, hubRight, destinationLeft } = geometry;
  const ids = Object.keys(sources);
  const merge: Point = { x: hubLeft.x - MERGE_OFFSET, y: hubLeft.y };

  const paths = [
    ...ids.map((id) => ({ id, d: createConvergingPath(sources[id], merge) })),
    { id: "trunk", d: `M ${merge.x} ${merge.y} L ${hubLeft.x} ${hubLeft.y}` },
    { id: "output", d: createConvergingPath(hubRight, destinationLeft) },
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full text-ice min-[1024px]:block"
    >
      {paths.map((p, i) => {
        const strokeOpacity = opacityFor(p.id, active, ids);
        const common = {
          d: p.d,
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.25,
          strokeLinecap: "round" as const,
          strokeOpacity,
          style: { transition: "stroke-opacity 300ms ease-out" },
        };
        if (!animated) return <path key={p.id} {...common} />;
        return (
          <m.path
            key={p.id}
            {...common}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.5 + (i < ids.length ? i * 0.08 : 0.4), ease: EASE }}
          />
        );
      })}

      <m.g
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: show || !animated ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
      >
        <circle cx={merge.x} cy={merge.y} r={7} fill="currentColor" fillOpacity={0.07} />
        <circle cx={merge.x} cy={merge.y} r={3} fill="currentColor" />
      </m.g>

      {animated && show
        ? ids.map((id, i) => (
            <g key={id} className="text-ice">
              <SignalDot
                d={`${createConvergingPath(sources[id], merge)} L ${hubLeft.x} ${hubLeft.y}`}
                delay={3.5 + i * 6.5}
              />
            </g>
          ))
        : null}
    </svg>
  );
}
