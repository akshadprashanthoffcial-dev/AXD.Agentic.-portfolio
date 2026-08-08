import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import NavPill from "@/components/nav/NavPill";
import FluidCursor from "@/components/effects/FluidCursor";
import CustomCursor from "@/components/effects/CustomCursor";
import { SITE } from "@/data/site";

// Display face - Neue Montreal (self-hosted from app/fonts).
const display = localFont({
  src: [
    { path: "./fonts/NeueMontreal-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/NeueMontreal-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/NeueMontreal-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/NeueMontreal-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-display-src",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: "axd.labs, talk to Akshad's portfolio",
    template: "%s, axd.labs",
  },
  description:
    "An agent-style portfolio for Akshad Prashanth. Ask about the work, the experience, or how to get in touch.",
  keywords: [
    "Akshad Prashanth",
    "axd.labs",
    "product designer",
    "visual designer",
    "motion designer",
    "UI UX designer",
    "brand identity design",
    "motion graphics portfolio",
    "AI product design",
    "Bengaluru designer",
  ],
  authors: [{ name: SITE.operator }],
  creator: SITE.operator,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE.domain,
    siteName: "axd.labs",
    title: "axd.labs, talk to Akshad's portfolio",
    description:
      "An agent-style portfolio for Akshad Prashanth. Ask about the work, the experience, or how to get in touch.",
    images: [{ url: "/opengraph-image.png", width: 1386, height: 684 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "axd.labs, talk to Akshad's portfolio",
    description:
      "An agent-style portfolio for Akshad Prashanth. Ask about the work, the experience, or how to get in touch.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <FluidCursor />
        <CustomCursor />
        <NavPill />
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
