import content from "@/content/pages/who-we-are.json";
import { PageHero } from "@/components/PageHero";
import { ProseBlock } from "@/components/ProseBlock";
import { ListBlock } from "@/components/ListBlock";
import { TrioGrid } from "@/components/TrioGrid";
import { TbdImage } from "@/components/TbdImage";
import { pageMeta } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta(
  'Who We Are — AGL Pallet',
  'AGL Pallet was built from the manufacturing side of the dock. North Canton, Ohio. Here is how the company runs and who answers the phone.',
  '/who-we-are/',
);

export default function WhoWeAre() {
  return (
    <main>
      <PageHero eyebrow={content.hero.eyebrow} heading={content.hero.heading} body={content.hero.paragraphs} />

      <section className="section-y overflow-hidden px-6">
        <div className="mx-auto grid max-w-[1440px] items-start gap-10 nav:grid-cols-2 nav:gap-12">
          <ProseBlock
            eyebrow={content.founderStory.eyebrow}
            heading={content.founderStory.heading}
            paragraphs={content.founderStory.paragraphs}
          />
          <TbdImage token={content.founderStory.imageToken} caption="Founder portrait" />
        </div>
      </section>

      <section className="section-y px-6 bg-surface-alt">
        <div className="mx-auto max-w-[1440px]">
          <ListBlock
            eyebrow={content.team.eyebrow}
            heading={content.team.heading}
            body={content.team.body}
            items={content.team.items}
          />
        </div>
      </section>

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {content.values.eyebrow}
          </p>
          <div className="mt-6">
            <TrioGrid cards={content.values.cards} />
          </div>
        </div>
      </section>

      <section className="section-y px-6 bg-surface-alt">
        <div className="mx-auto max-w-[1440px]">
          <ProseBlock
            eyebrow={content.faith.eyebrow}
            heading={content.faith.heading}
            paragraphs={content.faith.paragraphs}
          />
        </div>
      </section>

      <section className="section-y px-6">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-eyebrow font-semibold uppercase tracking-wide text-eyebrow-ink">
            <span aria-hidden="true" className="mr-2 font-bold">
              /
            </span>
            {content.whereWeAre.eyebrow}
          </p>
          <p className="prose-measure mt-6 text-body">{content.whereWeAre.body}</p>
          <p className="mt-2 text-body">{`{{${content.whereWeAre.addressToken}}}`}</p>
        </div>
      </section>
    </main>
  );
}
