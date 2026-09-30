import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { TrackToggle } from "@/components/mayank/TrackToggle";
import { Drawing } from "@/components/mayank/visuals/Drawings";
import { assets, isAvailable } from "@/lib/assets";
import { dossiers } from "@/lib/dossiers";
import { Testimonials } from "@/components/mayank/Testimonials";
import { testimonialsToShow } from "@/lib/server/voices";

export const metadata: Metadata = {
  title: "How it works",
  description: "How Mayank reviews, presents and transfers startup-built digital assets, for buyers and for sellers.",
};

const stations = [
  ["asset", "Listed", "The seller describes what exists."],
  ["review", "Reviewed", "Identity, rights, condition, route."],
  ["publish", "Published", "The record enters the index."],
  ["contact", "Enquired", "A buyer writes privately."],
  ["provider", "Transferred", "The asset moves by its route."],
];

const reviewDrawings = ["identity", "ownership", "condition", "route"];

const review = [
  ["01 / Seller", "Identity is checked privately.", "Public listings can protect personal details while Mayank verifies who is behind the asset."],
  ["02 / Rights", "Ownership needs evidence.", "Repository history, source files, registrar records or original working files support the claim."],
  ["03 / Reality", "Condition is written down.", "What works, what depends on a provider and what is missing remain visible to the buyer."],
  ["04 / Route", "Transfer must be plausible.", "Provider rules, expected duration, access steps and the support window shape the handover."],
];

const questions = [
  ["Is Mayank the seller?", "No. Mayank curates records and introduces asset owners to prospective buyers or licensees. Unless a record explicitly says otherwise, Mayank is not the buyer, seller, escrow provider or legal adviser."],
  ["Does review guarantee an asset?", "Review improves clarity but is not a guarantee of ownership, value, performance, legality or transferability. Each party remains responsible for its own legal, financial and technical diligence."],
  ["Can I list social pages, ad accounts or cloud credits?", "Only when the provider permits a documented transfer. Provider-dependent assets go through a separate eligibility review, and uncertainty is recorded on the listing rather than hidden."],
  ["Who sees my contact details?", "Only the review desk. Seller contact details and private evidence never appear on a public record, and are shared only after an enquiry is accepted."],
  ["Are the current listings real?", "Not yet. Edition 01 records are samples that show how an asset is presented while Mayank prepares for launch. Enquiries and listings you submit are delivered to the review desk."],
  ["What happens after I submit a listing?", "It enters private review. Nothing is published automatically, and you will hear from the review desk by your chosen contact method if anything needs clarifying."],
];

// Figures on this sheet are read from the edition, never typed in.
function editionFigures() {
  const days = assets.filter(isAvailable).map((asset) => Number(asset.transferWindow.match(/\d+/)?.[0] ?? 0));
  const evidence = Object.values(dossiers).flatMap((dossier) => dossier.evidence);
  return {
    shortest: Math.min(...days),
    average: Math.round(days.reduce((sum, day) => sum + day, 0) / days.length),
    longest: Math.max(...days),
    verified: evidence.filter(([, status]) => status === "Verified").length,
    evidence: evidence.length,
  };
}

export const revalidate = 300;

export default async function HowItWorksPage() {
  const voices = await testimonialsToShow();
  const figures = editionFigures();
  return (
    <main id="main" tabIndex={-1} className="method-page" style={{ "--accent": "#3E5566" } as CSSProperties}>
      <PageMotion />
      <section className="method-hero">
        <i className="sheet-corner is-tl" aria-hidden="true" /><i className="sheet-corner is-tr" aria-hidden="true" /><i className="sheet-corner is-bl" aria-hidden="true" /><i className="sheet-corner is-br" aria-hidden="true" />
        <div className="method-hero-copy">
          <span className="label" data-rise data-scramble>Method / How it works</span>
          <h1 className="cut-title"><span><span>Clarity before access.</span></span><span><em>Agreement before transfer.</em></span></h1>
          <p data-rise>Mayank turns a useful digital asset into an inspectable record, reviews it privately, and gives both sides a documented route for the handover.</p>
        </div>
        <table className="title-block" data-rise>
          <caption>Title block</caption>
          <tbody>
            <tr><th scope="row">Sheet</th><td>01 / Method</td></tr>
            <tr><th scope="row">Drawn for</th><td>Buyers and sellers</td></tr>
            <tr><th scope="row">Scale</th><td>One record</td></tr>
            <tr><th scope="row">Revision</th><td>Edition 01</td></tr>
            <tr><th scope="row">On file</th><td>{assets.length} records</td></tr>
            <tr><th scope="row">Transfer windows</th><td><span data-count={figures.shortest}>{figures.shortest}</span> to <span data-count={figures.longest}>{figures.longest}</span> days, average <span data-count={figures.average}>{figures.average}</span></td></tr>
            <tr><th scope="row">Evidence verified</th><td><span data-count={figures.verified}>{figures.verified}</span> of {figures.evidence} items</td></tr>
          </tbody>
        </table>
        <ol className="route-diagram" aria-label="The route of a record">
          <i className="route-diagram-line" data-rule aria-hidden="true" />
          {stations.map(([drawing, title, copy], index) => (
            <li key={title}>
              <Drawing name={drawing} className="station-drawing" />
              <b className="station-node" aria-hidden="true" />
              <span className="station-label" data-scramble>{String(index + 1).padStart(2, "0")} / {title}</span>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="info-section info-tracks sheet" aria-labelledby="tracks-title">
        <header data-reveal><span className="label sheet-label">Sheet 02 / Two tracks</span><h2 id="tracks-title">Choose your side of the exchange.</h2></header>
        <div data-reveal><TrackToggle /></div>
      </section>

      <section className="info-section info-review sheet" id="review" aria-labelledby="review-title" data-header-tone="light">
        <header data-reveal><span className="label sheet-label">Sheet 03 / Review standard</span><h2 id="review-title">What Mayank checks before a record goes live.</h2></header>
        <div className="review-matrix">
          {review.map(([tag, title, copy], index) => <article className="review-point" key={tag} data-reveal><span>{tag}</span><Drawing name={reviewDrawings[index]} className="review-drawing" /><strong>{title}</strong><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="info-section method-boundaries sheet" aria-labelledby="restricted-title">
        <header data-reveal><span className="label sheet-label">Sheet 04 / Boundaries</span><h2 id="restricted-title">Value is not enough.</h2><p>Some things never enter the index, however commercially useful they are. The full standard lists what is declined and what is accepted only with the provider&apos;s permission.</p></header>
        <TransitionLink className="standards-teaser" href="/restricted-assets" data-reveal>
          <Drawing name="declined" />
          <span><strong>Read the decline register</strong><small>Six refusals, one conditional route</small></span>
          <em>Standard 03</em>
        </TransitionLink>
      </section>

      <section className="info-section info-faq sheet" aria-labelledby="faq-title">
        <header data-reveal><span className="label sheet-label">Sheet 05 / Questions</span><h2 id="faq-title">Plain answers.</h2></header>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question} data-reveal>
              <summary><span>{question}</span><i aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Testimonials items={voices} index="Voices / Both tracks" title={<>How it went,<br /><em>on the record.</em></>} lead="Sellers on the review, buyers on the handover. Published after moderation." />

      <section className="info-cta">
        <TransitionLink className="btn btn-accent" href="/market">Browse the market<span>Buyer</span></TransitionLink>
        <TransitionLink className="btn btn-outline" href="/sell">List an asset<span>Seller</span></TransitionLink>
      </section>
    </main>
  );
}
