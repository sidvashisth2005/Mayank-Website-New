import { NextResponse } from "next/server";
import { fieldErrors, listingSchema, type SubmitResult } from "@/lib/schemas";
import { MIN_FILL_MS, referenceId, sendMail } from "@/lib/mail";
import { guardRequest, singleLine } from "@/lib/security";
import { createListing } from "@/lib/server/listings";
import { getViewer } from "@/lib/server/session";

const MAX_ATTACHMENT_CHARS = 3_800_000;

// A listing is filed against the signed-in member, so it can be tracked from
// their desk. The review desk is also told by email when an inbox is set.
export async function POST(request: Request) {
  const guard = await guardRequest(request, { name: "listing", maxBytes: 4_200_000, limit: 5, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.response;
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json<SubmitResult>({ ok: false, error: "Sign in to send a listing for review. Your draft is saved on this device." }, { status: 401 });

  const parsed = listingSchema.safeParse(guard.body);
  if (!parsed.success) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Some answers need attention.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const input = parsed.data;

  // Bots fill the hidden field or submit instantly; answer as if accepted.
  if (input.website || Date.now() - input.startedAt < MIN_FILL_MS) {
    return NextResponse.json<SubmitResult>({ ok: true, ref: referenceId(), mode: "demo" });
  }

  const attachmentChars = input.images.reduce((total, image) => total + image.content.length, 0);
  if (attachmentChars > MAX_ATTACHMENT_CHARS) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Images are too large together. Remove one and try again." }, { status: 413 });
  }

  let listing;
  try {
    listing = await createListing(viewer, input);
  } catch (error) {
    console.error("Listing could not be filed", error);
    return NextResponse.json<SubmitResult>({ ok: false, error: "The listing could not be filed. Your draft is still saved, so please try again shortly." }, { status: 502 });
  }

  try {
    await sendMail({
      subject: `New listing for review · ${singleLine(input.name, 80)} · ${listing.ref}`,
      replyTo: input.email,
      rows: [
        ["Reference", listing.ref],
        ["Review desk", `/admin/${listing.id}`],
        ["Asset", input.name],
        ["Category", input.category],
        ["Deal", input.dealType === "Sell" ? "Sell" : `Rent or licence (per ${input.rentPeriod})`],
        ["Asking price (INR)", input.price.toLocaleString("en-IN")],
        ["Seller", `${input.seller} (${viewer.email || "unverified email"})`],
        ["Images", String(input.images.length)],
      ],
    });
  } catch (error) {
    // The listing is already filed; a failed notification must not undo it.
    console.error("Listing notification failed", error);
  }
  return NextResponse.json<SubmitResult>({ ok: true, ref: listing.ref, mode: "sent", id: listing.id });
}
