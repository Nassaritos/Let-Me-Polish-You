import type { Metadata, Viewport } from "next";
import { Lato, Montserrat, Ms_Madi } from "next/font/google";
import { SiteNav } from "@/components/navigation/SiteNav";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

const madi = Ms_Madi({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-madi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Let Me Polish You",
    template: "%s | Let Me Polish You",
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_GB",
    url: "/",
    title: "Let Me Polish You — AIESEC in Poland",
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Let Me Polish You — AIESEC in Poland",
    description: SITE.description,
  },
  
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lato.variable} ${madi.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="btn btn-red sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteNav />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
