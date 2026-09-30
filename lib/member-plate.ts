import { categories } from "./assets";
import type { PlateSource } from "@/components/mayank/visuals/RecordPlate";

// Member listings take the ink of the closest catalogue category, and a plate
// drawn from their name, so the same listing always carries the same plate.

const categoryKey: Record<string, string> = {
  "Complete product": "product", "Code or technical asset": "code", "Template or design system": "design", "Domain and identity": "domain",
  "Social media page": "provider", "Ad account": "provider", "Cloud credits or subscription": "provider", Other: "provider",
};

export const listingInk = (category: string) => categories.find((item) => item.key === categoryKey[category])?.ink ?? "#5f625e";

export function memberPrice(listing: { price: number; dealType: string; rentPeriod: string }) {
  const amount = `₹${listing.price.toLocaleString("en-IN")}`;
  return listing.dealType === "Sell" || !listing.rentPeriod ? amount : `${amount} / ${listing.rentPeriod}`;
}

export function memberRecordId(recordNo: number | null) {
  return recordNo ? `MB-${String(recordNo).padStart(3, "0")}` : "MB-NEW";
}

export function listingPlate(listing: { name: string; category: string; price?: number; dealType?: string; rentPeriod?: string; recordNo?: number | null }): PlateSource {
  const name = listing.name.trim() || "Your asset";
  const bars = Array.from({ length: 12 }, (_, index) => 25 + ((name.charCodeAt(index % name.length) * 37 + index * 53) % 70));
  return {
    id: listing.recordNo === undefined ? "MX-NEW" : memberRecordId(listing.recordNo),
    name,
    ink: listingInk(listing.category),
    bars,
    label: listing.category || "Category pending",
    price: listing.price ? memberPrice({ price: listing.price, dealType: listing.dealType ?? "Sell", rentPeriod: listing.rentPeriod ?? "" }) : undefined,
  };
}
