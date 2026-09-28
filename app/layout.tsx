import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { ActiveSectionContextProvider } from "@/context/active-section-context";
import LenisProvider from "@/components/LenisProvider";
import { MODE_BOOT } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Aditya Mondal — Software Engineer",
  description:
    "Software engineer shipping full-stack products with a focus on generative AI. Experience, projects and hackathon wins.",
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
