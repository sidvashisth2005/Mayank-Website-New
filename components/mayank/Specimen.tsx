import type { Asset } from "@/lib/assets";

// Each record crops one of the two archive photographs at its own position.
export const specimenSrc = (asset: Asset) => (asset.specimen.image === "object" ? "/archive-object.webp" : "/archive-detail.webp");
