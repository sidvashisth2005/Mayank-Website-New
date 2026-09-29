import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mayank | A Second Life for Digital Products",
  description: "A curated exchange for acquiring, licensing and continuing original startup-built products, code, domains and design systems.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
