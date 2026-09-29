import { NextResponse } from "next/server";
import { getAsset } from "@/lib/assets";
import { enquirySchema, fieldErrors, type SubmitResult } from "@/lib/schemas";
import { MIN_FILL_MS, referenceId, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<SubmitResult>({ ok: false, error: "Some answers need attention.", fields: fieldErrors(parsed.error) }, { status: 422 });
  }
  const enquiry = parsed.data;
  const asset = getAsset(enquiry.asset);
  if (!asset) return NextResponse.json<SubmitResult>({ ok: false, error: "This record no longer exists." }, { status: 404 });

  const ref = referenceId();
  if (enquiry.website || Date.now() - enquiry.startedAt < MIN_FILL_MS) {
    return NextResponse.json<SubmitResult>({ ok: true, ref, mode: "demo" });
  }

  try {
    const mode = await sendMail({
      subject: `Enquiry · ${asset.id} ${asset.name} · ${ref}`,
      replyTo: enquiry.email,
      rows: [
        ["Reference", ref],
        ["Record", `${asset.id} / ${asset.name} (sample listing)`],
        ["Intent", enquiry.intent],
        ["Name", enquiry.name],
        ["Email", enquiry.email],
        ["Company", enquiry.company],
        ["Budget", enquiry.budget],
        ["Message", enquiry.message],
      ],
    });
    return NextResponse.json<SubmitResult>({ ok: true, ref, mode });
  } catch (error) {
    console.error("Enquiry email failed", error);
    return NextResponse.json<SubmitResult>({ ok: false, error: "The enquiry could not be delivered. Please try again shortly." }, { status: 502 });
  }
}
