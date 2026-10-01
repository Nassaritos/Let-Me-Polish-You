import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Lato } from "next/font/google";
import { SiteNav } from "@/components/navigation/SiteNav";
import { SiteFooter } from "@/components/navigation/SiteFooter";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { SITE } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth", "opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Let Me Polish You — Volunteer, intern or teach in Poland with AIESEC",
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
  icons: { icon: "/brand/human-blue.png", apple: "/brand/human-blue.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#037ef3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${lato.variable} ${caveat.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="btn btn-yellow sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
