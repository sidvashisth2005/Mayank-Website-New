import { assets, categoryOf, dealLabel, formatPrice, statusLabel } from "./assets";
import type { SearchEntry } from "@/components/mayank/QuickSearch";

// A slim index for quick search: enough to find a record, nothing more.

const pages: Omit<SearchEntry, "terms">[] = [
  { href: "/market", title: "Market", meta: "Browse every record", group: "Pages" },
  { href: "/sell", title: "List an asset", meta: "Private review first", group: "Pages" },
  { href: "/how-it-works", title: "How it works", meta: "The method, for buyers and sellers", group: "Pages" },
  { href: "/restricted-assets", title: "Restricted assets", meta: "What cannot be listed", group: "Pages" },
  { href: "/dashboard", title: "Your desk", meta: "Overview of your listings and enquiries", group: "Desk" },
  { href: "/dashboard/listings", title: "My listings", meta: "Progress of every listing", group: "Desk" },
  { href: "/dashboard/enquiries", title: "Enquiries", meta: "Received and sent", group: "Desk" },
  { href: "/dashboard/saved", title: "Saved records", meta: "Your watchlist", group: "Desk" },
  { href: "/dashboard/settings", title: "Account settings", meta: "Profile, password and sessions", group: "Desk" },
  { href: "/terms", title: "Terms", meta: "Governance", group: "Pages" },
  { href: "/privacy", title: "Privacy", meta: "Governance", group: "Pages" },
];

export const searchEntries: SearchEntry[] = [
  ...pages.map((page) => ({ ...page, terms: `${page.title} ${page.meta}`.toLowerCase() })),
  ...assets.map((asset) => {
    const category = categoryOf(asset.category);
    return {
      href: `/market/${asset.slug}`,
      title: `${asset.name}`,
      meta: `${asset.id} / ${asset.type} / ${formatPrice(asset)} / ${statusLabel[asset.status]}`,
      group: "Records" as const,
      terms: `${asset.name} ${asset.id} ${asset.type} ${category.label} ${category.plural} ${dealLabel[asset.deal]} ${asset.summary}`.toLowerCase(),
    };
  }),
];
