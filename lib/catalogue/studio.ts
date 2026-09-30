// How each sample product is drawn in the image studio. Every product gets its
// own interface type and brand so the screenshots read as different products.

export type SceneKind = "dashboard" | "portal" | "mobile" | "identity" | "components" | "code" | "landing" | "editor" | "editorial" | "docs" | "store" | "extension";

export type Brand = {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
  font: "sans" | "serif" | "mono";
  dark?: boolean;
};

export type StudioEntry = { kind: SceneKind; brand: Brand; tagline: string; views: [string, string, string] };

const light = (accent: string, accent2: string, font: Brand["font"] = "sans", bg = "#f6f6f3"): Brand => ({ bg, surface: "#ffffff", ink: "#18191b", muted: "#6b6e73", accent, accent2, font });
const dark = (accent: string, accent2: string, font: Brand["font"] = "sans", bg = "#121417"): Brand => ({ bg, surface: "#1b1e23", ink: "#eceef1", muted: "#8b9099", accent, accent2, font, dark: true });

export const studio: Record<string, StudioEntry> = {
  kite: { kind: "dashboard", brand: light("#3056d3", "#8aa4f0"), tagline: "Revenue analytics for subscription teams", views: ["Revenue overview", "Cohort table", "Mobile summary"] },
  northstar: { kind: "identity", brand: { bg: "#10213a", surface: "#f4efe4", ink: "#10213a", muted: "#6b7a90", accent: "#d9a441", accent2: "#f4efe4", font: "serif" }, tagline: "Find your bearing", views: ["Identity board", "Stationery", "Holding page"] },
  relay: { kind: "components", brand: light("#4b47c9", "#b9b7f2"), tagline: "Relay design system", views: ["Component sheet", "Design tokens", "States"] },
  atlas: { kind: "portal", brand: light("#0f766e", "#99d5cf", "sans", "#f3f7f6"), tagline: "How can we help?", views: ["Help centre", "Article", "Mobile search"] },
  ledgerline: { kind: "code", brand: dark("#f0b429", "#62b6cb", "mono"), tagline: "GST-ready invoicing API", views: ["Editor", "API reference", "Test run"] },
  paperplane: { kind: "landing", brand: light("#e2562b", "#f4c9b8", "sans", "#fbf7f2"), tagline: "Launch next week, not next quarter", views: ["Launch page", "Pricing page", "Mobile"] },
  tessellate: { kind: "components", brand: dark("#7dd3a8", "#f0a868"), tagline: "Tessellate chart kit", views: ["Chart sheet", "Palettes", "Dashboard layout"] },
  tidewater: { kind: "mobile", brand: { bg: "#dff1ef", surface: "#ffffff", ink: "#12302d", muted: "#5b7773", accent: "#1f8a7d", accent2: "#f2b84b", font: "sans" }, tagline: "Small habits, steady tides", views: ["Today", "Streaks", "Widgets"] },
  fernway: { kind: "identity", brand: { bg: "#23372b", surface: "#efe9dc", ink: "#23372b", muted: "#6c7d6f", accent: "#c98b4b", accent2: "#efe9dc", font: "serif" }, tagline: "Go further, slowly", views: ["Identity board", "Stationery", "Holding page"] },
  stackyard: { kind: "dashboard", brand: dark("#8b7cf6", "#5eead4"), tagline: "Internal admin", views: ["Users table", "Audit log", "Mobile"] },
  quorum: { kind: "dashboard", brand: light("#2563eb", "#f59e0b", "sans", "#f5f6fa"), tagline: "Meetings, routed fairly", views: ["Team calendar", "Routing rules", "Booking page"] },
  parcelboard: { kind: "dashboard", brand: light("#ea580c", "#0ea5e9", "sans", "#f7f5f2"), tagline: "Every parcel, one view", views: ["Shipments", "Delays", "Tracking page"] },
  "tally-desk": { kind: "dashboard", brand: light("#16a34a", "#0f172a", "sans", "#f4f6f3"), tagline: "Books done by Friday", views: ["Invoices", "GST summary", "Receipt capture"] },
  signalkit: { kind: "code", brand: dark("#22d3ee", "#f472b6", "mono"), tagline: "Ship behind a flag", views: ["Flags console", "SDK snippet", "Rollout"] },
  inkwell: { kind: "editor", brand: light("#1f2937", "#d97706", "serif", "#faf8f3"), tagline: "Write in Markdown, publish anywhere", views: ["Editor", "Content list", "Publish log"] },
  brightline: { kind: "identity", brand: { bg: "#0b1f4b", surface: "#f5f7fb", ink: "#0b1f4b", muted: "#62708f", accent: "#3dd6a3", accent2: "#f5f7fb", font: "sans" }, tagline: "Money, in a straight line", views: ["Identity board", "Card and app icon", "Holding page"] },
  tamarind: { kind: "identity", brand: { bg: "#5a2a1b", surface: "#f6ead8", ink: "#5a2a1b", muted: "#8a6a58", accent: "#e59a3a", accent2: "#f6ead8", font: "serif" }, tagline: "Sour, sweet, home", views: ["Identity board", "Label system", "Holding page"] },
  "mono-grid": { kind: "editorial", brand: light("#b91c1c", "#111111", "serif", "#fbfaf7"), tagline: "The long read", views: ["Article layout", "Grid overlay", "Mobile article"] },
  fieldnotes: { kind: "components", brand: light("#0d9488", "#f97316", "sans", "#f5f7f6"), tagline: "Fieldnotes forms", views: ["Form components", "Validation states", "Checkout form"] },
  "ledger-docs": { kind: "docs", brand: light("#7c3aed", "#0ea5e9", "sans", "#fafafa"), tagline: "Documentation that ships", views: ["Docs home", "API reference", "Search"] },
  shopfront: { kind: "store", brand: light("#1c1917", "#c2410c", "serif", "#f7f3ee"), tagline: "Made slowly, worn daily", views: ["Product page", "Collection", "Mobile cart"] },
  "pantry-pal": { kind: "mobile", brand: { bg: "#fdecc8", surface: "#ffffff", ink: "#2b2118", muted: "#7c6a58", accent: "#e76f2e", accent2: "#3f8f5a", font: "sans" }, tagline: "The list the whole house shares", views: ["Shared list", "Household", "Scan"] },
  "studio-calm": { kind: "extension", brand: light("#6d5bd0", "#f2c14e", "sans", "#eef0f4"), tagline: "Twenty-five quiet minutes", views: ["Focus timer", "Weekly report", "Blocked site"] },
  tabletop: { kind: "store", brand: light("#7c2d12", "#15803d", "sans", "#f8f4ef"), tagline: "Book a table, order ahead", views: ["Reservations", "Menu pre-order", "Mobile booking"] },
};
