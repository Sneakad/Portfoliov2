import type { Metadata } from "next";
import { GeistMono, GeistPixelSquare, GeistSans } from "./fonts";
import "./globals.css";
import { ActiveSectionContextProvider } from "@/context/active-section-context";
import LenisProvider from "@/components/LenisProvider";
import { MODE_BOOT } from "@/lib/mode";
import { site } from "@/data/home";
import { SITE_URL, seo } from "@/data/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.title, template: `%s · ${seo.shortTitle}` },
  description: seo.description,
  applicationName: seo.shortTitle,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  keywords: seo.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // /llms.txt: plain-Markdown brief for AI agents
  alternates: { types: { "text/plain": "/llms.txt" } },
  // Paste the Search Console / Bing Webmaster tokens here once the properties are verified.
  // verification: { google: "", other: { "msvalidate.01": "" } },
  // Dither A mark: .ico for old browsers, SVG for modern tabs, hand-tuned PNGs for 16/32px
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  // Link-preview images come from the opengraph-image.tsx files next to each page.
  openGraph: {
    type: "profile",
    url: "/",
    firstName: "Aditya",
    lastName: "Mondal",
    username: seo.handle,
    siteName: seo.shortTitle,
    locale: "en_US",
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: "summary_large_image", creator: seo.twitterHandle, title: seo.title, description: seo.description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> so the canvases can read them via getComputedStyle.
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* apply the saved Simple/Dither choice before first paint */}
        <script dangerouslySetInnerHTML={{ __html: MODE_BOOT }} />
      </head>
      <body className="bg-paper text-ink antialiased">
        <ActiveSectionContextProvider>
          <LenisProvider>{children}</LenisProvider>
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
