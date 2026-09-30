// Sample dossier detail for each Edition 01 record. Like the records
// themselves, these are illustrative and do not describe real sellers.

import { moreDossiers } from "./catalogue/edition-two";

export type EvidenceStatus = "Verified" | "Provided" | "On request";

export type Dossier = {
  highlights: [string, string, string];
  series: { label: string; values: number[] };
  financials?: { revenue: string; costs: string; note: string };
  stack: string[];
  seller: { role: string; city: string; team: string };
  reason: string;
  idealBuyer: string;
  evidence: [string, EvidenceStatus][];
  faq: [string, string][];
};

const editionOneDossiers: Record<string, Dossier> = {
  kite: {
    highlights: ["1,284 active accounts", "Stripe billing import built in", "21-day founder handover"],
    series: { label: "Active accounts, last 12 months", values: [612, 688, 704, 790, 812, 905, 988, 1010, 1102, 1150, 1231, 1284] },
    financials: { revenue: "₹38,000 to ₹44,000 / month", costs: "₹9,500 / month", note: "Revenue from 61 paying workspaces; the buyer rebuilds billing under their own account." },
    stack: ["Next.js", "TypeScript", "Postgres", "ClickHouse", "Stripe"],
    seller: { role: "Two-person founding team", city: "Bengaluru", team: "2 people, both staying for the handover" },
    reason: "The founders are joining a larger company and want the product to keep running for its current users.",
    idealBuyer: "A SaaS studio or analytics company that already sells to subscription businesses.",
    evidence: [["Repository history (3,412 commits)", "Verified"], ["Deployment and runbook notes", "Verified"], ["Stripe revenue export", "Provided"], ["Customer contract terms", "On request"]],
    faq: [["Do existing customers move with the product?", "No. Customer accounts and data stay with the seller; the buyer relaunches with the product and may invite customers directly."], ["What does the handover cover?", "Twenty-one days of calls and written answers on architecture, deployment and the billing import."]],
  },
  northstar: {
    highlights: ["Short, pronounceable dot-com", "14 editable identity masters", "Clean three-year history"],
    series: { label: "Monthly type-in visits", values: [210, 190, 236, 248, 230, 262, 281, 270, 295, 312, 306, 330] },
    stack: ["Registrar transfer", "Figma masters", "Variable wordmark"],
    seller: { role: "Independent brand studio", city: "Mumbai", team: "Studio of 4" },
    reason: "The name was reserved for a product the studio decided not to launch.",
    idealBuyer: "A founder naming a navigation, travel or guidance product before launch.",
    evidence: [["Registrar ownership record", "Verified"], ["Renewal receipt through next year", "Verified"], ["Identity master files", "Provided"]],
    faq: [["Is a trademark included?", "No. The name has not been registered as a trademark; the buyer should run their own clearance."], ["How long does the transfer take?", "Usually five to seven days once the transfer lock is lifted and the buyer's registrar accepts it."]],
  },
  relay: {
    highlights: ["126 production components", "Light and dark token sets", "Exclusive yearly licence"],
    series: { label: "Components shipped, cumulative", values: [30, 41, 52, 60, 71, 79, 88, 96, 104, 112, 120, 126] },
    financials: { revenue: "Licence fee only", costs: "None to the licensee", note: "The licence is exclusive for its term: no other company can license Relay during that year." },
    stack: ["Figma", "React", "TypeScript", "CSS variables", "Storybook"],
    seller: { role: "Design lead, product agency", city: "Hyderabad", team: "Agency of 12" },
    reason: "Built for a client product that was paused; the agency keeps ownership and licenses it.",
    idealBuyer: "A product team that needs a mature component library without building one from scratch.",
    evidence: [["Figma library with version history", "Verified"], ["React package source", "Verified"], ["Font and icon licence notes", "Provided"]],
    faq: [["Can the licence be renewed?", "Yes, at the same terms for up to two further years if both parties agree."], ["Is source code included?", "Yes, the React implementation for 84 components is part of the licence."]],
  },
  atlas: {
    highlights: ["2.7 million indexed help words", "Draft, review and publish workflow", "30 days of founder support"],
    series: { label: "Help articles published", values: [120, 164, 210, 268, 301, 356, 402, 455, 498, 540, 587, 621] },
    financials: { revenue: "₹61,000 to ₹70,000 / month", costs: "₹14,000 / month", note: "Revenue from nine annual contracts that end with the current seller." },
    stack: ["Remix", "TypeScript", "Postgres", "Meilisearch", "S3"],
    seller: { role: "Solo founder", city: "Pune", team: "1 person, contractor support" },
    reason: "The founder is moving to a full-time role and wants a buyer who will keep developing it.",
    idealBuyer: "A customer-support software company adding a knowledge-base product.",
    evidence: [["Repository and release tags", "Verified"], ["Operator handbook", "Verified"], ["Search infrastructure invoices", "Provided"], ["Contract summaries", "On request"]],
    faq: [["Does the search index transfer?", "The index is rebuilt on the buyer's infrastructure from the documented scripts; it takes about an hour."], ["What happens to the current contracts?", "They end with the seller. The buyer receives the product, not the customers."]],
  },
  ledgerline: {
    highlights: ["GST-ready invoice and credit-note API", "TypeScript and Python SDKs", "412 passing tests"],
    series: { label: "API requests per month, thousands", values: [48, 52, 61, 58, 72, 80, 77, 91, 99, 108, 114, 121] },
    financials: { revenue: "₹22,000 / month", costs: "₹6,000 / month", note: "From 14 paying API keys that are retired at transfer." },
    stack: ["Go", "Postgres", "TypeScript SDK", "Python SDK", "OpenAPI"],
    seller: { role: "Fintech engineering team", city: "Gurugram", team: "3 engineers" },
    reason: "The parent company is consolidating onto a single billing platform.",
    idealBuyer: "An accounting or billing product that wants a proven Indian tax-invoice layer.",
    evidence: [["Repository history", "Verified"], ["Test coverage report", "Verified"], ["Package registry ownership", "Provided"]],
    faq: [["Are the SDK package names included?", "Yes, ownership of both packages moves with the repository."], ["Is the API compliant with current GST rules?", "It follows the rules current at listing; the buyer should confirm compliance before production use."]],
  },
  paperplane: {
    highlights: ["Nine launch and pricing pages", "Responsive from 360px up", "Non-exclusive yearly licence"],
    series: { label: "Active licences", values: [3, 5, 6, 8, 11, 12, 15, 17, 19, 22, 24, 27] },
    stack: ["Next.js", "CSS modules", "MDX content"],
    seller: { role: "Freelance designer", city: "Kochi", team: "1 person" },
    reason: "Built for the designer's own launches and offered to other founders on a licence.",
    idealBuyer: "An early-stage team that needs a considered launch site within a week.",
    evidence: [["Live preview of all nine pages", "Verified"], ["Licence terms", "Provided"]],
    faq: [["Can I use it for more than one company?", "Each licence covers one company for one year."], ["Are images included?", "No. Stock imagery is placeholder only and must be replaced."]],
  },
  tessellate: {
    highlights: ["38 chart components", "Colour-blind safe palettes", "Transferred in 12 days"],
    series: { label: "Components shipped, cumulative", values: [6, 9, 13, 16, 19, 22, 25, 28, 31, 34, 36, 38] },
    stack: ["Figma", "React", "D3", "TypeScript"],
    seller: { role: "Data-product designer", city: "Chennai", team: "1 person" },
    reason: "Sold with full assignment of design and code.",
    idealBuyer: "Closed. Shown as a reference for how a completed transfer is recorded.",
    evidence: [["Assignment agreement", "Verified"], ["Handover confirmation", "Verified"]],
    faq: [["Can I still enquire?", "Yes. Ask about similar assets and the review desk will reply when a comparable kit is listed."]],
  },
  tidewater: {
    highlights: ["4.6 App Store rating kept", "Moves by Apple's own app transfer", "Widgets and reminders"],
    series: { label: "Monthly active users", values: [3100, 3240, 3380, 3300, 3560, 3710, 3690, 3920, 3880, 4100, 4060, 4290] },
    financials: { revenue: "₹27,000 to ₹31,000 / month", costs: "₹2,500 / month", note: "In-app subscription revenue; the subscription listing moves with the app." },
    stack: ["Swift", "SwiftUI", "WidgetKit", "CloudKit"],
    seller: { role: "Indie developer", city: "Jaipur", team: "1 person" },
    reason: "The developer is focusing on a new app and wants Tidewater maintained.",
    idealBuyer: "An indie studio with an existing iOS portfolio and an Apple developer account.",
    evidence: [["App Store Connect ownership", "Verified"], ["Swift source", "Verified"], ["Subscription revenue export", "Provided"], ["App transfer eligibility check", "On request"]],
    faq: [["Do ratings and reviews move?", "Yes. Apple's app transfer keeps the listing, ratings and reviews intact."], ["What about user data?", "User data stays on users' devices and in their own iCloud; nothing personal transfers."]],
  },
  fernway: {
    highlights: ["Two-syllable brandable dot-com", "Four years of continuous ownership", "Unused travel identity"],
    series: { label: "Monthly type-in visits", values: [140, 150, 148, 160, 171, 168, 180, 176, 190, 198, 205, 212] },
    stack: ["Registrar transfer", "Wordmark masters"],
    seller: { role: "Former travel founder", city: "Goa", team: "1 person" },
    reason: "The travel product it was reserved for never launched.",
    idealBuyer: "A travel, outdoors or hospitality brand at the naming stage.",
    evidence: [["Registrar ownership record", "Verified"], ["Wordmark files", "Provided"]],
    faq: [["Is there any existing website?", "No. The domain has only ever shown a holding page."]],
  },
  stackyard: {
    highlights: ["Role-based access and audit log", "31 admin modules", "Currently licensed"],
    series: { label: "Admin modules, cumulative", values: [8, 11, 13, 15, 18, 20, 22, 24, 26, 28, 30, 31] },
    stack: ["Next.js", "tRPC", "Prisma", "Postgres"],
    seller: { role: "Internal tools team", city: "Noida", team: "Team of 5" },
    reason: "Licensed monthly to teams who need an admin panel quickly.",
    idealBuyer: "Currently rented. Shown as a reference for how an active licence is recorded.",
    evidence: [["Licence agreement template", "Verified"], ["Setup guide", "Provided"]],
    faq: [["When will it be available again?", "When the current licence ends. Ask to be told and the review desk will write to you."]],
  },
};

export const dossiers: Record<string, Dossier> = { ...editionOneDossiers, ...moreDossiers };

export function getDossier(slug: string): Dossier {
  return dossiers[slug];
}
