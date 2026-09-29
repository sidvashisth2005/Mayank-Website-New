import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { PageTransitionProvider } from "@/components/mayank/PageTransition";
import { SiteHeader } from "@/components/mayank/SiteHeader";
import { SiteFooter } from "@/components/mayank/SiteFooter";
import { SiteLoader } from "@/components/mayank/SiteLoader";
import { SmoothScroll } from "@/components/mayank/SmoothScroll";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Mayank | A Second Life for Digital Products", template: "%s | Mayank" },
  description: "A reviewed marketplace to buy, rent or list startup-built products, code, domains and design systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Mayank | A Second Life for Digital Products",
    description: "Buy what's built. Sell what's useful. A reviewed marketplace for startup-built digital assets.",
    images: [{ url: "/archive-object.webp" }],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#f7f7f5" };

// Runs before paint. A reload always starts from the top of the page,
// never from the previous scroll position.
const visitScript = `document.documentElement.classList.add("js");if("scrollRestoration" in history)history.scrollRestoration="manual";window.scrollTo(0,0);`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: visitScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <PageTransitionProvider>
          <SiteLoader />
          <SmoothScroll />
          <SiteHeader />
          {children}
          <SiteFooter />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
