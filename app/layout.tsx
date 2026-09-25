import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { inter, anton } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { isVercelAppHost } from "@/lib/host";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers",
      template: "%s",
    },
    description:
      "AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order.",
    applicationName: "AGL Pallet",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      siteName: "AGL Pallet",
      locale: "en_US",
      type: "website",
      images: [{ url: "/assets/agl_social_share.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/assets/agl_social_share.jpg"],
    },
  };

  // Same host check as middleware. headers() is request-time, so this meta
  // is absent on aglpallet.com without a rebuild. Next emits the meta tag
  // only; middleware sets the matching X-Robots-Tag header.
  if (isVercelAppHost(headers().get("host"))) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F2A1F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      <body>
        <OrganizationJsonLd />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
