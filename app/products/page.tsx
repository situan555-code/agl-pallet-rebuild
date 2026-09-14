import type { Metadata } from "next";
import products from "@/content/pages/products.json";
import { PageHero } from "@/components/PageHero";
import { ProductBlock } from "@/components/ProductBlock";
import { CTABand } from "@/components/CTABand";

export const metadata: Metadata = {
  title: 'Products - AGL Pallet',
  description: 'Stock pallets, engineered pallet solutions, crates & dunnage, and shipping blocks—sourced and delivered for high-volume manufacturing.',
  alternates: { canonical: '/products/' },
  openGraph: {
    type: 'article',
    url: '/products/',
    title: 'Products - AGL Pallet',
    description: 'Stock pallets, engineered pallet solutions, crates & dunnage, and shipping blocks—sourced and delivered for high-volume manufacturing.',
    images: ["/assets/agl_social_share.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: 'Products - AGL Pallet',
    description: 'Stock pallets, engineered pallet solutions, crates & dunnage, and shipping blocks—sourced and delivered for high-volume manufacturing.',
    images: ["/assets/agl_social_share.jpg"],
  },
};

export default function Products() {
  return (
    <main>
      <PageHero
        eyebrow={products.hero.eyebrow}
        heading={products.hero.heading}
        body={products.hero.body}
      />

      {products.productBlocks.map((block, i) => (
        <ProductBlock
          key={block.id}
          id={block.id}
          heading={block.heading}
          tagline={block.tagline}
          body={block.body}
          image={block.image}
          alt={block.alt}
          imageSide={block.imageSide as "left" | "right"}
          edgeShape={block.edgeShape as "left" | "right"}
          cta={block.cta}
          priority={i === 0}
        />
      ))}

      <CTABand
        eyebrow={products.ctaBand.eyebrow}
        heading={products.ctaBand.heading}
        body={products.ctaBand.body}
        backgroundImage={products.ctaBand.backgroundImage}
        cta={products.ctaBand.cta}
      />
    </main>
  );
}
