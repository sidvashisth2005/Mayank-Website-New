import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of continuity", description: "The rules behind a marketplace built to move useful digital work responsibly." };

const clauses = [
  ["01", "Marketplace role", "Mayank curates records and introduces asset owners to prospective buyers or licensees. Review improves clarity, but is not a guarantee of ownership, value, performance, legality or transferability."],
  ["02", "Listing obligations", "Sellers must describe the asset accurately, disclose dependencies and exclusions, and show that they have authority to offer it. Customer data, personal credentials and disputed intellectual property must never be included."],
  ["03", "Independent diligence", "Each party remains responsible for legal, financial and technical diligence. Buyers should verify the condition, rights, provider rules and proposed transfer route before agreeing commercial terms."],
  ["04", "Transactions", "Unless a record explicitly says otherwise, Mayank is not the buyer, seller, escrow provider or legal adviser. The parties document price, licence or assignment terms, support and acceptance directly."],
];

export default function Terms() {
  return <main id="main" tabIndex={-1} className="policy-page policy-terms">
    <section className="policy-hero"><div className="policy-sigil" aria-hidden="true"><span>T</span><i>01</i></div><div><span>Governance record / 01</span><h1>Terms of<br/><em>continuity.</em></h1><p>The rules behind a marketplace built to move useful digital work responsibly.</p></div><aside>Draft for professional legal review<br/>Last updated: 29 September 2026</aside></section>
    <section className="policy-ledger" aria-label="Terms clauses">{clauses.map(([number, title, copy]) => <article key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="policy-close"><span>Working principle</span><p>Clarity before access.<br/>Agreement before transfer.</p><div><span>Questions</span><strong>[PROFESSIONAL EMAIL]</strong></div></section>
  </main>;
}
