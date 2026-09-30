import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ownerListing } from "@/lib/server/listings";
import { requireViewer } from "@/lib/server/session";
import { sellerMoves, statusCopy } from "@/lib/listing-status";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";
import type { ListingStatus } from "@/lib/db/schema";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { RecordPlate } from "@/components/mayank/visuals/RecordPlate";
import { ActionForm } from "@/components/mayank/account/ActionForm";
import { ProgressRail, StatusStamp, formatWhen } from "@/components/mayank/account/DeskParts";
import { moveMyListing } from "../../actions";

export const metadata = { title: "Listing" };

const moveCopy: Partial<Record<ListingStatus, [string, string]>> = {
  submitted: ["Send back for review", "After making the requested change"],
  withdrawn: ["Withdraw listing", "Removes it from review and the market"],
  under_offer: ["Mark under offer", "A buyer is in conversation"],
  live: ["Back to live", "The offer fell through"],
  transferred: ["Mark transferred", "Handover complete, close the record"],
};

export default async function DeskListing({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await requireViewer(`/dashboard/listings/${id}`);
  const record = await ownerListing(viewer.userId, id);
  if (!record) notFound();
  const { listing, images, events, enquiries } = record;
  const moves = sellerMoves[listing.status] ?? [];
  const plate = listingPlate(listing);

  const details: [string, string][] = [
    ["Category", listing.category], ["Deal", listing.dealType === "Sell" ? "Sell outright" : `Rent or licence, per ${listing.rentPeriod}`],
    ["Asking", memberPrice(listing)], ["Asset age", listing.age], ["Transfer readiness", listing.transfer],
    ["Dependencies", listing.dependencies || "None stated"], ["Metrics", listing.metrics || "None stated"],
    ["Contact", listing.contactMethod === "WhatsApp" ? `WhatsApp ${listing.whatsapp}` : listing.email], ["Reference", listing.ref],
  ];

  return (
    <>
      <nav className="desk-crumbs" aria-label="Breadcrumb"><TransitionLink href="/dashboard/listings">Listings</TransitionLink><span aria-hidden="true">/</span><span aria-current="page">{listing.name}</span></nav>
      <header className="desk-head desk-record-head" style={{ "--cat": plate.ink } as CSSProperties}>
        <div>
          <span className="label">{memberRecordId(listing.recordNo)} / {listing.category}</span>
          <h1>{listing.name}</h1>
          <StatusStamp status={listing.status} />
        </div>
        <RecordPlate source={plate} variant="stamp" className="desk-record-plate" />
      </header>

      <section className="desk-progress" aria-labelledby="progress-title">
        <h2 className="desk-subhead" id="progress-title">Progress</h2>
        <ProgressRail status={listing.status} />
        <p className="desk-next-line">{statusCopy[listing.status].next}</p>
        {listing.reviewerNote && (listing.status === "changes_requested" || listing.status === "declined") && (
          <blockquote className="desk-note"><span className="label">Note from the review desk</span><p>{listing.reviewerNote}</p></blockquote>
        )}
        {moves.length > 0 && (
          <ActionForm action={moveMyListing} className="desk-moves">
            <input type="hidden" name="id" value={listing.id} />
            {moves.map((to) => (
              <button key={to} type="submit" name="to" value={to} className={`btn ${to === "withdrawn" ? "btn-outline" : "btn-solid"}`}>
                {moveCopy[to]?.[0] ?? statusCopy[to].label}<span>{moveCopy[to]?.[1] ?? ""}</span>
              </button>
            ))}
          </ActionForm>
        )}
      </section>

      <div className="desk-split">
        <section aria-labelledby="timeline-title">
          <h2 className="desk-subhead" id="timeline-title">Timeline</h2>
          <ol className="desk-timeline">
            {events.map((event) => (
              <li key={event.id}>
                <time dateTime={event.createdAt.toISOString()}>{formatWhen(event.createdAt)}</time>
                <strong>{statusCopy[event.status].label}</strong>
                <p>{event.actor === "desk" ? "Review desk" : "You"}{event.note ? `: ${event.note}` : ""}</p>
              </li>
            ))}
          </ol>
        </section>
        <section aria-labelledby="enquiries-title">
          <h2 className="desk-subhead" id="enquiries-title">Enquiries</h2>
          {enquiries.length ? (
            <ul className="desk-activity">
              {enquiries.map((enquiry) => (
                <li key={enquiry.id}>
                  <time dateTime={enquiry.createdAt.toISOString()}>{formatWhen(enquiry.createdAt)}</time>
                  <p><b>{enquiry.name}</b>, {enquiry.intent.toLowerCase()}. <TransitionLink className="text-link" href={`/dashboard/enquiries#e-${enquiry.id}`}>Open thread</TransitionLink></p>
                </li>
              ))}
            </ul>
          ) : <p className="desk-empty">{listing.status === "live" ? "No enquiries yet. Buyers find live records through the market index and search." : "Enquiries open once the listing is live."}</p>}
        </section>
      </div>

      <section aria-labelledby="record-title">
        <h2 className="desk-subhead" id="record-title">The record</h2>
        <p className="desk-description">{listing.description}</p>
        <dl className="desk-sheet">{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <h3 className="desk-subhead is-small">Present condition</h3>
        <p className="desk-description">{listing.condition}</p>
        {images.length > 0 && (
          <ul className="desk-images">
            {images.map((image) => <li key={image.id}><Image src={image.url} alt={image.alt} fill sizes="(max-width: 980px) 50vw, 25vw" /></li>)}
          </ul>
        )}
        <p className="desk-fine">Filed {formatWhen(listing.createdAt)}. To change the description or images, write to the review desk quoting {listing.ref}.</p>
      </section>
    </>
  );
}
