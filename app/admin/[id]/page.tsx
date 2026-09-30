import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { deskListing } from "@/lib/server/listings";
import { requireAdmin } from "@/lib/server/session";
import { deskMoves, statusCopy } from "@/lib/listing-status";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";
import type { ListingStatus } from "@/lib/db/schema";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { RecordPlate } from "@/components/mayank/visuals/RecordPlate";
import { ActionForm } from "@/components/mayank/account/ActionForm";
import { ProgressRail, StatusStamp, formatWhen } from "@/components/mayank/account/DeskParts";
import { reviewListing } from "../actions";

export const metadata: Metadata = { title: "Review", robots: { index: false, follow: false } };

const decisionCopy: Partial<Record<ListingStatus, [string, string]>> = {
  in_review: ["Open review", "Tell the seller it is being checked"],
  changes_requested: ["Request changes", "A note is required"],
  live: ["Approve and publish", "Goes live in the market"],
  declined: ["Decline", "A reason is required"],
  under_offer: ["Mark under offer", "A buyer is in conversation"],
  withdrawn: ["Take down", "Removes it from the market"],
  transferred: ["Mark transferred", "Handover confirmed"],
};

export default async function DeskReview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const record = await deskListing((await params).id);
  if (!record) notFound();
  const { listing, seller, images, events } = record;
  const moves = deskMoves[listing.status] ?? [];

  const sheet: [string, string][] = [
    ["Seller", `${seller.displayName} / ${seller.email || "no verified email"}`], ["Contact", listing.contactMethod === "WhatsApp" ? `WhatsApp ${listing.whatsapp}` : listing.email],
    ["LinkedIn", listing.linkedin || "Not given"], ["Category", listing.category], ["Deal", listing.dealType], ["Asking", memberPrice(listing)],
    ["Asset age", listing.age], ["Transfer readiness", listing.transfer], ["Dependencies", listing.dependencies || "None stated"],
    ["Metrics", listing.metrics || "None stated"], ["Video", listing.videoUrl || "None"], ["Reference", listing.ref],
  ];

  return (
    <main id="main" tabIndex={-1} className="desk is-admin">
      <div className="desk-body is-full">
        <nav className="desk-crumbs" aria-label="Breadcrumb"><TransitionLink href="/admin">Review desk</TransitionLink><span aria-hidden="true">/</span><span aria-current="page">{listing.name}</span></nav>
        <header className="desk-head desk-record-head">
          <div>
            <span className="label">{memberRecordId(listing.recordNo)} / filed {formatWhen(listing.createdAt)}</span>
            <h1>{listing.name}</h1>
            <StatusStamp status={listing.status} />
          </div>
          <RecordPlate source={listingPlate(listing)} variant="stamp" className="desk-record-plate" />
        </header>

        <div className="desk-split is-review">
          <section aria-labelledby="record-title">
            <h2 className="desk-subhead" id="record-title">The record</h2>
            <p className="desk-description">{listing.description}</p>
            <h3 className="desk-subhead is-small">Present condition</h3>
            <p className="desk-description">{listing.condition}</p>
            <dl className="desk-sheet">{sheet.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            {images.length > 0 && (
              <ul className="desk-images">
                {images.map((image) => <li key={image.id}><a href={image.url} target="_blank" rel="noreferrer noopener"><Image src={image.url} alt={image.alt} fill sizes="25vw" /></a></li>)}
              </ul>
            )}
          </section>

          <section aria-labelledby="decision-title" className="desk-decision">
            <h2 className="desk-subhead" id="decision-title">Decision</h2>
            <ProgressRail status={listing.status} />
            {moves.length ? (
              <ActionForm action={reviewListing} className="desk-review-form">
                <input type="hidden" name="id" value={listing.id} />
                <label><span className="label">Note to the seller</span><textarea name="note" rows={5} maxLength={1200} placeholder="What was checked, what needs to change, or why it cannot be listed." /></label>
                <div className="desk-moves">
                  {moves.map((to) => (
                    <button key={to} type="submit" name="to" value={to} className={`btn ${to === "live" ? "btn-solid" : "btn-outline"}`}>
                      {decisionCopy[to]?.[0] ?? statusCopy[to].label}<span>{decisionCopy[to]?.[1] ?? ""}</span>
                    </button>
                  ))}
                </div>
              </ActionForm>
            ) : <p className="desk-empty">This record is closed.</p>}
            <h3 className="desk-subhead is-small">Timeline</h3>
            <ol className="desk-timeline">
              {events.map((event) => (
                <li key={event.id}>
                  <time dateTime={event.createdAt.toISOString()}>{formatWhen(event.createdAt)}</time>
                  <strong>{statusCopy[event.status].label}</strong>
                  <p>{event.actor === "desk" ? "Review desk" : "Seller"}{event.note ? `: ${event.note}` : ""}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  );
}
