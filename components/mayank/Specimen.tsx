import Image from "next/image";
import type { Asset } from "@/lib/assets";

export const specimenSrc = (asset: Asset) => (asset.specimen.image === "object" ? "/archive-object.webp" : "/archive-detail.webp");

// A cropped archive photograph with a cut corner and the record's monogram:
// every listing gets a physical "specimen" without inventing product imagery.
export function Specimen({ asset, sizes, className = "", priority = false }: { asset: Asset; sizes: string; className?: string; priority?: boolean }) {
  return (
    <figure className={`specimen ${className}`}>
      <Image src={specimenSrc(asset)} alt="" fill sizes={sizes} priority={priority} style={{ objectPosition: asset.specimen.position }} />
      <figcaption>
        <span>{asset.id}</span>
        <strong aria-hidden="true">{asset.name.charAt(0)}</strong>
      </figcaption>
      {asset.status !== "live" && <b className="record-stamp">{asset.status === "sold" ? "Sold" : "Rented"}</b>}
    </figure>
  );
}
