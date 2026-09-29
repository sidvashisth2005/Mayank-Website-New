import type { Metadata, Viewport } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "./globals.css";
import { PageTransitionProvider } from "@/components/mayank/PageTransition";
import { SiteHeader } from "@/components/mayank/SiteHeader";
import { SiteFooter } from "@/components/mayank/SiteFooter";
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

// Runs before paint: the full loader plays once per browser session.
const visitScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("mayank-visited"))document.documentElement.dataset.visited="1"}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: visitScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <PageTransitionProvider>
          <SmoothScroll />
          <SiteHeader />
          {children}
          <SiteFooter />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
