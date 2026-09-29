import { Suspense } from "react";
import type { Metadata } from "next";
import { MarketBrowser, MarketFallback } from "@/components/mayank/MarketBrowser";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { assets, categories } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Market",
  description: "Browse reviewed startup-built products, code, domains, design systems and templates available to buy or rent.",
};

export default function MarketPage() {
  const available = assets.filter((asset) => asset.status === "live").length;
  return (
    <main id="main" tabIndex={-1} className="market-page">
      <PageMotion />
      <section className="page-hero market-hero">
        <div className="page-hero-copy">
          <span className="label" data-rise>Market / Edition 01</span>
          <h1 className="cut-title"><span><span>The index.</span></span><span><em>Inspect, then enquire.</em></span></h1>
          <p data-rise>Every record states its price, condition, what is included and exactly how it transfers. Open one to try the working sample before you write to the seller.</p>
        </div>
        <dl className="page-hero-stats" data-rise>
          <div><dt>Records</dt><dd data-count={assets.length}>{assets.length}</dd></div>
          <div><dt>Available now</dt><dd data-count={available}>{available}</dd></div>
          <div><dt>Categories</dt><dd data-count={categories.length}>{categories.length}</dd></div>
        </dl>
        <p className="sample-notice" data-rise><strong>Sample edition.</strong> Records shown are sample listings that demonstrate how Mayank presents an asset. Enquiries are delivered, but no real seller stands behind these records yet.</p>
      </section>
      <Suspense fallback={<MarketFallback />}>
        <MarketBrowser />
      </Suspense>
      <section className="market-foot">
        <p>Built something that deserves another operator?</p>
        <TransitionLink className="btn btn-solid" href="/sell">List an asset<span>Private review first</span></TransitionLink>
      </section>
    </main>
  );
}
