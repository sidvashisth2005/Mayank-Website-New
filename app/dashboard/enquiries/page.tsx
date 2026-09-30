import { asc, desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAsset } from "@/lib/assets";
import { requireViewer } from "@/lib/server/session";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ActionForm } from "@/components/mayank/account/ActionForm";
import { formatWhen } from "@/components/mayank/account/DeskParts";
import { closeEnquiry, replyToEnquiry } from "../actions";

export const metadata = { title: "Enquiries" };

const statusLabel = { new: "New", replied: "Replied", closed: "Closed" } as const;

export default async function DeskEnquiries({ searchParams }: { searchParams: Promise<{ box?: string }> }) {
  const viewer = await requireViewer("/dashboard/enquiries");
  const box = (await searchParams).box === "sent" ? "sent" : "received";
  const { enquiries, listings, messages } = schema;

  const received = await db.select({ enquiry: enquiries, listingName: listings.name })
    .from(enquiries).innerJoin(listings, eq(enquiries.listingId, listings.id))
    .where(eq(listings.ownerId, viewer.userId)).orderBy(desc(enquiries.createdAt));
  const sent = await db.select({ enquiry: enquiries, listingName: listings.name })
    .from(enquiries).leftJoin(listings, eq(enquiries.listingId, listings.id))
    .where(eq(enquiries.buyerId, viewer.userId)).orderBy(desc(enquiries.createdAt));

  const rows = box === "sent" ? sent : received;
  const thread = rows.length
    ? await db.select().from(messages).where(inArray(messages.enquiryId, rows.map((row) => row.enquiry.id))).orderBy(asc(messages.createdAt))
    : [];

  return (
    <>
      <header className="desk-head">
        <span className="label">03 / Enquiries</span>
        <h1>Conversations, <em>kept on the record.</em></h1>
      </header>

      <nav className="desk-tabs" aria-label="Mailbox">
        <TransitionLink href="/dashboard/enquiries" aria-current={box === "received" ? "page" : undefined}>Received<span>{received.length}</span></TransitionLink>
        <TransitionLink href="/dashboard/enquiries?box=sent" aria-current={box === "sent" ? "page" : undefined}>Sent<span>{sent.length}</span></TransitionLink>
      </nav>

      {rows.length ? (
        <ol className="desk-threads">
          {rows.map(({ enquiry, listingName }) => {
            const sample = enquiry.sampleSlug ? getAsset(enquiry.sampleSlug) : undefined;
            const subject = listingName ?? sample?.name ?? "A record";
            const replies = thread.filter((message) => message.enquiryId === enquiry.id);
            return (
              <li key={enquiry.id} id={`e-${enquiry.id}`}>
                <details open={enquiry.status === "new"}>
                  <summary>
                    <span className={`desk-stamp is-${enquiry.status === "new" ? "act" : enquiry.status === "closed" ? "stop" : "open"}`}>{statusLabel[enquiry.status]}</span>
                    <strong>{box === "sent" ? subject : enquiry.name}</strong>
                    <small>{box === "sent" ? enquiry.intent : `${enquiry.intent} / ${subject}`}</small>
                    <time dateTime={enquiry.createdAt.toISOString()}>{formatWhen(enquiry.createdAt)}</time>
                  </summary>
                  <div className="desk-thread">
                    <article className="is-buyer">
                      <span className="label">{box === "sent" ? "You" : enquiry.name}{enquiry.company ? `, ${enquiry.company}` : ""}{enquiry.budget ? ` / budget ${enquiry.budget}` : ""}</span>
                      <p>{enquiry.message}</p>
                    </article>
                    {replies.map((message) => (
                      <article key={message.id} className={`is-${message.authorRole}`}>
                        <span className="label">{message.authorId === viewer.userId ? "You" : message.authorRole === "seller" ? "Seller" : message.authorRole === "desk" ? "Review desk" : enquiry.name} / {formatWhen(message.createdAt)}</span>
                        <p>{message.body}</p>
                      </article>
                    ))}
                    {sample && <p className="desk-fine">This is a sample record, so the review desk answers by email at {enquiry.email}. Reference {enquiry.ref}.</p>}
                    {enquiry.status !== "closed" && !sample && (
                      <ActionForm action={replyToEnquiry} className="desk-reply">
                        <input type="hidden" name="enquiryId" value={enquiry.id} />
                        <label><span className="label">Reply</span><textarea name="body" rows={3} maxLength={2000} required placeholder={box === "sent" ? "Add to your enquiry" : "Answer the buyer. Keep contact details inside Mayank until the desk introduces you."} /></label>
                        <button type="submit" className="btn btn-solid">Send reply<span>Visible to both sides</span></button>
                      </ActionForm>
                    )}
                    {box === "received" && enquiry.status !== "closed" && (
                      <ActionForm action={closeEnquiry} className="desk-close">
                        <input type="hidden" name="enquiryId" value={enquiry.id} />
                        <button type="submit" className="text-link">Close this enquiry</button>
                      </ActionForm>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="desk-empty is-large">
          <p>{box === "sent" ? "You have not enquired about anything yet." : "No enquiries yet. Buyers can write once one of your listings is live."}</p>
          <TransitionLink className="btn btn-outline" href={box === "sent" ? "/market" : "/dashboard/listings"}>{box === "sent" ? "Browse the market" : "Check your listings"}<span>{box === "sent" ? "Every record is reviewed" : "See what is live"}</span></TransitionLink>
        </div>
      )}
    </>
  );
}
