import { and, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ownerListings, recentEvents, viewsByDay } from "@/lib/server/listings";
import { requireViewer } from "@/lib/server/session";
import { isOpen, statusCopy } from "@/lib/listing-status";
import { memberPrice, memberRecordId } from "@/lib/member-plate";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ProgressRail, StatusStamp, ViewsChart, formatWhen } from "@/components/mayank/account/DeskParts";

export const metadata = { title: "Overview" };

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default async function DeskOverview() {
  const viewer = await requireViewer();
  const { enquiries, listings, saved } = schema;
  const [mine, events, views, [open], [sent], [watch]] = await Promise.all([
    ownerListings(viewer.userId),
    recentEvents(viewer.userId),
    viewsByDay(viewer.userId),
    db.select({ n: sql<number>`count(*)::int` }).from(enquiries).innerJoin(listings, eq(enquiries.listingId, listings.id)).where(and(eq(listings.ownerId, viewer.userId), eq(enquiries.status, "new"))),
    db.select({ n: sql<number>`count(*)::int` }).from(enquiries).where(eq(enquiries.buyerId, viewer.userId)),
    db.select({ n: sql<number>`count(*)::int` }).from(saved).where(eq(saved.userId, viewer.userId)),
  ]);

  const needsChange = mine.find((listing) => listing.status === "changes_requested");
  const next = needsChange
    ? { label: "Needs you", title: `${needsChange.name} needs a change`, copy: "The review desk left a note. Update the listing and send it back.", href: `/dashboard/listings/${needsChange.id}`, cta: "Read the note" }
    : open.n
      ? { label: "Inbox", title: `${open.n} new ${open.n === 1 ? "enquiry" : "enquiries"} waiting`, copy: "Buyers hear back faster from sellers who reply within a day.", href: "/dashboard/enquiries", cta: "Open the inbox" }
      : !mine.length
        ? { label: "Start", title: "List your first asset", copy: "Describe what exists, set your terms and send it for private review. It takes about ten minutes.", href: "/sell", cta: "Start a listing" }
        : { label: "Status", title: `${mine[0].name}: ${statusCopy[mine[0].status].label.toLowerCase()}`, copy: statusCopy[mine[0].status].next, href: `/dashboard/listings/${mine[0].id}`, cta: "Open the record" };

  const figures = [
    ["Live", mine.filter((listing) => listing.status === "live" || listing.status === "under_offer").length, "in the market"],
    ["In review", mine.filter((listing) => ["submitted", "in_review", "changes_requested"].includes(listing.status)).length, "with the desk"],
    ["New enquiries", open.n, "from buyers"],
    ["Saved", watch.n, `records / ${sent.n} enquiries sent`],
  ] as const;

  return (
    <>
      <header className="desk-head">
        <span className="label">01 / Overview</span>
        <h1>{greeting()}, <em>{viewer.profile.displayName.split(" ")[0]}.</em></h1>
      </header>

      <section className="desk-next" aria-labelledby="next-title">
        <span className="label">Next / {next.label}</span>
        <h2 id="next-title">{next.title}</h2>
        <p>{next.copy}</p>
        <TransitionLink className="btn btn-solid" href={next.href}>{next.cta}<span>{needsChange ? "Changes requested" : "One step"}</span></TransitionLink>
      </section>

      <dl className="desk-figures">
        {figures.map(([label, value, note]) => (
          <div key={label}><dt>{label}</dt><dd>{String(value).padStart(2, "0")}</dd><small>{note}</small></div>
        ))}
      </dl>

      <div className="desk-split">
        <section aria-labelledby="views-title">
          <h2 className="desk-subhead" id="views-title">Attention</h2>
          <ViewsChart days={views} />
          {!mine.some((listing) => listing.status === "live") && <p className="desk-fine">Views are counted once a listing is live in the market.</p>}
        </section>
        <section aria-labelledby="activity-title">
          <h2 className="desk-subhead" id="activity-title">Activity</h2>
          {events.length ? (
            <ol className="desk-activity">
              {events.map((event) => (
                <li key={event.id}>
                  <time dateTime={event.createdAt.toISOString()}>{formatWhen(event.createdAt)}</time>
                  <p><TransitionLink href={`/dashboard/listings/${event.listingId}`}>{event.name}</TransitionLink> {event.actor === "desk" ? "moved by the review desk to" : "set to"} <b>{statusCopy[event.status].label.toLowerCase()}</b>{event.note ? `. ${event.note}` : "."}</p>
                </li>
              ))}
            </ol>
          ) : <p className="desk-empty">Nothing has happened yet. Activity appears here as your listings move through review.</p>}
        </section>
      </div>

      <section aria-labelledby="records-title">
        <div className="desk-subhead-row">
          <h2 className="desk-subhead" id="records-title">Your records</h2>
          <TransitionLink className="text-link" href="/dashboard/listings">All listings</TransitionLink>
        </div>
        {mine.length ? (
          <ul className="desk-mini">
            {mine.filter((listing) => isOpen(listing.status)).slice(0, 4).map((listing) => (
              <li key={listing.id}>
                <TransitionLink href={`/dashboard/listings/${listing.id}`}>
                  <span className="label">{memberRecordId(listing.recordNo)}</span>
                  <strong>{listing.name}</strong>
                  <StatusStamp status={listing.status} />
                  <ProgressRail status={listing.status} compact />
                  <small>{memberPrice(listing)}</small>
                </TransitionLink>
              </li>
            ))}
          </ul>
        ) : <p className="desk-empty">No listings yet. <TransitionLink className="text-link" href="/sell">Start one</TransitionLink> and it will be filed here.</p>}
      </section>
    </>
  );
}
