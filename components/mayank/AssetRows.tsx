import { TransitionLink } from "./PageTransition";
import { categoryOf, dealLabel, formatPrice, statusLabel, type Asset } from "@/lib/assets";

export function AssetRows({ items, className = "" }: { items: Asset[]; className?: string }) {
  return (
    <div className={`asset-rows ${className}`}>
      <div className="asset-row asset-row-head" aria-hidden="true"><span>Record</span><span>Asset</span><span>Category</span><span>Deal</span><span>Price</span><span>Status</span></div>
      <ul>
        {items.map((asset) => (
          <li key={asset.slug} data-flip-id={asset.slug} className={asset.status !== "live" ? "is-closed" : ""}>
            <TransitionLink className="asset-row" href={`/market/${asset.slug}`}>
              <span className="row-id">{asset.id}</span>
              <span className="row-name"><strong>{asset.name}</strong><small>{asset.type}</small></span>
              <span className="row-category">{categoryOf(asset.category).label}</span>
              <span className="row-deal">{dealLabel[asset.deal]}</span>
              <span className="row-price">{formatPrice(asset)}</span>
              <span className={`row-status is-${asset.status}`}>{statusLabel[asset.status]}</span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
