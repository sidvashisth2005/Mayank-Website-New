"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { listingStatus } from "@/lib/db/schema";
import { moveListing } from "@/lib/server/listings";
import { getViewer } from "@/lib/server/session";
import type { ActionState } from "@/components/mayank/account/ActionForm";

// Review desk actions. The admin check is repeated here: a server action is a
// public endpoint, whatever page rendered the form.

const reviewSchema = z.object({
  id: z.string().uuid(),
  to: z.enum(listingStatus.enumValues),
  note: z.string().trim().max(1200, "Keep the note under 1,200 characters."),
});

export async function reviewListing(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return { ok: false, message: "Only the review desk can do this." };
  const parsed = reviewSchema.safeParse({ id: form.get("id"), to: form.get("to"), note: form.get("note") ?? "" });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if ((parsed.data.to === "changes_requested" || parsed.data.to === "declined") && parsed.data.note.length < 10) {
    return { ok: false, message: "Tell the seller what to change or why, in at least 10 characters." };
  }
  const result = await moveListing(parsed.data.id, parsed.data.to, { role: "desk", viewer }, parsed.data.note);
  if ("error" in result) return { ok: false, message: result.error ?? "Something went wrong." };
  revalidatePath("/admin", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/market", "layout");
  return { ok: true, message: "Decision recorded and the seller's desk updated." };
}

const moderateSchema = z.object({ id: z.string().uuid(), kind: z.enum(["review", "testimonial"]), status: z.enum(["published", "rejected"]) });

export async function moderate(_: ActionState, form: FormData): Promise<ActionState> {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) return { ok: false, message: "Only the review desk can do this." };
  const parsed = moderateSchema.safeParse({ id: form.get("id"), kind: form.get("kind"), status: form.get("status") });
  if (!parsed.success) return { ok: false, message: "That request could not be read." };
  const table = parsed.data.kind === "review" ? schema.reviews : schema.testimonials;
  await db.update(table).set({ status: parsed.data.status }).where(eq(table.id, parsed.data.id));
  revalidatePath("/admin");
  revalidatePath("/", "layout");
  return { ok: true, message: parsed.data.status === "published" ? "Published." : "Rejected." };
}
