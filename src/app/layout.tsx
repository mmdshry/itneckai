import type {Metadata} from "next";
import {Inter, JetBrains_Mono} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {Header} from "@/components/Header";
import {Footer} from "@/components/Footer";
import {JsonLd} from "@/components/JsonLd";
import {organizationSchema} from "@/lib/schema";
import {site} from "@/lib/site";

// display: "optional" + no preload — text paints immediately with matched
// fallback metrics and never reflows for a late font, keeping LCP/CLS at
// their floor. The font is cached for subsequent navigations.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  // Used only for small eyebrow/status labels — keep it off the critical path.
  preload: false,
});

// Semibold covers all display sizes; 700 maps to the same file to avoid
// shipping a second weight for a handful of headlines.
const clash = localFont({
  variable: "--font-clash",
  display: "optional",
  adjustFontFallback: "Arial",
  src: [
    { path: "../fonts/ClashDisplay-Semibold.woff2", weight: "600 700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ai.neck | Microsoft Copilot Agents & AI Solutions",
    template: "%s | ai.neck",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
        {url: "/icon-192.png", sizes: "192x192", type: "image/png"},
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrains.variable} ${clash.variable} antialiased`}
      >
        <a
          href="#main"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <div className="spine hidden md:block" aria-hidden="true">
          <div className="spine-fill" />
        </div>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
