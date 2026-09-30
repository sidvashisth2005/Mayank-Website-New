import { boolean, date, index, integer, pgEnum, pgTable, primaryKey, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Mayank's records. Clerk owns identity; every row points at a Clerk user id.

export const listingStatus = pgEnum("listing_status", [
  "submitted",
  "in_review",
  "changes_requested",
  "live",
  "under_offer",
  "transferred",
  "declined",
  "withdrawn",
]);

export const enquiryStatus = pgEnum("enquiry_status", ["new", "replied", "closed"]);
export const moderation = pgEnum("moderation", ["pending", "published", "rejected"]);

const created = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["buyer", "seller", "both"] }).default("both").notNull(),
  city: text("city").default("").notNull(),
  notifyEnquiries: boolean("notify_enquiries").default(true).notNull(),
  notifyReview: boolean("notify_review").default(true).notNull(),
  createdAt: created(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref: text("ref").notNull().unique(),
  recordNo: integer("record_no").generatedAlwaysAsIdentity({ startWith: 201 }),
  ownerId: text("owner_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: listingStatus("status").default("submitted").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  dealType: text("deal_type", { enum: ["Sell", "Rent or license"] }).notNull(),
  price: integer("price").notNull(),
  rentPeriod: text("rent_period").default("").notNull(),
  age: text("age").notNull(),
  condition: text("condition").notNull(),
  metrics: text("metrics").default("").notNull(),
  transfer: text("transfer").notNull(),
  dependencies: text("dependencies").default("").notNull(),
  videoUrl: text("video_url").default("").notNull(),
  sellerName: text("seller_name").notNull(),
  contactMethod: text("contact_method", { enum: ["Email", "WhatsApp"] }).notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").default("").notNull(),
  linkedin: text("linkedin").default("").notNull(),
  reviewerNote: text("reviewer_note").default("").notNull(),
  createdAt: created(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
}, (table) => [index("listings_owner_idx").on(table.ownerId), index("listings_status_idx").on(table.status)]);

export const listingImages = pgTable("listing_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  alt: text("alt").notNull(),
  position: smallint("position").notNull(),
}, (table) => [index("listing_images_listing_idx").on(table.listingId)]);

// The progress timeline of a listing, newest last.
export const listingEvents = pgTable("listing_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  status: listingStatus("status").notNull(),
  actor: text("actor", { enum: ["seller", "desk"] }).notNull(),
  note: text("note").default("").notNull(),
  createdAt: created(),
}, (table) => [index("listing_events_listing_idx").on(table.listingId)]);

// An enquiry targets either a member listing or a sample record from the catalogue.
export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref: text("ref").notNull().unique(),
  listingId: uuid("listing_id").references(() => listings.id, { onDelete: "cascade" }),
  sampleSlug: text("sample_slug"),
  buyerId: text("buyer_id").references(() => profiles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").default("").notNull(),
  intent: text("intent").notNull(),
  budget: text("budget").default("").notNull(),
  message: text("message").notNull(),
  status: enquiryStatus("status").default("new").notNull(),
  createdAt: created(),
}, (table) => [index("enquiries_listing_idx").on(table.listingId), index("enquiries_buyer_idx").on(table.buyerId)]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").notNull().references(() => enquiries.id, { onDelete: "cascade" }),
  authorId: text("author_id").references(() => profiles.id, { onDelete: "set null" }),
  authorRole: text("author_role", { enum: ["buyer", "seller", "desk"] }).notNull(),
  body: text("body").notNull(),
  createdAt: created(),
}, (table) => [index("messages_enquiry_idx").on(table.enquiryId)]);

// Watchlist. assetKey is a catalogue slug or a member listing slug.
export const saved = pgTable("saved", {
  userId: text("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  assetKey: text("asset_key").notNull(),
  createdAt: created(),
}, (table) => [primaryKey({ columns: [table.userId, table.assetKey] })]);

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetKey: text("asset_key").notNull(),
  authorId: text("author_id").references(() => profiles.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").default("").notNull(),
  rating: smallint("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  verified: boolean("verified").default(false).notNull(),
  status: moderation("status").default("pending").notNull(),
  createdAt: created(),
}, (table) => [index("reviews_asset_idx").on(table.assetKey)]);

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: text("author_id").references(() => profiles.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  city: text("city").default("").notNull(),
  quote: text("quote").notNull(),
  status: moderation("status").default("pending").notNull(),
  createdAt: created(),
});

export const listingViews = pgTable("listing_views", {
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  day: date("day").notNull(),
  count: integer("count").default(0).notNull(),
}, (table) => [primaryKey({ columns: [table.listingId, table.day] })]);

export type Listing = typeof listings.$inferSelect;
export type ListingStatus = (typeof listingStatus.enumValues)[number];
export type Enquiry = typeof enquiries.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
