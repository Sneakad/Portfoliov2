import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import { ActiveSectionContextProvider } from "@/context/active-section-context";
import LenisProvider from "@/components/LenisProvider";

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
    >
      <body className="bg-paper text-ink antialiased">
        <ActiveSectionContextProvider>
          <LenisProvider>{children}</LenisProvider>
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
