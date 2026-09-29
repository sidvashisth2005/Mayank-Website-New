import { TransitionLink } from "./PageTransition";
import { assets, categories } from "@/lib/assets";

export function SiteFooter() {
  const available = assets.filter((asset) => asset.status === "live").length;
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>MAYANK</strong>
        <p>A reviewed exchange for startup-built products, code, domains and design systems.</p>
      </div>
      <nav className="footer-col" aria-label="Market">
        <span>Market</span>
        <TransitionLink href="/market">Current index ({available} available)</TransitionLink>
        {categories.slice(0, 4).map((category) => <TransitionLink key={category.key} href={`/market?category=${category.key}`}>{category.plural}</TransitionLink>)}
      </nav>
      <nav className="footer-col" aria-label="Sell">
        <span>Sell</span>
        <TransitionLink href="/sell">List an asset</TransitionLink>
        <TransitionLink href="/how-it-works#review">What Mayank reviews</TransitionLink>
        <TransitionLink href="/restricted-assets">Restricted assets</TransitionLink>
      </nav>
      <nav className="footer-col" aria-label="Company">
        <span>Mayank</span>
        <TransitionLink href="/how-it-works">How it works</TransitionLink>
        <TransitionLink href="/terms">Terms</TransitionLink>
        <TransitionLink href="/privacy">Privacy</TransitionLink>
      </nav>
      <div className="footer-status">
        <span>Edition 01 / Pre-launch</span>
        <strong>Listings shown are samples while Mayank prepares for launch.</strong>
        <span>Founder and contact details will be published before launch.</span>
      </div>
    </footer>
  );
}
