import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { Drawing } from "@/components/mayank/visuals/Drawings";

export const metadata: Metadata = { title: "Restricted assets", description: "What cannot be listed on Mayank, and how provider-dependent assets are handled." };

const outcomes = [
  { name: "Accepted", ink: "#5D6B3C", drawing: "accepted", means: "The asset can move and its ownership can be evidenced.", typical: "Products, code, domains, design systems and templates.", next: "Private review, then a published record." },
  { name: "Conditional", ink: "#8E6718", drawing: "conditional", means: "The transfer depends on a third party's permission.", typical: "App store listings, social pages, ad accounts, cloud capacity.", next: "Eligibility review; any uncertainty is stated on the record." },
  { name: "Declined", ink: "#9C3D2A", drawing: "declined", means: "Refused even when the work has commercial value.", typical: "Credentials, personal data, disputed work, locked credits.", next: "Not listed. The seller is told which rule applies." },
];

const restricted = [
  ["Personal accounts, login credentials or identity-linked profiles", "They belong to a person rather than a business, and sharing credentials usually breaks the provider's terms."],
  ["Customer databases, personal information or private communications", "The people in them never agreed to be sold. Personal data stays with the business that collected it."],
  ["Stolen, pirated or disputed intellectual property", "Ownership cannot be evidenced, so nothing about the transfer can be relied on."],
  ["Non-transferable promotional credits and subscriptions", "The provider does not allow them to move, so a sale would give the buyer nothing."],
  ["Provider-controlled accounts whose resale or transfer is prohibited", "The platform controls the account; the seller has nothing they are allowed to hand over."],
  ["Manipulated engagement metrics or infrastructure connected to illegal activity", "Inflated numbers mislead buyers, and illegal infrastructure is refused outright."],
];

const conditions = [
  ["The provider permits it", "A documented transfer route exists in the provider's own rules."],
  ["The seller has authority", "The seller controls the account or listing and can show it."],
  ["The route is recorded", "Steps, timing and who acts at each step are written on the record."],
  ["Uncertainty is stated", "Anything unconfirmed is shown to the buyer, never hidden."],
];

export default function RestrictedAssets() {
  return (
    <main id="main" tabIndex={-1} className="standards-page" style={{ "--accent": "#9C3D2A" } as CSSProperties}>
      <PageMotion />
      <section className="standards-hero" data-header-tone="light">
        <span className="label" data-rise data-scramble>Marketplace standard / 03</span>
        <h1 className="cut-title"><span><span>Value is not</span></span><span><em>enough.</em></span></h1>
        <div className="declined-stamp" data-stamp="-8" aria-hidden="true"><span>Declined</span><small>Standard 03 / Edition 01</small></div>
        <p data-rise>Mayank is for assets that can move responsibly. A record may be refused even when the work has commercial value.</p>
      </section>

      <section className="outcome-register" aria-labelledby="outcomes-title">
        <header className="standards-head" data-reveal><span className="label">Register / Outcomes</span><h2 id="outcomes-title">Three outcomes,<br /><em>one standard.</em></h2></header>
        <table>
          <thead><tr><th scope="col">Outcome</th><th scope="col">What it means</th><th scope="col">Typical assets</th><th scope="col">What happens next</th></tr></thead>
          <tbody>
            {outcomes.map((outcome) => (
              <tr key={outcome.name} style={{ "--row": outcome.ink } as CSSProperties} data-reveal>
                <th scope="row"><Drawing name={outcome.drawing} className="outcome-drawing" /><b className="outcome-stamp">{outcome.name}</b></th>
                <td data-label="What it means">{outcome.means}</td>
                <td data-label="Typical assets">{outcome.typical}</td>
                <td data-label="What happens next">{outcome.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="decline-section" aria-labelledby="decline-title">
        <header className="standards-head" data-reveal><span className="label">Decline register</span><h2 id="decline-title">What does not<br /><em>enter the archive.</em></h2></header>
        <ol className="decline-rows">
          {restricted.map(([item, reason], index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}<i className="strike" data-strike aria-hidden="true" /></strong>
              <p>{reason}</p>
              <b data-stamp="-4">Not accepted</b>
            </li>
          ))}
        </ol>
      </section>

      <section className="conditional-band" aria-labelledby="conditional-title">
        <div className="conditional-copy">
          <span className="label" data-reveal>Provider-dependent assets</span>
          <h2 id="conditional-title" data-reveal>Permission must be<br /><em>part of the route.</em></h2>
          <p data-reveal>Organisation accounts, advertising infrastructure and enterprise capacity may be considered only when the provider permits a documented transfer. Uncertainty is recorded, never hidden.</p>
          <div className="conditional-mark">
            <Drawing name="conditional" />
            <b className="conditional-stamp" data-stamp="-6">Conditional</b>
          </div>
        </div>
        <ol className="condition-list">
          {conditions.map(([title, copy], index) => <li key={title} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></li>)}
        </ol>
      </section>

      <section className="concern" aria-labelledby="concern-title">
        <div><span className="label">Report a concern</span><h2 id="concern-title">Seen something that should not be listed?</h2><p>Tell the review desk which record it is and why.</p></div>
        <div className="concern-contact"><strong>[PROFESSIONAL EMAIL]</strong><small>Placeholder. The contact route is published before launch.</small></div>
      </section>

      <section className="info-cta">
        <TransitionLink className="btn btn-accent" href="/sell">Have something that qualifies?<span>List an asset</span></TransitionLink>
        <TransitionLink className="btn btn-outline" href="/how-it-works">How review works<span>The method</span></TransitionLink>
      </section>
    </main>
  );
}
