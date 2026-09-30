import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

// Who is asking. Every dashboard and review-desk read or write starts here, so
// ownership checks always compare against a verified Clerk session.

const adminEmails = () =>
  (process.env.MAYANK_ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);

function verifiedEmail(user: NonNullable<Awaited<ReturnType<typeof currentUser>>>) {
  const primary = user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId);
  return primary?.verification?.status === "verified" ? primary.emailAddress.toLowerCase() : "";
}

export const getViewer = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  if (!user) return null;
  const email = verifiedEmail(user);

  let [profile] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, userId)).limit(1);
  if (!profile) {
    const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || email.split("@")[0] || "Member";
    [profile] = await db.insert(schema.profiles).values({ id: userId, email, displayName: displayName.slice(0, 60) })
      .onConflictDoUpdate({ target: schema.profiles.id, set: { email } }).returning();
  } else if (email && profile.email !== email) {
    [profile] = await db.update(schema.profiles).set({ email, updatedAt: new Date() }).where(eq(schema.profiles.id, userId)).returning();
  }

  return { userId, profile, email, isAdmin: !!email && adminEmails().includes(email), imageUrl: user.imageUrl };
});

export type Viewer = NonNullable<Awaited<ReturnType<typeof getViewer>>>;

export async function requireViewer(returnTo = "/dashboard") {
  const viewer = await getViewer();
  if (!viewer) redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  return viewer;
}

// The review desk answers 404 to anyone who is not on the admin list, so its
// existence is not advertised.
export async function requireAdmin() {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) notFound();
  return viewer;
}
