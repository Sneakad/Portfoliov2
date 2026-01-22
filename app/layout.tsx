import type { Metadata } from "next";
import { Red_Hat_Display, Inter } from "next/font/google";
import "./globals.css";
import { ActiveSectionContextProvider } from "@/context/active-section-context";
import LenisProvider from "@/components/LenisProvider";
import CursorFollower from "@/components/CursorFollower";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aditya - Portfolio",
  description: "Showcasing the work and projects of Aditya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} ${inter.variable} antialiased`}
      >
        <CursorFollower />
        <ActiveSectionContextProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ActiveSectionContextProvider>
      </body>
    </html>
  );
}
