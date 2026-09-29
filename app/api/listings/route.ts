import { NextResponse } from "next/server";
import { fieldErrors, listingSchema, type SubmitResult } from "@/lib/schemas";
import { MIN_FILL_MS, referenceId, sendMail } from "@/lib/mail";

const MAX_ATTACHMENT_CHARS = 3_800_000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Some answers need attention.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const listing = parsed.data;
  const ref = referenceId();

  // Bots fill the hidden field or submit instantly; answer as if accepted.
  if (listing.website || Date.now() - listing.startedAt < MIN_FILL_MS) {
    return NextResponse.json<SubmitResult>({ ok: true, ref, mode: "demo" });
  }

  const attachmentChars = listing.images.reduce((total, image) => total + image.content.length, 0);
  if (attachmentChars > MAX_ATTACHMENT_CHARS) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Images are too large together. Remove one and try again." }, { status: 413 });
  }

  try {
    const mode = await sendMail({
      subject: `New listing for review · ${listing.name} · ${ref}`,
      replyTo: listing.email,
      rows: [
        ["Reference", ref],
        ["Asset", listing.name],
        ["Category", listing.category],
        ["Description", listing.description],
        ["Deal", listing.dealType === "Sell" ? "Sell" : `Rent or licence (per ${listing.rentPeriod})`],
        ["Asking price (INR)", listing.price.toLocaleString("en-IN")],
        ["Asset age", listing.age],
        ["Present condition", listing.condition],
        ["Metrics", listing.metrics],
        ["Transfer readiness", listing.transfer],
        ["Provider dependencies", listing.dependencies],
        ["Video link", listing.videoUrl],
        ["Images attached", String(listing.images.length)],
        ["Seller", listing.seller],
        ["Contact preference", listing.contactMethod],
        ["Email", listing.email],
        ["WhatsApp", listing.whatsapp],
        ["LinkedIn", listing.linkedin],
      ],
      attachments: listing.images.map(({ filename, content }) => ({ filename, content })),
    });
    return NextResponse.json<SubmitResult>({ ok: true, ref, mode });
  } catch (error) {
    console.error("Listing email failed", error);
    return NextResponse.json<SubmitResult>({ ok: false, error: "The listing could not be delivered. Your draft is still saved, so please try again shortly." }, { status: 502 });
  }
}
