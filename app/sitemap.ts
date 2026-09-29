import type { MetadataRoute } from "next";
import { assets } from "@/lib/assets";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/market", "/sell", "/how-it-works", "/terms", "/privacy", "/restricted-assets"];
  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...assets.map((asset) => ({ url: `${siteUrl}/market/${asset.slug}` })),
  ];
}
