// Sample testimonials and reviews for Edition 01. None of these people exist:
// every entry is written to show how Mayank presents feedback, and each one is
// labelled "Sample" wherever it appears. Published real entries from the
// database replace them automatically (see lib/server/voices.ts).

export type Testimonial = { quote: string; name: string; role: string; city: string; track: "seller" | "buyer" };

export const sampleTestimonials: Testimonial[] = [
  {
    quote: "We shut the company in March and the analytics product was the part I could not bear to archive. The review desk asked for the repository history and our Stripe export before anything else. That was the moment I trusted the process.",
    name: "Ananya R.", role: "Former founder, subscription analytics", city: "Bengaluru", track: "seller",
  },
  {
    quote: "I bought a support portal for a client instead of building one. The condition ledger listed two broken integrations up front, so the price made sense and nothing surprised us in week one.",
    name: "Karthik M.", role: "Agency owner", city: "Chennai", track: "buyer",
  },
  {
    quote: "The domain had been parked for three years. Listing it took one evening, and the desk sent back a single question about the registrar lock before it went live.",
    name: "Meera S.", role: "Product designer", city: "Pune", track: "seller",
  },
  {
    quote: "Licensing the design system per year suited us better than buying it. The record said exactly which components were in scope and which fonts we had to license ourselves.",
    name: "Rohan D.", role: "Head of design, fintech", city: "Mumbai", track: "buyer",
  },
  {
    quote: "Nobody saw my contact details until an enquiry was accepted. For a solo founder that matters more than any feature.",
    name: "Farah K.", role: "Indie developer", city: "Hyderabad", track: "seller",
  },
  {
    quote: "We compared three admin codebases on the index by condition, not by screenshots. The one we rented had the shortest dependency list, and the handover took nine days.",
    name: "Vikram P.", role: "CTO, logistics startup", city: "Gurugram", track: "buyer",
  },
];

export type Review = { rating: 1 | 2 | 3 | 4 | 5; title: string; body: string; name: string; role: string; date: string; verified: boolean };

// Only records a buyer could have used carry reviews: active licences and
// closed transfers.
export const sampleReviews: Record<string, Review[]> = {
  relay: [
    { rating: 5, title: "Tokens were clean on day one", body: "We mapped Relay's tokens onto our brand in an afternoon. Focus states and the disabled palette were already accessible, which saved a full audit cycle.", name: "Nikhil J.", role: "Design lead", date: "2026-08-14", verified: true },
    { rating: 4, title: "Solid, docs could be deeper", body: "Components are well built. The usage notes for the data table are thin, so we wrote our own guidance for the team.", name: "Priya V.", role: "Frontend engineer", date: "2026-07-02", verified: true },
    { rating: 5, title: "Renewed for a second year", body: "The licence terms were exactly as listed. Renewal was one email to the review desk.", name: "Sahil G.", role: "Founder", date: "2026-05-21", verified: true },
  ],
  paperplane: [
    { rating: 4, title: "Fast launch page", body: "We shipped a waitlist page in two days. The hero variants are the strongest part; the pricing section needed rework for INR.", name: "Tanvi B.", role: "Growth marketer", date: "2026-08-29", verified: true },
    { rating: 3, title: "Good base, dated animations", body: "Layout and type are good. We removed most of the scroll effects because they slowed the page on older Android phones.", name: "Arjun K.", role: "Developer", date: "2026-06-11", verified: true },
  ],
  "tally-desk": [
    { rating: 5, title: "GST invoices worked immediately", body: "The invoice templates already handled GST breakdowns. We onboarded twelve freelancers in the first month on the licence.", name: "Lakshmi N.", role: "Operations manager", date: "2026-09-03", verified: true },
    { rating: 4, title: "Reliable, small gaps", body: "Bank reconciliation is basic. Everything else matched the record, including the export formats.", name: "Deepak R.", role: "Chartered accountant", date: "2026-07-19", verified: true },
  ],
  "mono-grid": [
    { rating: 5, title: "The grid our editors wanted", body: "Long reads finally look intentional. The baseline grid held up across Hindi and English body text, which we did not expect.", name: "Ishita C.", role: "Editor, digital magazine", date: "2026-08-08", verified: true },
    { rating: 4, title: "Worth the yearly licence", body: "Excellent print-style layouts. You will need your own image cropping rules; the kit does not include them.", name: "Manav T.", role: "Art director", date: "2026-06-25", verified: true },
  ],
  "ledger-docs": [
    { rating: 4, title: "Search is the best feature", body: "Versioned docs with search out of the box. Setting up the API reference pages took longer than the record suggested.", name: "Rahul S.", role: "Developer advocate", date: "2026-09-10", verified: true },
    { rating: 5, title: "Moved our docs in a week", body: "The version switcher alone justified the licence. Support during the first thirty days was responsive.", name: "Neha A.", role: "Engineering manager", date: "2026-07-30", verified: true },
  ],
  tessellate: [
    { rating: 5, title: "Charts that look designed", body: "Every chart type came with light and dark variants and sensible defaults. The Figma file and the code matched, which is rare.", name: "Aditya L.", role: "Product designer", date: "2026-08-02", verified: true },
    { rating: 4, title: "Transfer was smooth", body: "Files arrived within the stated window. We had to replace one icon set that was licensed separately, as the exclusions said.", name: "Sneha P.", role: "Founder, BI startup", date: "2026-07-12", verified: true },
    { rating: 5, title: "Paid for itself", body: "We cancelled a charting library subscription after moving to Tessellate. Clean handover notes.", name: "Omkar W.", role: "CTO", date: "2026-06-18", verified: true },
  ],
  stackyard: [
    { rating: 4, title: "Saved two months of admin work", body: "Role management and audit logs were production ready. The deployment scripts assumed an older Node version, which took a day to fix.", name: "Harsh V.", role: "Backend engineer", date: "2026-08-21", verified: true },
    { rating: 5, title: "Exactly what was described", body: "The condition ledger was accurate down to the failing test it mentioned. Handover call with the seller answered everything else.", name: "Kavya M.", role: "Tech lead", date: "2026-07-07", verified: true },
  ],
  tabletop: [
    { rating: 4, title: "Restaurants liked it", body: "Menu sync with Shopify worked for our pilot outlets. Provider approval for the app transfer took eleven days, as the record warned.", name: "Siddharth G.", role: "Operator, F&B group", date: "2026-08-17", verified: true },
    { rating: 3, title: "Needs a table-map update", body: "Ordering and payments are fine. The table layout editor is dated and struggled with larger floors.", name: "Pooja I.", role: "Product manager", date: "2026-06-30", verified: true },
  ],
};
