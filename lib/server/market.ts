import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

// Public reads of member listings. Only records the review desk published are
// returned, and never the seller's contact details.

const { listings, listingImages, listingViews, profiles } = schema;
const inMarket = inArray(listings.status, ["live", "under_offer"]);

const publicColumns = {
  id: listings.id, recordNo: listings.recordNo, name: listings.name, category: listings.category, status: listings.status,
  description: listings.description, dealType: listings.dealType, price: listings.price, rentPeriod: listings.rentPeriod,
  age: listings.age, condition: listings.condition, metrics: listings.metrics, transfer: listings.transfer,
  dependencies: listings.dependencies, publishedAt: listings.publishedAt,
};

export async function memberListingsInMarket() {
  try {
    return await db.select({
      ...publicColumns,
      cover: sql<string | null>`(select ${listingImages.url} from ${listingImages} where ${listingImages.listingId} = ${listings.id} order by ${listingImages.position} limit 1)`,
    }).from(listings).where(inMarket).orderBy(desc(listings.publishedAt)).limit(24);
  } catch (error) {
    // The sample market still renders if the database is unreachable.
    console.error("Member listings unavailable", error);
    return [];
  }
}

export async function memberListingPublic(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db.select({ ...publicColumns, sellerName: profiles.displayName, sellerCity: profiles.city })
    .from(listings).innerJoin(profiles, eq(listings.ownerId, profiles.id)).where(and(eq(listings.id, id), inMarket)).limit(1);
  if (!row) return null;
  const images = await db.select({ url: listingImages.url, alt: listingImages.alt }).from(listingImages).where(eq(listingImages.listingId, id)).orderBy(asc(listingImages.position));
  return { ...row, images };
}

export async function countView(id: string) {
  try {
    await db.insert(listingViews).values({ listingId: id, day: sql`current_date`, count: 1 })
      .onConflictDoUpdate({ target: [listingViews.listingId, listingViews.day], set: { count: sql`${listingViews.count} + 1` } });
  } catch (error) {
    console.error("View not counted", error);
  }
}
