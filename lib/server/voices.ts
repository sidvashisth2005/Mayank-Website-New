import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { sampleReviews, sampleTestimonials, type Review, type Testimonial } from "@/lib/catalogue/voices";

// Published feedback, with the labelled samples filling in until enough real
// entries exist. Real entries always come first.

const MIN_REAL = 3;

export type ShownTestimonial = Testimonial & { sample: boolean };
export type ShownReview = Review & { sample: boolean };

export async function testimonialsToShow(): Promise<ShownTestimonial[]> {
  let real: ShownTestimonial[] = [];
  try {
    const rows = await db.select().from(schema.testimonials).where(eq(schema.testimonials.status, "published")).orderBy(desc(schema.testimonials.createdAt)).limit(12);
    real = rows.map((row) => ({ quote: row.quote, name: row.authorName, role: row.authorRole, city: row.city, track: "seller", sample: false }));
  } catch (error) {
    console.error("Testimonials unavailable", error);
  }
  return real.length >= MIN_REAL ? real : [...real, ...sampleTestimonials.map((item) => ({ ...item, sample: true }))];
}

export async function reviewsFor(slug: string): Promise<ShownReview[]> {
  let real: ShownReview[] = [];
  try {
    const rows = await db.select().from(schema.reviews)
      .where(and(eq(schema.reviews.assetKey, slug), eq(schema.reviews.status, "published"))).orderBy(desc(schema.reviews.createdAt));
    real = rows.map((row) => ({
      rating: Math.min(5, Math.max(1, row.rating)) as Review["rating"], title: row.title, body: row.body, name: row.authorName,
      role: row.authorRole, date: row.createdAt.toISOString().slice(0, 10), verified: row.verified, sample: false,
    }));
  } catch (error) {
    console.error("Reviews unavailable", error);
  }
  const samples = (sampleReviews[slug] ?? []).map((item) => ({ ...item, sample: true }));
  return real.length >= MIN_REAL ? real : [...real, ...samples];
}
