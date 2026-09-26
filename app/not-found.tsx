import { Button } from "@/components/Button";
import { insetOuterClass, insetPadClass, insetSurfaceClass } from "@/components/Container";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main>
      <section className={cn("bg-moss pb-8 pt-28 text-center text-bone", insetOuterClass)}>
        <div className={cn(insetSurfaceClass, insetPadClass, "bg-green py-16 nav:py-20")}>
        <div className="mx-auto max-w-[720px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            404
          </p>
          <h1 className="mt-3 text-display-1">Page Not Found</h1>
          <p className="mx-auto mt-6 max-w-xl text-body text-bone/90">
            That page isn’t in our yard. Head home or request a quote and we’ll
            get you pointed in the right direction.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" label="Back to Home" variant="secondary" />
            <Button href="/request-a-quote/" label="Request a Quote" variant="secondary" />
          </div>
        </div>
        </div>
      </section>
    </main>
  );
}
