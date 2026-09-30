import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { getAsset } from "@/lib/assets";
import { db, schema } from "@/lib/db";
import { enquirySchema, fieldErrors, type SubmitResult } from "@/lib/schemas";
import { MIN_FILL_MS, referenceId, sendMail } from "@/lib/mail";
import { guardRequest } from "@/lib/security";
import { getViewer } from "@/lib/server/session";

// Resolves what the enquiry is about: a sample record from the catalogue, or
// a member listing that is currently in the market.
async function resolveTarget(key: string) {
  const member = /^member:([0-9a-f-]{36})$/i.exec(key);
  if (!member) {
    const asset = getAsset(key);
    return asset ? { kind: "sample" as const, label: `${asset.id} / ${asset.name} (sample listing)`, slug: asset.slug } : null;
  }
  const [listing] = await db.select({ id: schema.listings.id, name: schema.listings.name, ownerId: schema.listings.ownerId })
    .from(schema.listings).where(and(eq(schema.listings.id, member[1]), inArray(schema.listings.status, ["live", "under_offer"]))).limit(1);
  return listing ? { kind: "member" as const, label: `${listing.name} (member listing)`, listingId: listing.id, ownerId: listing.ownerId } : null;
}

export async function POST(request: Request) {
  const guard = await guardRequest(request, { name: "enquiry", maxBytes: 20_000, limit: 10, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.response;
  const parsed = enquirySchema.safeParse(guard.body);
  if (!parsed.success) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Some answers need attention.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const enquiry = parsed.data;
  const target = await resolveTarget(enquiry.asset);
  if (!target) return NextResponse.json<SubmitResult>({ ok: false, error: "This record is not open for enquiries." }, { status: 404 });

  const ref = referenceId();
  if (enquiry.website || Date.now() - enquiry.startedAt < MIN_FILL_MS) {
    return NextResponse.json<SubmitResult>({ ok: true, ref, mode: "demo" });
  }

  const viewer = await getViewer();
  if (target.kind === "member" && viewer?.userId === target.ownerId) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "This is your own listing." }, { status: 409 });
  }

  try {
    await db.insert(schema.enquiries).values({
      ref,
      listingId: target.kind === "member" ? target.listingId : null,
      sampleSlug: target.kind === "sample" ? target.slug : null,
      buyerId: viewer?.userId ?? null,
      name: enquiry.name,
      email: enquiry.email,
      company: enquiry.company,
      intent: enquiry.intent,
      budget: enquiry.budget,
      message: enquiry.message,
    });
  } catch (error) {
    console.error("Enquiry could not be filed", error);
    return NextResponse.json<SubmitResult>({ ok: false, error: "The enquiry could not be filed. Please try again shortly." }, { status: 502 });
  }

  let mode: "sent" | "demo" = "sent";
  try {
    mode = await sendMail({
      subject: `Enquiry · ${target.label} · ${ref}`,
      replyTo: enquiry.email,
      rows: [
        ["Reference", ref],
        ["Record", target.label],
        ["Intent", enquiry.intent],
        ["Name", enquiry.name],
        ["Email", enquiry.email],
        ["Company", enquiry.company],
        ["Budget", enquiry.budget],
        ["Message", enquiry.message],
      ],
    });
  } catch (error) {
    console.error("Enquiry notification failed", error);
  }
  // Member enquiries always reach the seller's desk, with or without email.
  return NextResponse.json<SubmitResult>({ ok: true, ref, mode: target.kind === "member" ? "sent" : mode });
}
