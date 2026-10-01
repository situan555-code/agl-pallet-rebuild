/**
 * Ohio outline with dots representing plant locations across the state.
 * Used in the multi-plant program case study card (shot list #18).
 * Brand colors: moss #131913, ice #DDE9E2, bone #ECE8DF.
 */
export function OhioPlantMap({ className }: { className?: string }) {
  // Simplified Ohio outline path (public-domain shape, approximate)
  // Viewbox normalised to the bounding box of Ohio.
  const plants = [
    { cx: 90,  cy: 80,  label: "Northwest" },
    { cx: 185, cy: 65,  label: "North-central" },
    { cx: 290, cy: 75,  label: "Northeast" },
    { cx: 75,  cy: 160, label: "West-central" },
    { cx: 195, cy: 155, label: "Central" },
    { cx: 300, cy: 155, label: "East-central" },
    { cx: 120, cy: 250, label: "Southwest" },
    { cx: 220, cy: 270, label: "South-central" },
  ];

  return (
    <div
      className={className}
      aria-label="Map of Ohio showing plant locations"
      role="img"
    >
      <svg
        viewBox="0 0 380 330"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-full w-full"
      >
        {/* Ohio outline — simplified polygon approximation */}
        <path
          d="M 55 30
             L 310 20
             L 335 50
             L 345 120
             L 340 180
             L 310 250
             L 280 295
             L 240 310
             L 190 315
             L 140 305
             L 95 280
             L 60 240
             L 45 180
             L 40 100
             Z"
          fill="#1F2A1F"
          stroke="#DDE9E2"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Plant location dots */}
        {plants.map((p) => (
          <g key={p.label}>
            <circle cx={p.cx} cy={p.cy} r={10} fill="#131913" stroke="#DDE9E2" strokeWidth="1.5" />
            <circle cx={p.cx} cy={p.cy} r={4}  fill="#DDE9E2" />
          </g>
        ))}
      </svg>
    </div>
  );
}
