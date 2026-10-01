import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Simana Sandesh — Latest News, Breaking News & Headlines",
    template: "%s | Simana Sandesh",
  },
  description:
    "Simana Sandesh brings you trusted news from the border to the nation: national, state, city, business, sports, technology and opinion.",
  openGraph: { siteName: "Simana Sandesh", type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf9f4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
