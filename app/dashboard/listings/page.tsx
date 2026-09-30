import Image from "next/image";
import { ownerListings } from "@/lib/server/listings";
import { requireViewer } from "@/lib/server/session";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";
import { statusCopy } from "@/lib/listing-status";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { RecordPlate } from "@/components/mayank/visuals/RecordPlate";
import { ProgressRail, StatusStamp, formatWhen } from "@/components/mayank/account/DeskParts";

export const metadata = { title: "Listings" };

const filters = [
  { key: "all", label: "All" },
  { key: "review", label: "In review", match: ["submitted", "in_review", "changes_requested"] },
  { key: "market", label: "In the market", match: ["live", "under_offer"] },
  { key: "closed", label: "Closed", match: ["transferred", "declined", "withdrawn"] },
];

export default async function DeskListings({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const viewer = await requireViewer("/dashboard/listings");
  const wanted = (await searchParams).show;
  const show = filters.find((filter) => filter.key === wanted) ?? filters[0];
  const all = await ownerListings(viewer.userId);
  const rows = show.match ? all.filter((listing) => show.match!.includes(listing.status)) : all;

  return (
    <>
      <header className="desk-head">
        <span className="label">02 / Listings</span>
        <h1>Every record, <em>and where it stands.</em></h1>
        <TransitionLink className="btn btn-solid desk-head-cta" href="/sell">New listing<span>Private review first</span></TransitionLink>
      </header>

      <nav className="desk-tabs" aria-label="Filter listings">
        {filters.map((filter) => {
          const count = filter.match ? all.filter((listing) => filter.match!.includes(listing.status)).length : all.length;
          return (
            <TransitionLink key={filter.key} href={filter.key === "all" ? "/dashboard/listings" : `/dashboard/listings?show=${filter.key}`} aria-current={filter.key === show.key ? "page" : undefined}>
              {filter.label}<span>{count}</span>
            </TransitionLink>
          );
        })}
      </nav>

      {rows.length ? (
        <ol className="desk-table">
          {rows.map((listing) => (
            <li key={listing.id}>
              <TransitionLink href={`/dashboard/listings/${listing.id}`} aria-label={`${listing.name}, ${statusCopy[listing.status].label}`}>
                <span className="desk-thumb">
                  {listing.cover
                    ? <Image src={listing.cover} alt="" fill sizes="96px" />
                    : <RecordPlate source={listingPlate(listing)} variant="thumb" title="" />}
                </span>
                <span className="desk-row-name"><small>{memberRecordId(listing.recordNo)} / {listing.category}</small><strong>{listing.name}</strong></span>
                <StatusStamp status={listing.status} />
                <ProgressRail status={listing.status} />
                <span className="desk-row-meta"><strong>{memberPrice(listing)}</strong><small>Updated {formatWhen(listing.updatedAt)}{listing.openEnquiries ? ` / ${listing.openEnquiries} open enquiries` : ""}</small></span>
              </TransitionLink>
            </li>
          ))}
        </ol>
      ) : (
        <div className="desk-empty is-large">
          <p>{all.length ? "No listings match this filter." : "You have not listed anything yet."}</p>
          {!all.length && <TransitionLink className="btn btn-outline" href="/sell">Start your first listing<span>About ten minutes</span></TransitionLink>}
        </div>
      )}
    </>
  );
}
