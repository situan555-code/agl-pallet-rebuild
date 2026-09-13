export function SectionHeading({
  eyebrow,
  heading,
  align = "left",
  theme = "light",
}: {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p
          className={`text-eyebrow font-semibold uppercase tracking-wide ${
            theme === "dark" ? "text-white" : "text-eyebrow-ink"
          }`}
        >
          <span aria-hidden="true" className="mr-2 font-bold">
            /
          </span>
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-4 text-display-2 ${theme === "dark" ? "text-white" : "text-brand-green"}`}
      >
        {heading}
      </h2>
    </div>
  );
}
