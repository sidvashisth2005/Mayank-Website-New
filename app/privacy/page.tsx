import Link from "next/link";

const boundaries = [
  ["Submitted", "Professional contact details, listing information, ownership evidence and buyer access requests may be received for review."],
  ["Public", "Only information needed to evaluate an asset should appear in its public record. Seller contact details and private evidence stay out."],
  ["Protected", "Credentials, customer data, private documents and identity material must not be exposed through a public listing."],
  ["Retained", "Production retention periods and deletion controls must be defined before Mayank begins collecting live marketplace data."],
];

export default function Privacy() {
  return <main className="policy-page policy-privacy">
    <header className="topbar"><Link className="wordmark" href="/">MAYANK</Link><nav><Link href="/#market">Exchange</Link><Link href="/terms">Terms</Link></nav><Link className="header-cta" href="/">Back to site</Link></header>
    <section className="privacy-stage"><div className="privacy-orbit" aria-hidden="true"><i/><i/><i/><span>PRIVATE<br/>BY DESIGN</span></div><div className="privacy-title"><span>Information boundary / 02</span><h1>Private<br/><em>until needed.</em></h1><p>A public record should explain the asset—not expose the person or evidence behind it.</p></div></section>
    <section className="privacy-boundaries">{boundaries.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="privacy-note"><span>Draft status</span><p>This policy is a working product standard, not final legal advice. Final language, retention periods and grievance details require professional review before production collection begins.</p><div><span>Privacy contact</span><strong>[PROFESSIONAL EMAIL]</strong><span>Grievance contact</span><strong>[GRIEVANCE OFFICER]</strong></div></section>
  </main>;
}
