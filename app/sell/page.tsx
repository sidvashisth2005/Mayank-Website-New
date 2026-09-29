import type { Metadata } from "next";
import { ListingWizard } from "@/components/mayank/ListingWizard";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";

export const metadata: Metadata = {
  title: "List an asset",
  description: "Submit a startup-built product, codebase, domain, design system or template to sell or rent. Every listing is privately reviewed before publication.",
};

const needs = [
  ["What it is", "A name, the closest category and a plain description of its current state."],
  ["Your terms", "Sell or rent, an asking price in INR and the age of the asset."],
  ["Evidence", "What works today, useful metrics and how transfer-ready it is."],
  ["Up to four images", "Screenshots or files that show the real work. A video link is optional."],
];

export default function SellPage() {
  return (
    <main id="main" tabIndex={-1} className="sell-page">
      <PageMotion />
      <section className="page-hero sell-hero">
        <div className="page-hero-copy">
          <span className="label" data-rise>Sell / Private listing</span>
          <h1 className="cut-title"><span><span>Put the work</span></span><span><em>back to work.</em></span></h1>
          <p data-rise>Tell us what exists and how it can move. Ownership and transfer eligibility are reviewed privately before anything appears in the market.</p>
          <div className="pill-row" data-rise><span>Sell or rent</span><span>Private review first</span><span>Nothing publishes automatically</span></div>
        </div>
        <aside className="sell-needs" data-rise>
          <span className="label">What you will need</span>
          <ol>{needs.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></li>)}</ol>
          <p className="sell-needs-note">Some assets cannot be listed at all. Read the <TransitionLink href="/restricted-assets">restricted assets standard</TransitionLink> first.</p>
        </aside>
      </section>
      <section className="sell-stage" aria-label="Listing form">
        <ListingWizard />
      </section>
    </main>
  );
}
