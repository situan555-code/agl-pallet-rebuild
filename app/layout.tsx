import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter, anton } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata: Metadata = {
  metadataBase: new URL("https://aglpallet.com"),
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
