import { Suspense, type CSSProperties } from "react";
import type { Metadata } from "next";
import { MarketBrowser, MarketFallback } from "@/components/mayank/MarketBrowser";
import { PageMotion } from "@/components/mayank/PageMotion";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { Chart } from "@/components/mayank/visuals/Chart";
import { Drawing } from "@/components/mayank/visuals/Drawings";
import { PlateTape } from "@/components/mayank/visuals/PlateTape";
import { RecordPlate, plateFrom } from "@/components/mayank/visuals/RecordPlate";
import { assets, categories, categoryOf, formatPrice, getAsset, marketStats, statusLabel } from "@/lib/assets";
import { getDossier } from "@/lib/dossiers";

export const metadata: Metadata = {
  title: "Market",
  description: "Browse reviewed startup-built products, code, domains, design systems and templates available to buy or rent.",
};

export default function MarketPage() {
  const stats = marketStats();
  const featured = getAsset("atlas")!;
  const featuredDossier = getDossier(featured.slug);
  const featuredInk = categoryOf(featured.category).ink;
  const closed = assets.filter((asset) => asset.status !== "live");

  return (
    <main id="main" tabIndex={-1} className="market-page">
      <PageMotion />
      <section className="market-hero">
        <div className="market-hero-copy">
          <span className="label" data-rise data-scramble>Market / Edition 01</span>
          <h1 className="cut-title"><span><span>The index.</span></span><span><em>Inspect, then enquire.</em></span></h1>
          <p data-rise>Every record states its price, condition, what is included and exactly how it transfers. Open one to try the working sample before you write to the seller.</p>
        </div>
        <div className="market-hero-drawings" aria-hidden="true">
          {categories.map((category) => <span key={category.key} style={{ "--cat": category.ink } as CSSProperties}><Drawing name={category.key} /></span>)}
        </div>
        <dl className="market-figures" data-rise>
          <div><dt>Listed for sale</dt><dd data-count={(stats.listedValue / 100000).toFixed(2)} data-prefix="₹" data-suffix="L" data-decimals="2">₹{(stats.listedValue / 100000).toFixed(2)}L</dd></div>
          <div><dt>Median asking price</dt><dd data-count={(stats.medianAsk / 1000).toFixed(0)} data-prefix="₹" data-suffix="k">₹{(stats.medianAsk / 1000).toFixed(0)}k</dd></div>
          <div><dt>Available records</dt><dd data-count={stats.available}>{stats.available}</dd></div>
          <div><dt>Average transfer window</dt><dd data-count={stats.averageDays} data-suffix=" days">{stats.averageDays} days</dd></div>
        </dl>
        <p className="sample-notice" data-rise><strong>Sample edition.</strong> Records shown are sample listings that demonstrate how Mayank presents an asset. Enquiries are delivered, but no real seller stands behind these records yet.</p>
      </section>

      <PlateTape />

      <section className="featured-record" style={{ "--accent": featuredInk } as CSSProperties} aria-labelledby="featured-title">
        <div className="featured-plate" data-crop><RecordPlate source={plateFrom(featured)} variant="cover" /></div>
        <div className="featured-copy">
          <span className="label" data-reveal>Record in focus / {featured.id}</span>
          <h2 id="featured-title" data-reveal>{featured.name}<em> {featured.type.toLowerCase()}</em></h2>
          <p data-reveal>{featured.description}</p>
          <ol className="featured-highlights" data-reveal>{featuredDossier.highlights.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
          <div data-reveal><Chart values={featuredDossier.series.values} label={featuredDossier.series.label} /></div>
          <div className="featured-actions" data-reveal>
            <TransitionLink className="btn btn-accent" href={`/market/${featured.slug}`}>Open the full record<span>{formatPrice(featured)}</span></TransitionLink>
            <span className="featured-seller">{featuredDossier.seller.role}, {featuredDossier.seller.city}</span>
          </div>
        </div>
      </section>

      <Suspense fallback={<MarketFallback />}>
        <MarketBrowser />
      </Suspense>

      <section className="closed-ledger" aria-labelledby="closed-title">
        <header data-reveal><span className="label">Closed records</span><h2 id="closed-title">Recently transferred<br /><em>or licensed.</em></h2><p>Closed records stay on file so buyers can see how a finished transfer is recorded.</p></header>
        <ol>
          {closed.map((asset) => (
            <li key={asset.slug} data-reveal style={{ "--cat": categoryOf(asset.category).ink } as CSSProperties}>
              <TransitionLink href={`/market/${asset.slug}`}>
                <RecordPlate source={plateFrom(asset)} variant="thumb" title="" />
                <span className="closed-name"><strong>{asset.name}</strong><small>{asset.id} / {asset.type}</small></span>
                <span>{formatPrice(asset)}</span>
                <span>{asset.transferWindow}</span>
                <b className="closed-stamp">{statusLabel[asset.status]}</b>
              </TransitionLink>
            </li>
          ))}
        </ol>
      </section>

      <section className="market-foot">
        <Drawing name="publish" />
        <p>Built something that deserves another operator?</p>
        <TransitionLink className="btn btn-solid" href="/sell">List an asset<span>Private review first</span></TransitionLink>
      </section>
    </main>
  );
}
