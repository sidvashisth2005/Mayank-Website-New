import type { Metadata } from "next";
import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { deskQueue } from "@/lib/server/listings";
import { requireAdmin } from "@/lib/server/session";
import { listingPlate, memberPrice, memberRecordId } from "@/lib/member-plate";
import { getAsset } from "@/lib/assets";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { RecordPlate } from "@/components/mayank/visuals/RecordPlate";
import { ActionForm } from "@/components/mayank/account/ActionForm";
import { ProgressRail, StatusStamp, formatWhen } from "@/components/mayank/account/DeskParts";
import { moderate } from "./actions";

export const metadata: Metadata = { title: "Review desk", robots: { index: false, follow: false } };

export default async function ReviewDesk() {
  await requireAdmin();
  const [queue, pendingReviews, pendingQuotes] = await Promise.all([
    deskQueue(),
    db.select().from(schema.reviews).where(eq(schema.reviews.status, "pending")).orderBy(desc(schema.reviews.createdAt)),
    db.select().from(schema.testimonials).where(eq(schema.testimonials.status, "pending")).orderBy(desc(schema.testimonials.createdAt)),
  ]);
  const waiting = queue.filter((listing) => ["submitted", "in_review"].includes(listing.status));
  const withSeller = queue.filter((listing) => listing.status === "changes_requested");
  const market = queue.filter((listing) => ["live", "under_offer"].includes(listing.status));

  const groups = [
    ["Waiting for a decision", waiting, "Nothing waiting. New submissions appear here oldest first."],
    ["With the seller", withSeller, "No listings are waiting on seller changes."],
    ["In the market", market, "Nothing is live yet."],
  ] as const;

  return (
    <main id="main" tabIndex={-1} className="desk is-admin">
      <div className="desk-body is-full">
        <header className="desk-head">
          <span className="label">Review desk / {waiting.length} waiting</span>
          <h1>Check it, <em>then file it.</em></h1>
          <TransitionLink className="text-link" href="/dashboard">Back to your desk</TransitionLink>
        </header>

        {groups.map(([title, rows, empty]) => (
          <section key={title} aria-label={title}>
            <h2 className="desk-subhead">{title} <span>{rows.length}</span></h2>
            {rows.length ? (
              <ol className="desk-table">
                {rows.map((listing) => (
                  <li key={listing.id}>
                    <TransitionLink href={`/admin/${listing.id}`}>
                      <span className="desk-thumb">
                        {listing.cover ? <Image src={listing.cover} alt="" fill sizes="96px" /> : <RecordPlate source={listingPlate(listing)} variant="thumb" title="" />}
                      </span>
                      <span className="desk-row-name"><small>{memberRecordId(listing.recordNo)} / {listing.ref} / {listing.seller}</small><strong>{listing.name}</strong></span>
                      <StatusStamp status={listing.status} />
                      <ProgressRail status={listing.status} />
                      <span className="desk-row-meta"><strong>{memberPrice(listing)}</strong><small>Filed {formatWhen(listing.createdAt)}</small></span>
                    </TransitionLink>
                  </li>
                ))}
              </ol>
            ) : <p className="desk-empty">{empty}</p>}
          </section>
        ))}

        <section aria-label="Moderation">
          <h2 className="desk-subhead">Reviews and testimonials <span>{pendingReviews.length + pendingQuotes.length}</span></h2>
          {pendingReviews.length + pendingQuotes.length ? (
            <ol className="desk-moderation">
              {[...pendingReviews.map((review) => ({ id: review.id, kind: "review" as const, head: `${review.rating}/5 on ${getAsset(review.assetKey)?.name ?? review.assetKey}: ${review.title}`, body: review.body, by: review.authorName, at: review.createdAt })),
                ...pendingQuotes.map((quote) => ({ id: quote.id, kind: "testimonial" as const, head: `Testimonial from ${quote.authorRole}`, body: quote.quote, by: quote.authorName, at: quote.createdAt }))]
                .map((item) => (
                  <li key={item.id}>
                    <span className="label">{item.kind} / {item.by} / {formatWhen(item.at)}</span>
                    <strong>{item.head}</strong>
                    <p>{item.body}</p>
                    <ActionForm action={moderate} className="desk-moves is-inline">
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="kind" value={item.kind} />
                      <button type="submit" name="status" value="published" className="btn btn-solid">Publish<span>Visible on the site</span></button>
                      <button type="submit" name="status" value="rejected" className="btn btn-outline">Reject<span>Not shown</span></button>
                    </ActionForm>
                  </li>
                ))}
            </ol>
          ) : <p className="desk-empty">Nothing to moderate.</p>}
        </section>
      </div>
    </main>
  );
}
