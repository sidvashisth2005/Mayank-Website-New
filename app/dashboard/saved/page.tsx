import Image from "next/image";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { categoryOf, formatPrice, galleryFor, getAsset, statusLabel } from "@/lib/assets";
import { requireViewer } from "@/lib/server/session";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { SaveButton } from "@/components/mayank/account/SaveButton";
import { formatWhen } from "@/components/mayank/account/DeskParts";

export const metadata = { title: "Saved" };

export default async function DeskSaved() {
  const viewer = await requireViewer("/dashboard/saved");
  const rows = await db.select().from(schema.saved).where(eq(schema.saved.userId, viewer.userId)).orderBy(desc(schema.saved.createdAt));
  const records = rows.flatMap((row) => {
    const asset = getAsset(row.assetKey);
    return asset ? [{ asset, savedAt: row.createdAt }] : [];
  });

  return (
    <>
      <header className="desk-head">
        <span className="label">04 / Saved</span>
        <h1>Records you are <em>watching.</em></h1>
      </header>
      {records.length ? (
        <ol className="desk-table is-saved">
          {records.map(({ asset, savedAt }) => (
            <li key={asset.slug}>
              <TransitionLink href={`/market/${asset.slug}`}>
                <span className="desk-thumb is-wide"><Image src={galleryFor(asset)[0]} alt="" fill sizes="160px" /></span>
                <span className="desk-row-name"><small>{asset.id} / {categoryOf(asset.category).label}</small><strong>{asset.name}</strong></span>
                <span className="desk-row-meta"><strong>{formatPrice(asset)}</strong><small>{statusLabel[asset.status]} / saved {formatWhen(savedAt)}</small></span>
              </TransitionLink>
              <SaveButton slug={asset.slug} initial />
            </li>
          ))}
        </ol>
      ) : (
        <div className="desk-empty is-large">
          <p>Nothing saved yet. Use Save on any record in the market to keep it here.</p>
          <TransitionLink className="btn btn-outline" href="/market">Browse the market<span>Sample edition records</span></TransitionLink>
        </div>
      )}
    </>
  );
}
