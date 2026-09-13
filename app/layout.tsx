import type { Metadata } from "next";
import "./globals.css";
import { inter, anton } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://aglpallet.com"),
  title: "AGL Pallet",
  description: "AGL Pallet",
  openGraph: {
    siteName: "AGL Pallet",
    locale: "en_US",
  },
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
