import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Astroshot — Premium Creative Agency Kuwait",
  description:
    "We create what others only imagine. VFX, 3D animation, social media, and branding for the world's most ambitious brands.",
  keywords: "VFX, 3D animation, creative agency, Kuwait, branding, social media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-space), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
