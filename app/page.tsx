import Image from "next/image";
import { AssetRows } from "@/components/mayank/AssetRows";
import { TransitionLink } from "@/components/mayank/PageTransition";
import { ProductSurface } from "@/components/mayank/ProductSurface";
import { CategoryLeaves } from "@/components/mayank/home/CategoryLeaves";
import { HomeMotion } from "@/components/mayank/home/HomeMotion";
import { TransferReel } from "@/components/mayank/home/TransferReel";
import { assets, getAsset } from "@/lib/assets";

const kite = getAsset("kite")!;
const latest = [...assets].filter((asset) => asset.status === "live").sort((a, b) => b.listed.localeCompare(a.listed)).slice(0, 6);
const available = assets.filter((asset) => asset.status === "live").length;

export default function Home() {
  return (
    <>
      <HomeMotion />
      <div className="scroll-progress" aria-hidden="true" />

      <main id="main" tabIndex={-1} className="home">
        <section className="hero" id="top">
          <div className="hero-stage">
            <div className="hero-visual" style={{ position: "absolute" }}>
              <Image src="/archive-object.webp" alt="Sculptural physical archive made from paper, graphite and aluminium" fill priority sizes="100vw" />
              <div className="hero-visual-index"><span>Object 001</span><span>Continuity archive</span></div>
            </div>
            <div className="hero-statement">
              <div className="hero-topline"><span>Marketplace for startup-built digital assets</span><span>Edition 01</span></div>
              <h1 className="hero-title" aria-label="Buy what's built. Sell what's useful.">
                <span className="hero-line"><span>Buy what’s built.</span></span>
                <span className="hero-line hero-line-serif"><span>Sell what’s useful.</span></span>
              </h1>
              <p>A reviewed marketplace for startup products, code, domains, design systems and eligible digital resources. Choose what you came here to do.</p>
              <div className="hero-actions" aria-label="Choose your marketplace path">
                <TransitionLink className="hero-action-buyer" href="/market"><span className="hero-action-top"><span>01 / Buyer</span><span>Open market</span></span><strong>Browse available assets</strong><small>See the price, condition and transfer route.</small></TransitionLink>
                <TransitionLink className="hero-action-seller" href="/sell"><span className="hero-action-top"><span>02 / Seller</span><span>Start listing</span></span><strong>List an asset</strong><small>Submit work to sell or rent after review.</small></TransitionLink>
              </div>
            </div>
            <div className="hero-live-record">
              <div className="hero-record-head"><span>From archive to active product</span><h2>Inspect the work.<br /><em>Then decide.</em></h2><p>Every record starts with something real enough to examine. Try the sample, then open the full record.</p></div>
              <div className="hero-live-product"><ProductSurface asset={kite} compact /></div>
              <div className="hero-record-foot"><span>{kite.id} / {kite.name} / {kite.type}</span><TransitionLink href={`/market/${kite.slug}`}>Open complete record</TransitionLink></div>
            </div>
            <div className="hero-proof"><span>Buy / {available} records available</span><span>Sell / Reviewed before publishing</span><span>Ownership before access</span><span>Scroll / Inspect a sample</span></div>
          </div>
        </section>

        <section className="why" aria-label="Why Mayank exists">
          <div className="why-image"><Image src="/archive-detail.webp" alt="Macro view of layered archival paper and aluminium transfer rails" fill sizes="(max-width: 980px) 100vw, 50vw" /></div>
          <div className="why-copy">
            <span className="label">01 / A market for continuity</span>
            <p className="manifesto-line">Some companies end.</p>
            <p className="manifesto-line">Their best work should not.</p>
            <p className="manifesto-line">We preserve the useful part,</p>
            <p className="manifesto-line serif">then find its next operator.</p>
            <p className="why-foot">Every record begins with the asset itself: what exists, who owns it, what still works and exactly how it can move.</p>
          </div>
        </section>

        <section className="live-index" aria-labelledby="live-index-title">
          <div className="section-head">
            <div><span className="label">02 / Current index</span><h2 id="live-index-title">Available<br /><em>right now.</em></h2></div>
            <div className="section-head-aside">
              <p>The newest records in the market. Each opens a full inspection page with a working sample, condition ledger and transfer route.</p>
              <TransitionLink className="btn btn-solid" href="/market">Open the full market<span>{assets.length} records</span></TransitionLink>
            </div>
          </div>
          <AssetRows items={latest} className="is-home" />
        </section>

        <section className="categories" aria-labelledby="categories-title">
          <div className="section-head">
            <div><span className="label">03 / What moves here</span><h2 id="categories-title">Six kinds of<br /><em>useful work.</em></h2></div>
            <div className="section-head-aside"><p>From complete products to a single domain. Provider-dependent assets are accepted only when the provider permits a documented transfer.</p></div>
          </div>
          <CategoryLeaves />
        </section>

        <TransferReel />

        <section className="handover" aria-label="How a transfer works">
          <div className="handover-track">
            <article className="handover-opening"><span>From idle</span><strong>to acquired.</strong><p>Four checks turn an interesting asset into a practical transaction. <TransitionLink href="/how-it-works" className="text-link">Read the full method</TransitionLink></p></article>
            <article><span>01 / Identity</span><h3>Know the<br />seller.</h3><p>The seller is checked privately. Personal contact details stay protected until an enquiry is accepted.</p><div className="method-seal">Private<br />review</div></article>
            <article><span>02 / Ownership</span><h3>Trace the<br />work.</h3><p>Repository history, registrar records and original files support the ownership claim.</p><div className="method-lines" aria-hidden="true"><i /><i /><i /><i /></div></article>
            <article><span>03 / Condition</span><h3>See what<br />remains.</h3><p>Working features, dependencies, missing pieces and exclusions are recorded without cosmetic language.</p><div className="condition-meter" aria-hidden="true"><i /><i /><i /><i /><i /></div></article>
            <article><span>04 / Handover</span><h3>Move with<br />a route.</h3><p>The buyer receives a defined transfer method, expected duration and support window.</p><div className="handover-mark" aria-hidden="true">M</div></article>
          </div>
        </section>

        <section className="seller-band" aria-labelledby="seller-title">
          <div className="seller-copy">
            <span className="label">05 / For founders</span>
            <h2 id="seller-title">Put the work<br /><em>back to work.</em></h2>
            <p>Winding down, pivoting or simply done with something good? List it privately. Mayank reviews it before anyone else sees it.</p>
          </div>
          <div className="seller-steps">
            <ol>
              <li><span>01</span><strong>Describe it</strong><p>Asset, terms, condition and up to four images. Your draft saves as you go.</p></li>
              <li><span>02</span><strong>Private review</strong><p>Identity, ownership evidence and the transfer route are checked.</p></li>
              <li><span>03</span><strong>Go live with a route</strong><p>The record enters the index with your contact details kept private.</p></li>
            </ol>
            <div className="seller-actions">
              <TransitionLink className="btn btn-solid" href="/sell">Start a listing<span>Sell or rent</span></TransitionLink>
              <TransitionLink className="text-link" href="/restricted-assets">What cannot be listed</TransitionLink>
            </div>
          </div>
        </section>

        <section className="closing">
          <p className="closing-kicker">The useful part can continue.</p>
          <div className="closing-word" aria-hidden="true">MAYANK</div>
          <div className="closing-foot">
            <p>Startup-built assets, ready for their next operator.</p>
            <div className="closing-actions">
              <TransitionLink href="/market">Browse the market</TransitionLink>
              <TransitionLink href="/sell">List an asset</TransitionLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
