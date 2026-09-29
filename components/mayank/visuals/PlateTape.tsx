import { TransitionLink } from "../PageTransition";
import { RecordPlate, plateFrom } from "./RecordPlate";
import { assets, formatPrice } from "@/lib/assets";

// The tape: every record's plate on a slow loop. The second run is a visual
// copy only, so it is hidden from assistive tech and skipped by keyboard.
export function PlateTape() {
  return (
    <div className="plate-tape" aria-label="All records">
      <div className="plate-tape-track">
        {[0, 1].map((run) => (
          <ul key={run} aria-hidden={run === 1 || undefined}>
            {assets.map((asset) => (
              <li key={asset.slug}>
                <TransitionLink href={`/market/${asset.slug}`} tabIndex={run === 1 ? -1 : undefined}>
                  <RecordPlate source={plateFrom(asset)} variant="stamp" title="" />
                  <span><strong>{asset.name}</strong>{formatPrice(asset)}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
