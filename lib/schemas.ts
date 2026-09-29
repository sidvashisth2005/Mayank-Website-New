import { z } from "zod";

// Shared by the browser forms and the API routes so both reject the same input.

export const listingCategories = [
  "Complete product",
  "Code or technical asset",
  "Template or design system",
  "Domain and identity",
  "Social media page",
  "Ad account",
  "Cloud credits or subscription",
  "Other",
] as const;

export const providerDependentCategories: readonly string[] = ["Social media page", "Ad account", "Cloud credits or subscription"];

export const transferReadiness = [
  "I own the asset and can transfer it",
  "I own it but need transfer guidance",
  "Transfer depends on provider approval",
] as const;

const text = (min: number, max: number, message: string) => z.string().trim().min(min, message).max(max, `Keep this under ${max} characters.`);
const email = z.string().trim().email("Enter a valid email address.").max(160);
// Links are kept to plain web addresses; other schemes (javascript:, data:) are refused.
const webLink = z.union([z.literal(""), z.string().trim().max(300).url("Enter a full link, starting with https://").refine((value) => /^https?:\/\//i.test(value), "Use a link that starts with https://")]).default("");

export const listingSteps = {
  asset: z.object({
    name: text(2, 80, "Give the asset a name."),
    category: z.enum(listingCategories, { errorMap: () => ({ message: "Choose the closest category." }) }),
    description: text(40, 1200, "Describe what it is, its current status and why it has value (at least 40 characters)."),
  }),
  deal: z.object({
    dealType: z.enum(["Sell", "Rent or license"], { errorMap: () => ({ message: "Choose sell or rent." }) }),
    price: z.coerce.number({ invalid_type_error: "Enter a price in INR." }).int("Use whole rupees.").min(1000, "Enter a price of at least ₹1,000.").max(1_000_000_000),
    rentPeriod: z.enum(["", "month", "year"]).default(""),
    age: text(1, 40, "How old is the asset?"),
  }),
  evidence: z.object({
    condition: text(20, 1500, "Say what works today and what needs attention (at least 20 characters)."),
    metrics: z.string().trim().max(800).default(""),
    transfer: z.enum(transferReadiness, { errorMap: () => ({ message: "Choose the most accurate statement." }) }),
    dependencies: z.string().trim().max(800).default(""),
  }),
  media: z.object({
    videoUrl: webLink,
  }),
  contact: z.object({
    seller: text(1, 60, "A first name is enough."),
    contactMethod: z.enum(["Email", "WhatsApp"], { errorMap: () => ({ message: "Choose how we should reach you." }) }),
    email,
    whatsapp: z.string().trim().max(20).default(""),
    linkedin: webLink,
  }),
};

const MAX_IMAGE_CHARS = 1_500_000;

// The first bytes of the decoded file must match the declared image type, so
// a renamed script or document is rejected even if its name ends in .jpg.
function signatureMatches(type: string, content: string) {
  let head = "";
  try {
    head = atob(content.slice(0, 24));
  } catch {
    return false;
  }
  const bytes = Array.from(head, (char) => char.charCodeAt(0));
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && head.slice(1, 4) === "PNG";
  if (type === "image/webp") return head.slice(0, 4) === "RIFF" && head.slice(8, 12) === "WEBP";
  return false;
}

export const attachmentSchema = z
  .object({
    filename: z.string().max(120).transform((name) => name.replace(/[^\w. -]+/g, "_").slice(0, 100) || "image"),
    type: z.enum(["image/jpeg", "image/png", "image/webp"]),
    content: z.string().max(MAX_IMAGE_CHARS, "Each image must be under about 1 MB.").regex(/^[A-Za-z0-9+/]+={0,2}$/, "Image data is not valid."),
  })
  .refine((image) => signatureMatches(image.type, image.content), { message: "The file does not look like the image it claims to be." });

export const listingSchema = listingSteps.asset
  .merge(listingSteps.deal)
  .merge(listingSteps.evidence)
  .merge(listingSteps.media)
  .merge(listingSteps.contact)
  .extend({
    eligibility: z.literal(true, { errorMap: () => ({ message: "Confirm that you have the right to offer this asset." }) }),
    images: z.array(attachmentSchema).max(4).default([]),
    website: z.string().max(300).optional(),
    startedAt: z.number().int().nonnegative(),
  })
  .superRefine((value, context) => {
    if (value.contactMethod === "WhatsApp" && value.whatsapp.replace(/\D/g, "").length < 10) {
      context.addIssue({ code: "custom", path: ["whatsapp"], message: "Enter a WhatsApp number with country code." });
    }
    if (value.dealType === "Rent or license" && !value.rentPeriod) {
      context.addIssue({ code: "custom", path: ["rentPeriod"], message: "Choose a rental period." });
    }
  });

export const enquiryIntents = ["Buy outright", "Rent or licence", "Ask about similar assets", "Ask a question"] as const;

export const enquirySchema = z.object({
  asset: z.string().max(40),
  name: text(1, 80, "Enter your name."),
  email,
  company: z.string().trim().max(120).default(""),
  intent: z.enum(enquiryIntents),
  budget: z.string().trim().max(40).default(""),
  message: text(20, 2000, "Tell the seller what you plan to do with it (at least 20 characters)."),
  website: z.string().max(300).optional(),
  startedAt: z.number().int().nonnegative(),
});

export type SubmitResult = { ok: true; ref: string; mode: "sent" | "demo" } | { ok: false; error: string; fields?: Record<string, string> };

export function fieldErrors(error: z.ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}
