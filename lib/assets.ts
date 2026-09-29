// Edition 01 inventory. Every record here is a sample listing used to
// demonstrate the marketplace; none of them represents a real seller.

export const categories = [
  { key: "product", ink: "#9C3D2A", label: "Complete product", plural: "Complete products", note: "Working software with source, deployment notes and a founder handover." },
  { key: "code", ink: "#3E5566", label: "Code & technical", plural: "Code & technical assets", note: "Repositories, APIs, SDKs and internal tools with documented history." },
  { key: "domain", ink: "#8E6718", label: "Domain & identity", plural: "Domains & identity", note: "Names with registrar proof, plus the identity work built around them." },
  { key: "design", ink: "#5D6B3C", label: "Design system", plural: "Design systems", note: "Component libraries, tokens and interface kits with licence terms." },
  { key: "template", ink: "#4B3A4F", label: "Template", plural: "Templates", note: "Site, product and content templates sold outright or licensed." },
  { key: "provider", ink: "#2F3130", label: "Provider-eligible", plural: "Provider-eligible assets", note: "App listings, pages or capacity, only where the provider permits a documented transfer." },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];
export type DealType = "sell" | "rent";
export type ListingStatus = "live" | "sold" | "rented";
export type SampleVariant = "analytics" | "portal" | "domain" | "system" | "code" | "template" | "app";

export type Asset = {
  id: string;
  slug: string;
  name: string;
  type: string;
  category: CategoryKey;
  deal: DealType;
  status: ListingStatus;
  price: number;
  priceUnit?: "year" | "month";
  ageMonths: number;
  listed: string;
  summary: string;
  description: string;
  review: string;
  access: string;
  route: string;
  transferWindow: string;
  includes: string[];
  works: string[];
  depends: string[];
  excluded: string[];
  metric: { value: string; label: string };
  bars: number[];
  sample: SampleVariant;
  specimen: { image: "object" | "detail"; position: string };
};

export const assets: Asset[] = [
  {
    id: "MX-024", slug: "kite", name: "Kite", type: "Analytics product", category: "product", deal: "sell", status: "live",
    price: 185000, ageMonths: 18, listed: "2026-09-21",
    summary: "A focused analytics workspace for subscription teams.",
    description: "A focused analytics workspace for subscription teams, including the interface system, production code and operating notes.",
    review: "Evidence reviewed", access: "Private demo after accepted enquiry",
    route: "Repository, deployment and 21-day handover", transferWindow: "21 days",
    includes: ["Production repository", "Deployment notes", "Interface system", "Founder handover"],
    works: ["Cohort, revenue and churn dashboards", "Stripe billing import", "Team workspaces and roles"],
    depends: ["Hosting is excluded and must be replaced by the buyer", "Stripe account is re-connected by the new owner"],
    excluded: ["Customer accounts and their data", "The original company name"],
    metric: { value: "1,284", label: "active accounts" },
    bars: [34, 49, 43, 67, 58, 75, 84, 69, 91, 78, 96, 88], sample: "analytics",
    specimen: { image: "object", position: "52% center" },
  },
  {
    id: "MX-031", slug: "northstar", name: "Northstar", type: "Domain and identity", category: "domain", deal: "sell", status: "live",
    price: 78000, ageMonths: 36, listed: "2026-09-18",
    summary: "A concise dot-com with a complete naming system.",
    description: "A concise dot-com name with a complete naming system, launch language and editable master identity files.",
    review: "Route documented", access: "Registrar proof after accepted enquiry",
    route: "Registrar transfer and editable identity archive", transferWindow: "5–7 days",
    includes: ["Dot-com domain", "Identity masters", "Naming guidelines", "Launch copy deck"],
    works: ["Domain renewed through next year", "Editable logo and type masters", "Clean registrar history"],
    depends: ["Registrar eligibility and transfer lock are confirmed before completion"],
    excluded: ["Social handles with the same name", "Trademark registration"],
    metric: { value: "14", label: "original files" },
    bars: [72, 72, 18, 18, 52, 52, 88, 88, 38, 38, 63, 63], sample: "domain",
    specimen: { image: "detail", position: "40% center" },
  },
  {
    id: "MX-038", slug: "relay", name: "Relay", type: "Design system", category: "design", deal: "rent", status: "live",
    price: 42000, priceUnit: "year", ageMonths: 11, listed: "2026-09-16",
    summary: "A production-tested interface library, licensed exclusively.",
    description: "A production-tested interface library with design tokens, accessibility notes and implementation guidance, offered as an exclusive yearly licence.",
    review: "Evidence ready", access: "Read-only library review",
    route: "Exclusive licence with source library", transferWindow: "10 days",
    includes: ["126 components", "Design tokens", "Implementation notes", "Accessibility audit"],
    works: ["Light and dark token sets", "React implementation for 84 components", "Documented focus states"],
    depends: ["Fonts and third-party icon licences are documented separately"],
    excluded: ["Ownership of the library, as this is a licence", "Future component updates"],
    metric: { value: "126", label: "production components" },
    bars: [25, 31, 44, 51, 62, 66, 71, 76, 81, 84, 89, 94], sample: "system",
    specimen: { image: "object", position: "68% center" },
  },
  {
    id: "MX-043", slug: "atlas", name: "Atlas", type: "Support portal", category: "product", deal: "sell", status: "live",
    price: 240000, ageMonths: 22, listed: "2026-09-12",
    summary: "A searchable support portal with a publishing workflow.",
    description: "A searchable support portal with publishing workflow, deployment documentation and a clean operator handover.",
    review: "Evidence reviewed", access: "Guided product walkthrough",
    route: "Native transfer with 30-day founder support", transferWindow: "30 days",
    includes: ["Application source", "Publishing workflow", "Operator handbook", "30-day founder support"],
    works: ["Full-text help search", "Draft, review and publish states", "Multi-language articles"],
    depends: ["Search infrastructure requires a new billing owner at transfer"],
    excluded: ["Existing customer help content", "Support inbox history"],
    metric: { value: "2.7m", label: "indexed help words" },
    bars: [81, 54, 68, 42, 76, 64, 88, 71, 92, 85, 97, 90], sample: "portal",
    specimen: { image: "detail", position: "62% center" },
  },
  {
    id: "MX-047", slug: "ledgerline", name: "Ledgerline", type: "Invoicing API and SDK", category: "code", deal: "sell", status: "live",
    price: 96000, ageMonths: 14, listed: "2026-09-24",
    summary: "A GST-ready invoicing API with TypeScript and Python SDKs.",
    description: "A GST-ready invoicing API with TypeScript and Python SDKs, test suite and a documented migration path off the original infrastructure.",
    review: "Evidence reviewed", access: "Read-only repository review",
    route: "Repository transfer and SDK package ownership", transferWindow: "14 days",
    includes: ["API source", "TypeScript SDK", "Python SDK", "Test suite and fixtures"],
    works: ["Invoice, credit note and tax-summary endpoints", "PDF rendering", "Webhook delivery with retries"],
    depends: ["Package registry ownership moves separately for each SDK"],
    excluded: ["Production database", "API keys issued to former users"],
    metric: { value: "412", label: "passing tests" },
    bars: [40, 46, 52, 49, 61, 66, 64, 72, 78, 83, 86, 91], sample: "code",
    specimen: { image: "object", position: "30% center" },
  },
  {
    id: "MX-051", slug: "paperplane", name: "Paperplane", type: "Launch site template kit", category: "template", deal: "rent", status: "live",
    price: 18000, priceUnit: "year", ageMonths: 9, listed: "2026-09-26",
    summary: "Nine launch-page templates, licensed per company.",
    description: "Nine launch and pricing page templates with editable copy structure and responsive layouts, licensed per company, per year.",
    review: "Evidence ready", access: "Live preview of all nine pages",
    route: "Non-exclusive yearly licence", transferWindow: "2 days",
    includes: ["9 page templates", "Section library", "Copy structure guide"],
    works: ["Responsive from 360px to wide desktop", "Editable section order", "Accessible form patterns"],
    depends: ["Stock imagery is not included and must be replaced"],
    excluded: ["Exclusive rights", "Custom design work"],
    metric: { value: "9", label: "page templates" },
    bars: [60, 60, 60, 72, 72, 72, 55, 55, 55, 80, 80, 80], sample: "template",
    specimen: { image: "detail", position: "20% center" },
  },
  {
    id: "MX-054", slug: "tessellate", name: "Tessellate", type: "Data-visualisation kit", category: "design", deal: "sell", status: "sold",
    price: 64000, ageMonths: 16, listed: "2026-08-30",
    summary: "Chart components and guidance for dense product dashboards.",
    description: "Chart components, colour guidance and layout rules for dense product dashboards. This record is closed and shown for reference.",
    review: "Transfer completed", access: "Closed record",
    route: "Full assignment of design and code", transferWindow: "12 days",
    includes: ["38 chart components", "Colour guidance", "Dashboard layouts"],
    works: ["Line, bar, area and table components", "Colour-blind safe palettes"],
    depends: ["None recorded"],
    excluded: ["Brand assets of the original company"],
    metric: { value: "38", label: "chart components" },
    bars: [30, 58, 44, 70, 52, 81, 63, 76, 48, 88, 67, 92], sample: "system",
    specimen: { image: "object", position: "80% center" },
  },
  {
    id: "MX-058", slug: "tidewater", name: "Tidewater", type: "iOS habit app", category: "provider", deal: "sell", status: "live",
    price: 120000, ageMonths: 20, listed: "2026-09-22",
    summary: "An App Store habit tracker moved through Apple's app transfer.",
    description: "A published iOS habit tracker with source code, moved through the App Store's own app-transfer process so ratings and the listing stay intact.",
    review: "Route documented", access: "TestFlight build after accepted enquiry",
    route: "App Store app transfer and repository", transferWindow: "10–14 days",
    includes: ["Swift source", "App Store listing via app transfer", "Design files", "Release notes"],
    works: ["Current iOS version supported", "Widgets and reminders", "Local-first storage"],
    depends: ["Apple's app-transfer eligibility must be confirmed for both accounts"],
    excluded: ["User data", "The seller's developer account itself"],
    metric: { value: "4.6", label: "App Store rating" },
    bars: [52, 58, 61, 57, 66, 70, 68, 74, 72, 79, 77, 83], sample: "app",
    specimen: { image: "detail", position: "78% center" },
  },
  {
    id: "MX-062", slug: "fernway", name: "Fernway", type: "Domain and identity", category: "domain", deal: "sell", status: "live",
    price: 54000, ageMonths: 48, listed: "2026-09-08",
    summary: "A two-syllable brandable name with a travel identity.",
    description: "A two-syllable brandable dot-com with an unused travel identity: wordmark, colour notes and a short naming rationale.",
    review: "Route documented", access: "Registrar proof after accepted enquiry",
    route: "Registrar transfer and identity files", transferWindow: "5–7 days",
    includes: ["Dot-com domain", "Wordmark masters", "Naming rationale"],
    works: ["Domain renewed through next year", "Clean ownership history"],
    depends: ["Registrar transfer lock is lifted before completion"],
    excluded: ["Any website content", "Trademark registration"],
    metric: { value: "4 yrs", label: "continuous ownership" },
    bars: [48, 48, 48, 48, 62, 62, 62, 62, 75, 75, 75, 75], sample: "domain",
    specimen: { image: "object", position: "10% center" },
  },
  {
    id: "MX-066", slug: "stackyard", name: "Stackyard", type: "Internal admin codebase", category: "code", deal: "rent", status: "rented",
    price: 9000, priceUnit: "month", ageMonths: 26, listed: "2026-08-19",
    summary: "An admin dashboard codebase, currently licensed to another team.",
    description: "An internal admin dashboard codebase with roles, audit logs and table tooling. It is currently licensed and shown for reference.",
    review: "Licence active", access: "Closed record",
    route: "Monthly source licence", transferWindow: "3 days",
    includes: ["Admin source", "Role and audit modules", "Setup guide"],
    works: ["Role-based access", "Audit log", "CSV import and export"],
    depends: ["Requires a Postgres database provided by the licensee"],
    excluded: ["Hosting", "Support beyond setup"],
    metric: { value: "31", label: "admin modules" },
    bars: [66, 62, 70, 68, 73, 71, 77, 75, 80, 78, 84, 82], sample: "code",
    specimen: { image: "detail", position: "50% center" },
  },
];

export const editionPicks = ["kite", "northstar", "relay", "atlas"];

export function getAsset(slug: string) {
  return assets.find((asset) => asset.slug === slug);
}

export function categoryOf(key: CategoryKey) {
  return categories.find((category) => category.key === key)!;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function formatPrice(asset: Pick<Asset, "price" | "priceUnit">) {
  const amount = inr.format(asset.price);
  return asset.priceUnit ? `${amount} / ${asset.priceUnit}` : amount;
}

export function formatAge(months: number) {
  if (months < 24) return `${months} months`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} years` : `${years.toFixed(1)} years`;
}

export const dealLabel: Record<DealType, string> = { sell: "Buy outright", rent: "Rent or licence" };
export const statusLabel: Record<ListingStatus, string> = { live: "Available", sold: "Sold", rented: "Rented" };

export function isAvailable(asset: Asset) {
  return asset.status === "live";
}

export function recordNumber(asset: Asset) {
  return String(assets.indexOf(asset) + 1).padStart(2, "0");
}

export function neighbours(asset: Asset) {
  const index = assets.indexOf(asset);
  return {
    previous: assets[(index - 1 + assets.length) % assets.length],
    next: assets[(index + 1) % assets.length],
  };
}

export function inkOf(key: CategoryKey) {
  return categoryOf(key).ink;
}

// Figures shown on the market page are derived from the records, never typed in.
export function marketStats() {
  const live = assets.filter(isAvailable);
  const asks = live.filter((asset) => !asset.priceUnit).map((asset) => asset.price).sort((a, b) => a - b);
  const middle = Math.floor(asks.length / 2);
  const median = asks.length % 2 ? asks[middle] : Math.round((asks[middle - 1] + asks[middle]) / 2);
  const days = live.map((asset) => Number(asset.transferWindow.match(/\d+/)?.[0] ?? 0));
  return {
    listedValue: asks.reduce((sum, price) => sum + price, 0),
    medianAsk: median,
    available: live.length,
    averageDays: Math.round(days.reduce((sum, day) => sum + day, 0) / days.length),
  };
}

export function formatLakh(value: number) {
  return value >= 100000 ? `₹${(value / 100000).toFixed(value % 100000 ? 2 : 0)}L` : inr.format(value);
}

export function similarTo(asset: Asset, count = 3) {
  const same = assets.filter((other) => other !== asset && other.category === asset.category);
  const rest = assets.filter((other) => other !== asset && other.category !== asset.category && isAvailable(other));
  return [...same, ...rest].slice(0, count);
}
