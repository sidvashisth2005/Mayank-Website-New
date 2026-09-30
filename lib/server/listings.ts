import { put } from "@vercel/blob";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { ListingStatus } from "@/lib/db/schema";
import { deskMoves, sellerMoves } from "@/lib/listing-status";
import { referenceId } from "@/lib/mail";
import type { listingSchema } from "@/lib/schemas";
import type { z } from "zod";
import type { Viewer } from "./session";

// Listing records. Seller functions always filter by owner id; desk functions
// are only called after requireAdmin().

const { listings, listingImages, listingEvents, enquiries, profiles } = schema;
type ListingInput = z.infer<typeof listingSchema>;

export async function createListing(viewer: Viewer, input: ListingInput) {
  const ref = referenceId();
  const [listing] = await db.insert(listings).values({
    ref,
    ownerId: viewer.userId,
    name: input.name,
    category: input.category,
    description: input.description,
    dealType: input.dealType,
    price: input.price,
    rentPeriod: input.dealType === "Sell" ? "" : input.rentPeriod,
    age: input.age,
    condition: input.condition,
    metrics: input.metrics,
    transfer: input.transfer,
    dependencies: input.dependencies,
    videoUrl: input.videoUrl,
    sellerName: input.seller,
    contactMethod: input.contactMethod,
    email: input.email,
    whatsapp: input.whatsapp,
    linkedin: input.linkedin,
  }).returning();

  // Images were checked for type and signature by the schema. They are
  // stored under an unguessable path; nothing links to them until review.
  const uploaded = await Promise.all(input.images.map(async (image, position) => {
    const blob = await put(`listings/${listing.id}/${position + 1}.jpg`, Buffer.from(image.content, "base64"), {
      access: "public",
      contentType: image.type,
      addRandomSuffix: true,
    });
    return { listingId: listing.id, url: blob.url, pathname: blob.pathname, alt: `${input.name}, image ${position + 1}`, position };
  }));
  if (uploaded.length) await db.insert(listingImages).values(uploaded);
  await db.insert(listingEvents).values({ listingId: listing.id, status: "submitted", actor: "seller", note: "Listing sent for private review." });
  return listing;
}

const coverImage = sql<string | null>`(select ${listingImages.url} from ${listingImages} where ${listingImages.listingId} = ${listings.id} order by ${listingImages.position} limit 1)`;
const openEnquiries = sql<number>`(select count(*)::int from ${enquiries} where ${enquiries.listingId} = ${listings.id} and ${enquiries.status} <> 'closed')`;

export function ownerListings(userId: string) {
  return db.select({
    id: listings.id, ref: listings.ref, recordNo: listings.recordNo, name: listings.name, category: listings.category,
    status: listings.status, dealType: listings.dealType, price: listings.price, rentPeriod: listings.rentPeriod,
    updatedAt: listings.updatedAt, createdAt: listings.createdAt, cover: coverImage, openEnquiries,
  }).from(listings).where(eq(listings.ownerId, userId)).orderBy(desc(listings.updatedAt));
}

export async function ownerListing(userId: string, id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [listing] = await db.select().from(listings).where(and(eq(listings.id, id), eq(listings.ownerId, userId))).limit(1);
  if (!listing) return null;
  const [images, events, received] = await Promise.all([
    db.select().from(listingImages).where(eq(listingImages.listingId, id)).orderBy(asc(listingImages.position)),
    db.select().from(listingEvents).where(eq(listingEvents.listingId, id)).orderBy(asc(listingEvents.createdAt)),
    db.select().from(enquiries).where(eq(enquiries.listingId, id)).orderBy(desc(enquiries.createdAt)),
  ]);
  return { listing, images, events, enquiries: received };
}

export async function recentEvents(userId: string, limit = 8) {
  return db.select({ id: listingEvents.id, status: listingEvents.status, actor: listingEvents.actor, note: listingEvents.note, createdAt: listingEvents.createdAt, listingId: listings.id, name: listings.name })
    .from(listingEvents).innerJoin(listings, eq(listingEvents.listingId, listings.id))
    .where(eq(listings.ownerId, userId)).orderBy(desc(listingEvents.createdAt)).limit(limit);
}

export async function viewsByDay(userId: string, days = 30) {
  const rows = await db.execute<{ day: string; count: number }>(sql`
    select d::date::text as day, coalesce(sum(v.count), 0)::int as count
    from generate_series(current_date - ${days - 1}::int, current_date, interval '1 day') d
    left join ${schema.listingViews} v on v.day = d::date
      and v.listing_id in (select id from ${listings} where owner_id = ${userId})
    group by d order by d`);
  return rows.rows;
}

type Actor = { role: "seller"; viewer: Viewer } | { role: "desk"; viewer: Viewer };

// Moves a listing along its path. Returns an error string when the move is not
// allowed for this actor from the current status.
export async function moveListing(id: string, to: ListingStatus, actor: Actor, note = "") {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { error: "Listing not found." } as const;
  const owned = actor.role === "seller" ? eq(listings.ownerId, actor.viewer.userId) : undefined;
  const [listing] = await db.select().from(listings).where(and(eq(listings.id, id), owned)).limit(1);
  if (!listing) return { error: "Listing not found." } as const;
  const allowed = (actor.role === "desk" ? deskMoves : sellerMoves)[listing.status] ?? [];
  if (!allowed.includes(to)) return { error: "That step is not available for this listing right now." } as const;

  const now = new Date();
  const [updated] = await db.update(listings).set({
    status: to,
    updatedAt: now,
    ...(actor.role === "desk" && note ? { reviewerNote: note } : {}),
    ...(to === "live" && !listing.publishedAt ? { publishedAt: now } : {}),
  }).where(and(eq(listings.id, id), eq(listings.status, listing.status))).returning();
  if (!updated) return { error: "The listing changed while you were working. Reload and try again." } as const;
  await db.insert(listingEvents).values({ listingId: id, status: to, actor: actor.role, note });
  return { listing: updated } as const;
}

export function deskQueue() {
  return db.select({
    id: listings.id, ref: listings.ref, recordNo: listings.recordNo, name: listings.name, category: listings.category,
    status: listings.status, dealType: listings.dealType, price: listings.price, rentPeriod: listings.rentPeriod,
    createdAt: listings.createdAt, updatedAt: listings.updatedAt, cover: coverImage, seller: profiles.displayName, sellerEmail: profiles.email,
  }).from(listings).innerJoin(profiles, eq(listings.ownerId, profiles.id))
    .where(inArray(listings.status, ["submitted", "in_review", "changes_requested", "live", "under_offer"]))
    .orderBy(asc(listings.createdAt));
}

export async function deskListing(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.select({ listing: listings, seller: profiles }).from(listings).innerJoin(profiles, eq(listings.ownerId, profiles.id)).where(eq(listings.id, id)).limit(1);
  if (!row) return null;
  const [images, events] = await Promise.all([
    db.select().from(listingImages).where(eq(listingImages.listingId, id)).orderBy(asc(listingImages.position)),
    db.select().from(listingEvents).where(eq(listingEvents.listingId, id)).orderBy(asc(listingEvents.createdAt)),
  ]);
  return { ...row, images, events };
}
