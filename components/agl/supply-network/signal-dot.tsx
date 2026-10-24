import * as m from "motion/react-m";

/**
 * A small dot that occasionally travels a path from a source into the hub.
 * One pass takes `duration` seconds, then the dot rests for `rest` seconds.
 */
export function SignalDot({
  d,
  delay,
  duration = 3,
  rest = 17,
}: {
  d: string;
  delay: number;
  duration?: number;
  rest?: number;
}) {
  return (
    <m.circle
      r={2}
      fill="currentColor"
      style={{ offsetPath: `path("${d}")` }}
      initial={{ offsetDistance: "0%", opacity: 0 }}
      animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 0.85, 0.85, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: rest,
        ease: "easeInOut",
        times: [0, 0.1, 0.9, 1],
      }}
    />
  );
}
