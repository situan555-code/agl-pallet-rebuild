import type { Metadata } from "next";

export function pageMeta(title: string, description: string, canonical: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ["/assets/agl_social_share.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/agl_social_share.jpg"],
    },
  };
}
