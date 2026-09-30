"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { getAsset } from "@/lib/assets";
import { listingStatus } from "@/lib/db/schema";
import { moveListing } from "@/lib/server/listings";
import { getViewer } from "@/lib/server/session";
import type { ActionState } from "@/components/mayank/account/ActionForm";

// Member actions. Each one re-reads the session, validates its input and
// checks ownership in the query itself, so a forged form cannot reach another
// member's records.

const signedOut: ActionState = { ok: false, message: "Your session ended. Sign in again to continue." };
const uuid = z.string().uuid();

export async function moveMyListing(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return signedOut;
  const parsed = z.object({ id: uuid, to: z.enum(listingStatus.enumValues) }).safeParse({ id: form.get("id"), to: form.get("to") });
  if (!parsed.success) return { ok: false, message: "That request could not be read." };
  const result = await moveListing(parsed.data.id, parsed.data.to, { role: "seller", viewer });
  if ("error" in result) return { ok: false, message: result.error ?? "Something went wrong." };
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Listing updated." };
}

const replySchema = z.object({
  enquiryId: uuid,
  body: z.string().trim().min(2, "Write a reply first.").max(2000, "Keep the reply under 2,000 characters."),
});

// Who may speak in a thread: the seller of the listing, or the buyer who sent it.
async function threadRole(enquiryId: string, userId: string) {
  const [row] = await db.select({ buyerId: schema.enquiries.buyerId, ownerId: schema.listings.ownerId })
    .from(schema.enquiries).leftJoin(schema.listings, eq(schema.enquiries.listingId, schema.listings.id))
    .where(eq(schema.enquiries.id, enquiryId)).limit(1);
  if (!row) return null;
  if (row.ownerId === userId) return "seller" as const;
  if (row.buyerId === userId) return "buyer" as const;
  return null;
}

export async function replyToEnquiry(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return signedOut;
  const parsed = replySchema.safeParse({ enquiryId: form.get("enquiryId"), body: form.get("body") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const role = await threadRole(parsed.data.enquiryId, viewer.userId);
  if (!role) return { ok: false, message: "This conversation is not available to you." };
  await db.insert(schema.messages).values({ enquiryId: parsed.data.enquiryId, authorId: viewer.userId, authorRole: role, body: parsed.data.body });
  if (role === "seller") await db.update(schema.enquiries).set({ status: "replied" }).where(eq(schema.enquiries.id, parsed.data.enquiryId));
  revalidatePath("/dashboard/enquiries");
  return { ok: true, message: "Reply sent." };
}

export async function closeEnquiry(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return signedOut;
  const id = uuid.safeParse(form.get("enquiryId"));
  if (!id.success) return { ok: false, message: "That request could not be read." };
  if (await threadRole(id.data, viewer.userId) !== "seller") return { ok: false, message: "Only the seller can close this enquiry." };
  await db.update(schema.enquiries).set({ status: "closed" }).where(eq(schema.enquiries.id, id.data));
  revalidatePath("/dashboard/enquiries");
  return { ok: true, message: "Enquiry closed." };
}

const profileSchema = z.object({
  displayName: z.string().trim().min(1, "Enter a name.").max(60, "Keep the name under 60 characters."),
  role: z.enum(["buyer", "seller", "both"]),
  city: z.string().trim().max(60, "Keep the city under 60 characters."),
  notifyEnquiries: z.boolean(),
  notifyReview: z.boolean(),
});

export async function saveProfile(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return signedOut;
  const parsed = profileSchema.safeParse({
    displayName: form.get("displayName"), role: form.get("role"), city: form.get("city") ?? "",
    notifyEnquiries: form.get("notifyEnquiries") === "on", notifyReview: form.get("notifyReview") === "on",
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await db.update(schema.profiles).set({ ...parsed.data, updatedAt: new Date() }).where(eq(schema.profiles.id, viewer.userId));
  revalidatePath("/dashboard", "layout");
  return { ok: true, message: "Profile saved." };
}

// Watchlist. Only records that exist in the catalogue can be saved.
export async function toggleSaved(slug: string): Promise<{ saved: boolean } | { error: string }> {
  const viewer = await getViewer();
  if (!viewer) return { error: "signed-out" };
  if (typeof slug !== "string" || !getAsset(slug)) return { error: "Unknown record." };
  const where = and(eq(schema.saved.userId, viewer.userId), eq(schema.saved.assetKey, slug));
  const removed = await db.delete(schema.saved).where(where).returning();
  if (!removed.length) await db.insert(schema.saved).values({ userId: viewer.userId, assetKey: slug }).onConflictDoNothing();
  revalidatePath("/dashboard/saved");
  return { saved: !removed.length };
}

export async function savedState(slug: string): Promise<boolean> {
  const viewer = await getViewer();
  if (!viewer || typeof slug !== "string") return false;
  const [row] = await db.select().from(schema.saved).where(and(eq(schema.saved.userId, viewer.userId), eq(schema.saved.assetKey, slug))).limit(1);
  return !!row;
}

const testimonialSchema = z.object({
  quote: z.string().trim().min(40, "Write at least 40 characters, so the testimonial says something specific.").max(600, "Keep it under 600 characters."),
  authorRole: z.string().trim().min(2, "Say what you do, for example Founder or Design lead.").max(80),
});

// Testimonials are held for moderation and published by the review desk.
export async function submitTestimonial(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer) return signedOut;
  const parsed = testimonialSchema.safeParse({ quote: form.get("quote"), authorRole: form.get("authorRole") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const [recent] = await db.select({ id: schema.testimonials.id }).from(schema.testimonials)
    .where(and(eq(schema.testimonials.authorId, viewer.userId), eq(schema.testimonials.status, "pending"))).limit(1);
  if (recent) return { ok: false, message: "Your earlier testimonial is still waiting for moderation." };
  const name = viewer.profile.displayName.split(" ");
  await db.insert(schema.testimonials).values({
    authorId: viewer.userId,
    authorName: name.length > 1 ? `${name[0]} ${name[name.length - 1][0]}.` : name[0],
    authorRole: parsed.data.authorRole,
    city: viewer.profile.city,
    quote: parsed.data.quote,
  });
  revalidatePath("/admin");
  return { ok: true, message: "Thank you. The review desk will read it before it appears." };
}
