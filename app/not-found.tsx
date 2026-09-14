import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <main>
      <section className="bg-brand-green px-6 pb-24 pt-36 text-center text-white">
        <div className="mx-auto max-w-[720px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            404
          </p>
          <h1 className="mt-4 text-display-1">Page Not Found</h1>
          <p className="mx-auto mt-6 max-w-xl text-body text-white/90">
            That page isn’t in our yard. Head home or request a quote and we’ll
            get you pointed in the right direction.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/" label="Back to Home" variant="pill-light" />
            <Link
              href="/request-a-quote/"
              prefetch={false}
              className="rounded-full border border-white px-6 py-3 text-button font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
