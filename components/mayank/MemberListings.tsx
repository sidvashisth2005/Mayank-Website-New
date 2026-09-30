import Image from "next/image";
import type { CSSProperties } from "react";
import { memberListingsInMarket } from "@/lib/server/market";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";
import { TransitionLink } from "./PageTransition";
import { RecordPlate } from "./visuals/RecordPlate";

// Listings filed by members and published by the review desk. The band is
// left out entirely until there is at least one.
export async function MemberListings() {
  const rows = await memberListingsInMarket();
  if (!rows.length) return null;
  return (
    <section className="member-band" aria-labelledby="member-title">
      <header>
        <span className="label">Member listings / {String(rows.length).padStart(2, "0")} in the market</span>
        <h2 id="member-title">Filed by members, <em>checked by the desk.</em></h2>
      </header>
      <ol>
        {rows.map((listing) => {
          const plate = listingPlate(listing);
          return (
            <li key={listing.id} style={{ "--cat": plate.ink } as CSSProperties}>
              <TransitionLink href={`/market/member/${listing.id}`}>
                <span className="member-cover">
                  {listing.cover ? <Image src={listing.cover} alt="" fill sizes="(max-width: 980px) 90vw, 30vw" /> : <RecordPlate source={plate} variant="cover" title="" />}
                </span>
                <span className="label">{memberRecordId(listing.recordNo)} / {listing.category}</span>
                <strong>{listing.name}</strong>
                <span className="member-meta"><span>{memberPrice(listing)}</span><span>{listing.status === "under_offer" ? "Under offer" : "Available"}</span></span>
              </TransitionLink>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
