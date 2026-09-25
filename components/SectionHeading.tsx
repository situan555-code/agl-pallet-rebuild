import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  heading,
  align = "left",
}: {
  eyebrow?: string;
  heading: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-current/70">
          <span aria-hidden="true" className="mr-2 font-bold text-current">
            /
          </span>
          {eyebrow}
        </p>
      )}
      <h2 className={cn("mt-4 text-display-2 text-current")}>{heading}</h2>
    </div>
  );
}
