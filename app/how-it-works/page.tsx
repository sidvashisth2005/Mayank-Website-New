import type { Metadata } from "next";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { TrackToggle } from "@/components/mayank/TrackToggle";

export const metadata: Metadata = {
  title: "How it works",
  description: "How Mayank reviews, presents and transfers startup-built digital assets, for buyers and for sellers.",
};

const review = [
  ["01 / Seller", "Identity is checked privately.", "Public listings can protect personal details while Mayank verifies who is behind the asset."],
  ["02 / Rights", "Ownership needs evidence.", "Repository history, source files, registrar records or original working files support the claim."],
  ["03 / Reality", "Condition is written down.", "What works, what depends on a provider and what is missing remain visible to the buyer."],
  ["04 / Route", "Transfer must be plausible.", "Provider rules, expected duration, access steps and the support window shape the handover."],
];

const restricted = [
  "Personal accounts, login credentials or identity-linked profiles",
  "Customer databases, personal information or private communications",
  "Stolen, pirated or disputed intellectual property",
  "Non-transferable promotional credits and subscriptions",
];

const questions = [
  ["Is Mayank the seller?", "No. Mayank curates records and introduces asset owners to prospective buyers or licensees. Unless a record explicitly says otherwise, Mayank is not the buyer, seller, escrow provider or legal adviser."],
  ["Does review guarantee an asset?", "Review improves clarity but is not a guarantee of ownership, value, performance, legality or transferability. Each party remains responsible for its own legal, financial and technical diligence."],
  ["Can I list social pages, ad accounts or cloud credits?", "Only when the provider permits a documented transfer. Provider-dependent assets go through a separate eligibility review, and uncertainty is recorded on the listing rather than hidden."],
  ["Who sees my contact details?", "Only the review desk. Seller contact details and private evidence never appear on a public record, and are shared only after an enquiry is accepted."],
  ["Are the current listings real?", "Not yet. Edition 01 records are samples that show how an asset is presented while Mayank prepares for launch. Enquiries and listings you submit are delivered to the review desk."],
  ["What happens after I submit a listing?", "It enters private review. Nothing is published automatically, and you will hear from the review desk by your chosen contact method if anything needs clarifying."],
];

export default function HowItWorksPage() {
  return (
    <main id="main" tabIndex={-1} className="info-page">
      <PageMotion />
      <section className="page-hero info-hero">
        <div className="page-hero-copy">
          <span className="label" data-rise>Method / How it works</span>
          <h1 className="cut-title"><span><span>Clarity before access.</span></span><span><em>Agreement before transfer.</em></span></h1>
          <p data-rise>Mayank turns a useful digital asset into an inspectable record, reviews it privately, and gives both sides a documented route for the handover.</p>
        </div>
      </section>

      <section className="info-section info-tracks" aria-labelledby="tracks-title">
        <header data-reveal><span className="label">01 / Two tracks</span><h2 id="tracks-title">Choose your side of the exchange.</h2></header>
        <div data-reveal><TrackToggle /></div>
      </section>

      <section className="info-section info-review" id="review" aria-labelledby="review-title">
        <header data-reveal><span className="label">02 / Review standard</span><h2 id="review-title">What Mayank checks before a record goes live.</h2></header>
        <div className="review-matrix">
          {review.map(([tag, title, copy]) => <article className="review-point" key={tag} data-reveal><span>{tag}</span><strong>{title}</strong><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="info-section info-restricted" aria-labelledby="restricted-title">
        <header data-reveal><span className="label">03 / Boundaries</span><h2 id="restricted-title">Value is not enough.</h2><p>Some things never enter the index, however commercially useful they are.</p></header>
        <ol className="decline-list">
          {restricted.map((item, index) => <li key={item} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}
        </ol>
        <TransitionLink className="text-link" href="/restricted-assets" data-reveal>Read the full restricted-assets standard</TransitionLink>
      </section>

      <section className="info-section info-faq" aria-labelledby="faq-title">
        <header data-reveal><span className="label">04 / Questions</span><h2 id="faq-title">Plain answers.</h2></header>
        <div className="faq-list">
          {questions.map(([question, answer]) => (
            <details key={question} data-reveal>
              <summary><span>{question}</span><i aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="info-cta">
        <TransitionLink className="btn btn-solid" href="/market">Browse the market<span>Buyer</span></TransitionLink>
        <TransitionLink className="btn btn-outline" href="/sell">List an asset<span>Seller</span></TransitionLink>
      </section>
    </main>
  );
}
