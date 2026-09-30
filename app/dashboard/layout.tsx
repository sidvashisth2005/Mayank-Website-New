import type { Metadata } from "next";
import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireViewer } from "@/lib/server/session";
import { DeskNav } from "@/components/mayank/account/DeskNav";

export const metadata: Metadata = { title: { default: "Your desk", template: "%s / Desk | Mayank" }, robots: { index: false, follow: false } };

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireViewer();
  const { listings, enquiries } = schema;
  const [[changes], [open]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(listings).where(and(eq(listings.ownerId, viewer.userId), eq(listings.status, "changes_requested"))),
    db.select({ n: sql<number>`count(*)::int` }).from(enquiries).innerJoin(listings, eq(enquiries.listingId, listings.id))
      .where(and(eq(listings.ownerId, viewer.userId), inArray(enquiries.status, ["new"]), ne(listings.status, "withdrawn"))),
  ]);

  return (
    <main id="main" tabIndex={-1} className="desk">
      <aside className="desk-rail">
        <div className="desk-id">
          <span className="label">Desk / {viewer.profile.role === "both" ? "Buyer and seller" : viewer.profile.role === "buyer" ? "Buyer" : "Seller"}</span>
          <strong>{viewer.profile.displayName}</strong>
          {viewer.profile.city && <small>{viewer.profile.city}</small>}
        </div>
        <DeskNav isAdmin={viewer.isAdmin} counts={{ "/dashboard/listings": changes.n, "/dashboard/enquiries": open.n }} />
      </aside>
      <div className="desk-body">{children}</div>
    </main>
  );
}
