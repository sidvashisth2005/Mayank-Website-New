import type { CSSProperties } from "react";
import { TransitionLink } from "./PageTransition";
import { RecordPlate, plateFrom } from "./visuals/RecordPlate";
import { Sparkline } from "./visuals/Chart";
import { categoryOf, dealLabel, formatPrice, statusLabel, type Asset } from "@/lib/assets";
import { getDossier } from "@/lib/dossiers";

export function AssetRows({ items, className = "" }: { items: Asset[]; className?: string }) {
  return (
    <div className={`asset-rows ${className}`}>
      <div className="asset-row asset-row-head" aria-hidden="true"><span>Record</span><span>Asset</span><span>Category</span><span>12 months</span><span>Price</span><span>Status</span></div>
      <ul>
        {items.map((asset) => {
          const category = categoryOf(asset.category);
          const dossier = getDossier(asset.slug);
          return (
            <li key={asset.slug} data-flip-id={asset.slug} className={asset.status !== "live" ? "is-closed" : ""} style={{ "--cat": category.ink } as CSSProperties}>
              <TransitionLink className="asset-row" href={`/market/${asset.slug}`}>
                <span className="row-id"><RecordPlate source={plateFrom(asset)} variant="thumb" title="" /><em>{asset.id}</em></span>
                <span className="row-name">
                  <strong>{asset.name}</strong>
                  <small>{asset.type}</small>
                  <span className="row-stack">{dossier.stack.slice(0, 3).map((item) => <i key={item}>{item}</i>)}</span>
                </span>
                <span className="row-category"><b aria-hidden="true" />{category.label}</span>
                <span className="row-trend"><Sparkline values={dossier.series.values} /></span>
                <span className="row-price">{formatPrice(asset)}<small>{dealLabel[asset.deal]}</small></span>
                <span className={`row-status is-${asset.status}`}>{statusLabel[asset.status]}</span>
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
