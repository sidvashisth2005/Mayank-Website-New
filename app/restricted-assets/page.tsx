import Link from "next/link";

const restricted = [
  "Personal accounts, login credentials or identity-linked profiles",
  "Customer databases, personal information or private communications",
  "Stolen, pirated or disputed intellectual property",
  "Non-transferable promotional credits and subscriptions",
  "Provider-controlled accounts whose resale or transfer is prohibited",
  "Manipulated engagement metrics or infrastructure connected to illegal activity",
];

export default function RestrictedAssets() {
  return <main className="policy-page policy-restricted">
    <header className="topbar"><Link className="wordmark" href="/">MAYANK</Link><nav><Link href="/#market">Exchange</Link><Link href="/terms">Terms</Link></nav><Link className="header-cta" href="/">Back to site</Link></header>
    <section className="restricted-hero"><div><span>Marketplace standard / 03</span><h1>Value is not<br/><em>enough.</em></h1></div><p>Mayank is for assets that can move responsibly. A record may be refused even when the work has commercial value.</p><div className="restricted-stamp" aria-hidden="true">TRANSFERABILITY<br/>FIRST</div></section>
    <section className="restricted-index"><div className="restricted-heading"><span>Decline register</span><h2>What does not enter the archive.</h2></div><ol>{restricted.map((item, index) => <li key={item}><span>0{index + 1}</span><p>{item}</p><i aria-hidden="true">×</i></li>)}</ol></section>
    <section className="restricted-exception"><span>Provider-dependent assets</span><h2>Permission must be part of the route.</h2><p>Organisation accounts, advertising infrastructure and enterprise capacity may be considered only when the provider permits a documented transfer. Uncertainty is recorded—not hidden.</p><div><span>Report a concern</span><strong>[PROFESSIONAL EMAIL]</strong></div></section>
  </main>;
}
