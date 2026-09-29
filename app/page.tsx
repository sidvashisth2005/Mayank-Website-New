"use client";

import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const assets = [
  {
    id: "MX-024",
    name: "Kite",
    type: "Analytics product",
    price: "₹1,85,000",
    age: "18 months",
    status: "Evidence reviewed",
    route: "Repository, deployment and 21-day handover",
    transferWindow: "21 days",
    access: "Private demo after accepted enquiry",
    includes: ["Production repository", "Deployment notes", "Founder handover"],
    dependency: "Current hosting is excluded and must be replaced by the buyer.",
    measure: "1,284",
    label: "active accounts",
    description: "A focused analytics workspace for subscription teams, including the interface system, production code and operating notes.",
    bars: [34, 49, 43, 67, 58, 75, 84, 69, 91, 78, 96, 88],
  },
  {
    id: "MX-031",
    name: "Northstar",
    type: "Domain and identity",
    price: "₹78,000",
    age: "3 years",
    status: "Route documented",
    route: "Registrar transfer and editable identity archive",
    transferWindow: "5–7 days",
    access: "Registrar proof after accepted enquiry",
    includes: ["Dot-com domain", "Identity masters", "Naming guidelines"],
    dependency: "Registrar eligibility and transfer lock are confirmed before completion.",
    measure: "14",
    label: "original files",
    description: "A concise dot-com name with a complete naming system, launch language and editable master identity files.",
    bars: [72, 72, 18, 18, 52, 52, 88, 88, 38, 38, 63, 63],
  },
  {
    id: "MX-038",
    name: "Relay",
    type: "Design system",
    price: "₹42,000",
    age: "11 months",
    status: "Evidence ready",
    route: "Exclusive licence with source library",
    transferWindow: "10 days",
    access: "Read-only library review",
    includes: ["126 components", "Design tokens", "Implementation notes"],
    dependency: "Fonts and third-party icon licences are documented separately.",
    measure: "126",
    label: "production components",
    description: "A production-tested interface library with design tokens, accessibility notes and implementation guidance.",
    bars: [25, 31, 44, 51, 62, 66, 71, 76, 81, 84, 89, 94],
  },
  {
    id: "MX-043",
    name: "Atlas",
    type: "Complete product",
    price: "₹2,40,000",
    age: "22 months",
    status: "Evidence reviewed",
    route: "Native transfer with 30-day founder support",
    transferWindow: "30 days",
    access: "Guided product walkthrough",
    includes: ["Application source", "Publishing workflow", "Operator handbook"],
    dependency: "Search infrastructure requires a new billing owner at transfer.",
    measure: "2.7m",
    label: "indexed help words",
    description: "A searchable support portal with publishing workflow, deployment documentation and a clean operator handover.",
    bars: [81, 54, 68, 42, 76, 64, 88, 71, 92, 85, 97, 90],
  },
] as const;

const assetFilters = ["All", "Complete product", "Analytics product", "Domain and identity", "Design system"] as const;

function ProductSurface({ index = 0, compact = false }: { index?: number; compact?: boolean }) {
  const [view, setView] = useState<"Pulse" | "Cohorts" | "Accounts">("Pulse");
  const asset = assets[index];
  const factors = view === "Pulse" ? [1, 1, 1] : view === "Cohorts" ? [.72, .9, .8] : [.86, .7, .94];
  return (
    <div className={`product-surface ${compact ? "is-compact" : ""}`} aria-label={`${asset.name} interactive product preview`}>
      <div className="product-rail">
        <strong>{asset.name}</strong><span>{asset.id}</span>
        <div className="product-tabs" aria-label="Preview views">
          {(["Pulse", "Cohorts", "Accounts"] as const).map((item) => (
            <button key={item} className={view === item ? "is-active" : ""} onClick={() => setView(item)}>{item}</button>
          ))}
        </div>
        <small>Live sample</small>
      </div>
      <div className="product-canvas">
        <div className="product-canvas-head"><span>{view}</span><span>Last 30 days</span></div>
        <div className="product-number"><span>{asset.label}</span><strong>{asset.measure}</strong></div>
        <div className="product-bars" role="img" aria-label={`${asset.name} ${view} sample chart`}>
          {asset.bars.map((height, itemIndex) => <i key={itemIndex} style={{ height: `${Math.max(12, height * factors[itemIndex % 3])}%` }} />)}
        </div>
      </div>
    </div>
  );
}

function AssetOverlay({ index, close, move }: { index: number; close: () => void; move: (index: number) => void }) {
  const asset = assets[index];
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => { window.removeEventListener("keydown", onKey); document.body.classList.remove("modal-open"); };
  }, [close]);
  return (
    <div className="asset-overlay" role="dialog" aria-modal="true" aria-labelledby="asset-title">
      <button className="overlay-backdrop" aria-label="Close asset detail" onClick={close} />
      <article className={enquiryOpen ? "is-enquiring" : ""}>
        <div className="overlay-head"><span>{asset.id} / Inspection record</span><div><button onClick={() => move(index - 1)} aria-label="Previous asset">Previous</button><button onClick={() => move(index + 1)} aria-label="Next asset">Next</button><button onClick={close}>Close</button></div></div>
        <div className="overlay-register" aria-label="Record chapters"><span>01 / Asset</span><span>02 / Evidence</span><span>03 / Transfer</span><strong>{String(index + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}</strong></div>
        <div className="overlay-grid">
          <div className="overlay-main">
            <div className="overlay-title"><p className="kicker">{asset.type}</p><h2 id="asset-title">{asset.name}</h2><p className="overlay-copy">{asset.description}</p></div>
            <ProductSurface index={index} compact />
            <div className="evidence-band">
              <div><span>Included in record</span>{asset.includes.map((item, itemIndex) => <p key={item}><i>{String(itemIndex + 1).padStart(2, "0")}</i>{item}</p>)}</div>
              <div><span>Known dependency</span><p>{asset.dependency}</p></div>
            </div>
          </div>
          <aside className="record-sheet">
            <span className="sheet-label">Private record sheet</span>
            <strong className="sheet-price">{asset.price}</strong>
            <dl><div><dt>Asset age</dt><dd>{asset.age}</dd></div><div><dt>Condition</dt><dd>{asset.status}</dd></div><div><dt>Access</dt><dd>{asset.access}</dd></div></dl>
            <div className="transfer-route"><span>Expected route</span><strong>{asset.route}</strong><div><i>Seller</i><i>Mayank review</i><i>Buyer</i></div><small>Indicative window / {asset.transferWindow}</small></div>
            <button className="primary-action" type="button" onClick={() => setEnquiryOpen(true)}>Begin private enquiry</button>
            <small>Sample inventory. No enquiry is sent from this preview.</small>
          </aside>
        </div>
        {enquiryOpen && <div className="enquiry-drawer" role="status"><span>Private enquiry / Draft only</span><button type="button" aria-label="Close enquiry draft" onClick={() => setEnquiryOpen(false)}>Close</button><h3>Record {asset.id} is ready for a private introduction.</h3><p>In production, this step will ask for a verified professional email before sharing protected evidence or seller details.</p><div><strong>Nothing has been sent.</strong><small>Contact destination must be configured before launch.</small></div></div>}
      </article>
    </div>
  );
}

export default function Home() {
  const [overlay, setOverlay] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState<(typeof assetFilters)[number]>("All");
  const [marketFocus, setMarketFocus] = useState(0);
  const [drafted, setDrafted] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const visibleAssets = useMemo(() => assets.filter((asset) => {
    const matchesQuery = `${asset.name} ${asset.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = assetFilter === "All" || asset.type === assetFilter;
    return matchesQuery && matchesFilter;
  }), [assetFilter, query]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) { gsap.set(".site-loader", { display: "none" }); return; }

      const entrance = gsap.timeline();
      gsap.set(".leaf-letter", { opacity: 0, scale: .82 });
      entrance.fromTo(".archive-leaf", { x: (index) => (index - 2.5) * 150, y: (index) => Math.abs(index - 2.5) * 34, rotate: (index) => (index - 2.5) * 7, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.05, stagger: .075, ease: "power4.out" })
        .to(".archive-leaf.is-front .leaf-letter", { opacity: 1, scale: 1, duration: .52, ease: "power3.out" }, "-=.25")
        .to(".archive-leaf", { x: (index) => (index - 2.5) * Math.min(185, window.innerWidth * .105), scaleY: .72, duration: 1.05, stagger: .03, ease: "power3.inOut" }, "+=.55")
        .to(".archive-leaf:not(.is-front) .leaf-letter", { opacity: 1, scale: 1, duration: .62, stagger: .055, ease: "power3.out" }, "<.2")
        .fromTo(".loader-rule", { scaleX: 0 }, { scaleX: 1, duration: .9, ease: "power3.inOut" }, "<")
        .to(".site-loader", { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "power4.inOut" }, "+=.45")
        .fromTo(".hero-visual", { clipPath: "inset(16% 12% 16% 12%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.45, ease: "power4.out" }, "-=.85")
        .fromTo(".hero-line > span", { yPercent: 120 }, { yPercent: 0, duration: 1.05, stagger: .08, ease: "power4.out" }, "-=1.15")
        .fromTo(".hero-actions > a", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: "power3.out" }, "-=.75")
        .fromTo(".hero-proof > *", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .07 }, "-=.65");

      gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: .15 } });
      const heroJourney = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1.25 } });
      heroJourney.to(".hero-statement", { xPercent: -22, opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(".hero-visual", { left: "0vw", width: "100vw", duration: 1.45, ease: "power3.inOut" }, 0)
        .to(".hero-visual img", { scale: 1.1, yPercent: 3, duration: 1.45, ease: "power2.inOut" }, 0)
        .to(".hero-visual-index", { opacity: 0, duration: .45 }, .15)
        .to(".hero-proof", { yPercent: 105, opacity: 0, duration: .75, ease: "power2.in" }, .08)
        .fromTo(".hero-live-record", { clipPath: "inset(100% 0 0 0)", yPercent: 14 }, { clipPath: "inset(0% 0 0 0)", yPercent: 0, duration: 1.4, ease: "power4.inOut" }, 1.12)
        .set(".hero-live-record", { pointerEvents: "auto" }, 1.2)
        .fromTo(".hero-record-head > *, .hero-record-foot > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .6 }, 1.75)
        .fromTo(".hero-live-product", { scale: .92, opacity: 0 }, { scale: 1, opacity: 1, duration: .85, ease: "power3.out" }, 1.62);

      const artifactReveal = gsap.timeline({ scrollTrigger: { trigger: ".artifact-interlude", start: "top 88%", end: "bottom 30%", scrub: 1.15 } });
      artifactReveal
        .fromTo(".artifact-image", { clipPath: "inset(12% 10% 12% 10%)", scale: .92 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.5, ease: "power3.inOut" }, 0)
        .fromTo(".artifact-interlude img", { yPercent: -10, scale: 1.12 }, { yPercent: 7, scale: 1.02, duration: 2, ease: "none" }, 0)
        .fromTo(".artifact-copy > *", { y: 46, opacity: 0 }, { y: 0, opacity: 1, stagger: .15, duration: .9, ease: "power3.out" }, .35);

      const editionReveal = gsap.timeline({ scrollTrigger: { trigger: ".edition-carousel", start: "top 82%", end: "center 58%", scrub: 1 } });
      editionReveal
        .fromTo(".edition-head > *", { y: 38, opacity: 0 }, { y: 0, opacity: 1, stagger: .1, duration: .8, ease: "power3.out" }, 0)
        .fromTo(".carousel-viewport", { clipPath: "inset(0 0 0 18%)", x: 90 }, { clipPath: "inset(0 0 0 0%)", x: 0, duration: 1.2, ease: "power4.inOut" }, .15);
      gsap.fromTo(".cutout-specimen", { yPercent: -5 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".edition-carousel", start: "top bottom", end: "bottom top", scrub: 1.15 } });

      const inspectionReveal = gsap.timeline({ scrollTrigger: { trigger: ".inspection-intro", start: "top 80%", end: "bottom 45%", scrub: 1 } });
      inspectionReveal
        .fromTo(".inspection-copy > *", { y: 48, opacity: 0 }, { y: 0, opacity: 1, stagger: .11, duration: .8, ease: "power3.out" }, 0)
        .fromTo(".inspection-ledger article", { x: 55, opacity: 0 }, { x: 0, opacity: 1, stagger: .1, duration: .72, ease: "power3.out" }, .15);

      gsap.utils.toArray<HTMLElement>(".manifesto-line").forEach((line) => {
        gsap.fromTo(line, { opacity: .13 }, { opacity: 1, scrollTrigger: { trigger: line, start: "top 68%", end: "bottom 48%", scrub: .8 } });
      });

      const methodReveal = gsap.timeline({ scrollTrigger: { trigger: ".method-intro", start: "top 78%", end: "bottom 42%", scrub: 1 } });
      methodReveal
        .fromTo(".method-label", { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: .7, ease: "power3.out" }, 0)
        .fromTo(".method-intro h2", { clipPath: "inset(0 0 100% 0)", y: 70 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.35, ease: "power4.inOut" }, .08)
        .fromTo(".method-intro>p", { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power3.out" }, .7)
        .fromTo(".review-point", { y: 34, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .62, ease: "power3.out" }, .88);

      const panels = gsap.utils.toArray<HTMLElement>(".vault-panel");
      gsap.set(panels.slice(1), { clipPath: "inset(100% 0 0 0)" });
      const vault = gsap.timeline({ scrollTrigger: { trigger: ".vault", start: "top top", end: "+=5200", pin: true, scrub: 1.15, anticipatePin: 1 } });
      panels.slice(1).forEach((panel, index) => {
        vault.to(panels[index], { scale: .9, opacity: .15, duration: 1.2, ease: "power2.inOut" })
          .to(panel, { clipPath: "inset(0% 0 0 0)", duration: 1.8, ease: "power3.inOut" }, "<.15")
          .fromTo(panel.querySelectorAll(".panel-reveal"), { y: 48, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .7 }, "-=.7");
      });

      gsap.fromTo(".handover-track", { xPercent: 0 }, { xPercent: -69, ease: "none", scrollTrigger: { trigger: ".handover", start: "top top", end: "+=3600", pin: true, scrub: 1 } });
      gsap.utils.toArray<HTMLElement>(".reveal-rule").forEach((rule) => gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", scrollTrigger: { trigger: rule, start: "top 82%", end: "top 55%", scrub: .8 } }));
      const marketReveal = gsap.timeline({ scrollTrigger: { trigger: ".market", start: "top 78%", end: "top 18%", scrub: .9 } });
      marketReveal
        .fromTo(".market-head>div:first-child", { x: -55, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: "power3.out" }, 0)
        .fromTo(".market-head>div:last-child", { x: 55, opacity: 0 }, { x: 0, opacity: 1, duration: .9, ease: "power3.out" }, .12)
        .fromTo(".market-filter button", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .05, duration: .48, ease: "power3.out" }, .38)
        .fromTo(".market-table button", { clipPath: "inset(0 0 100% 0)", y: 22 }, { clipPath: "inset(0 0 0% 0)", y: 0, stagger: .1, duration: .65, ease: "power3.out" }, .5);

      const listingReveal = gsap.timeline({ scrollTrigger: { trigger: ".listing", start: "top 82%", end: "top 26%", scrub: 1 } });
      listingReveal
        .fromTo(".listing-copy > *", { y: 44, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: .8, ease: "power3.out" }, 0)
        .fromTo(".listing form label, .form-chapter", { clipPath: "inset(0 100% 0 0)", x: 24 }, { clipPath: "inset(0 0% 0 0)", x: 0, stagger: .05, duration: .62, ease: "power3.inOut" }, .18)
        .fromTo(".submit-draft", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .55 }, .72);
      gsap.fromTo(".closing-word", { letterSpacing: "-.12em", scale: .65 }, { letterSpacing: "-.055em", scale: 1, ease: "none", scrollTrigger: { trigger: ".closing", start: "top bottom", end: "center center", scrub: 1.2 } });
    });
    return () => context.revert();
  }, []);

  function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDrafted(true);
  }

  function goToCarousel(index: number) {
    const nextIndex = (index + assets.length) % assets.length;
    const viewport = carouselRef.current;
    const slide = viewport?.children.item(nextIndex) as HTMLElement | null;
    setCarouselIndex(nextIndex);
    if (!viewport || !slide) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({ left: slide.offsetLeft - viewport.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function returnToTop(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.history.replaceState(null, "", window.location.pathname);
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    // `behavior: "auto"` still inherits the global smooth-scroll rule. Force a
    // true jump so pinned ScrollTrigger sections cannot leave the hero offset.
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    ScrollTrigger.update();

    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
      ScrollTrigger.update();
    });
  }

  return (
    <>
      <div className="site-loader" aria-hidden="true">
        <div className="loader-register"><span>Edition 01</span><span>Useful work / Registered</span></div>
        <div className="loader-archive"><i className="archive-leaf is-front"><span className="leaf-letter">M</span></i><i className="archive-leaf"><span className="leaf-letter">A</span></i><i className="archive-leaf"><span className="leaf-letter">Y</span></i><i className="archive-leaf"><span className="leaf-letter">A</span></i><i className="archive-leaf"><span className="leaf-letter">N</span></i><i className="archive-leaf"><span className="leaf-letter">K</span></i></div>
        <div className="loader-rule"/>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
      <header className="nav-shell">
        <Link className="wordmark" href="#top" onClick={returnToTop} aria-label="Mayank, return to top">MAYANK</Link>
        <nav aria-label="Primary navigation"><Link href="#market">Buy assets</Link><Link href="#method">How it works</Link><Link href="#work">Selected</Link></nav>
        <Link className="nav-action" href="#list">Sell an asset</Link>
      </header>
      <main>
        <section className="hero" id="top">
          <div className="hero-stage">
            <div className="hero-visual" style={{ position: "absolute" }}>
              <Image src="/archive-object.webp" alt="Sculptural physical archive made from paper, graphite and aluminium" fill priority sizes="100vw" />
              <div className="hero-visual-index"><span>Object 001</span><span>Continuity archive</span></div>
            </div>
            <div className="hero-statement">
              <div className="hero-topline"><span>Marketplace for startup-built digital assets</span><span>Edition 01</span></div>
              <h1 className="hero-title marketplace-title" aria-label="Buy what's built. Sell what's useful.">
                <span className="hero-line"><span>Buy what’s built.</span></span>
                <span className="hero-line hero-line-serif"><span>Sell what’s useful.</span></span>
              </h1>
              <p>A reviewed marketplace for startup products, code, domains, design systems and eligible digital resources. Choose what you came here to do.</p>
              <div className="hero-actions" aria-label="Choose your marketplace path">
                <a className="hero-action-buyer" href="#market"><span className="hero-action-top"><span>01 / Buyer</span><span>Open market</span></span><strong>Browse available assets</strong><small>See the price, condition and transfer route.</small></a>
                <a className="hero-action-seller" href="#list"><span className="hero-action-top"><span>02 / Seller</span><span>Start listing</span></span><strong>List an asset</strong><small>Submit work to sell or rent after review.</small></a>
              </div>
            </div>
            <div className="hero-live-record">
              <div className="hero-record-head"><span>From archive to active product</span><h2>Inspect the work.<br/><em>Then decide.</em></h2><p>Every record starts with something real enough to examine.</p></div>
              <div className="hero-live-product"><ProductSurface index={0} compact /></div>
              <div className="hero-record-foot"><span>MX-024 / Kite Analytics</span><button onClick={() => setOverlay(0)}>Open complete record</button></div>
            </div>
            <div className="hero-proof"><span>Buy / Browse reviewed assets</span><span>Sell / Submit for review</span><span>Ownership before access</span><span>Scroll / Inspect a sample</span></div>
          </div>
        </section>

        <section className="manifesto" aria-label="Market philosophy">
          <div className="manifesto-kicker"><span>01</span><span>A market for continuity</span></div>
          <div className="manifesto-copy">
            <p className="manifesto-line">Some companies end.</p>
            <p className="manifesto-line">Their best work should not.</p>
            <p className="manifesto-line">We preserve the useful part,</p>
            <p className="manifesto-line serif">then find its next operator.</p>
          </div>
          <div className="manifesto-foot"><p>Every record begins with the asset itself: what exists, who owns it, what still works and exactly how it can move.</p><span>Built once / Useful again</span></div>
        </section>

        <section className="artifact-interlude" aria-label="The Mayank archive object">
          <div className="artifact-image" style={{ position: "relative" }}><Image src="/archive-detail.webp" alt="Macro view of layered archival paper and aluminium transfer rails" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="artifact-copy"><span>Archive study / 02</span><h2>A product is more than its files.</h2><p>Context, condition and a clear handover turn dormant work into an asset another team can actually continue.</p></div>
        </section>

        <section className="edition-carousel" id="edition" aria-roledescription="carousel" aria-label="Selected asset edition">
          <div className="edition-head">
            <div><span>Edition 01 / Transfer reel</span><h2>Four records,<br/><em>cut from real work.</em></h2></div>
            <p>A compact view of what is being transferred—not a gallery of logos. Move through the edition to compare condition, price and handover route.</p>
            <div className="carousel-controls">
              <span aria-live="polite">{String(carouselIndex + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}</span>
              <button type="button" onClick={() => goToCarousel(carouselIndex - 1)}>Previous record</button>
              <button type="button" onClick={() => goToCarousel(carouselIndex + 1)}>Next record</button>
            </div>
          </div>
          <div
            className="carousel-viewport"
            ref={carouselRef}
            onScroll={(event) => {
              const viewport = event.currentTarget;
              const slides = Array.from(viewport.children) as HTMLElement[];
              const nearest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - viewport.scrollLeft) < Math.abs(slides[best].offsetLeft - viewport.scrollLeft) ? index : best, 0);
              if (nearest !== carouselIndex) setCarouselIndex(nearest);
            }}
          >
            {assets.map((asset, index) => (
              <article className={`carousel-card carousel-card-${index + 1}`} key={`reel-${asset.id}`} aria-label={`${asset.name}, ${asset.type}`}>
                <div className="carousel-card-copy">
                  <span>{asset.id} / {asset.type}</span>
                  <h3>{asset.name}</h3>
                  <p>{asset.description}</p>
                  <button type="button" onClick={() => setOverlay(index)}>Inspect full record</button>
                </div>
                <div className="carousel-card-facts">
                  <span>Condition <strong>{asset.status}</strong></span>
                  <span>Asking <strong>{asset.price}</strong></span>
                  <span>Route <strong>{asset.route}</strong></span>
                </div>
                <figure className={`cutout-specimen cutout-specimen-${index + 1}`} style={{ position: "absolute" }}>
                  <Image src={index % 2 === 0 ? "/archive-detail.webp" : "/archive-object.webp"} alt="" fill sizes="(max-width: 640px) 70vw, 36vw" />
                  <figcaption><span>Transfer specimen</span><strong>{String(index + 1).padStart(2, "0")}</strong></figcaption>
                </figure>
              </article>
            ))}
          </div>
        </section>

        <section id="inspection" className="inspection-intro" aria-label="How a Mayank listing is inspected">
          <div className="inspection-copy">
            <span>02 / Inspection room</span>
            <h2>See the work.<br/><em>Not just the pitch.</em></h2>
            <p>Mayank is built around inspectable records. A buyer should understand what exists, what still works and what will actually arrive before a private conversation begins.</p>
          </div>
          <div className="inspection-ledger">
            <article><span>01</span><div><strong>Working sample</strong><p>A real interface, file set or operating surface—not a decorative mockup.</p></div></article>
            <article><span>02</span><div><strong>Condition ledger</strong><p>Current features, dependencies, exclusions and unfinished work are stated plainly.</p></div></article>
            <article><span>03</span><div><strong>Transfer route</strong><p>The record names how ownership, files, access and support are expected to move.</p></div></article>
          </div>
        </section>

        <section className="vault" id="work" aria-label="Selected digital assets">
          {assets.map((asset, index) => (
            <article className={`vault-panel vault-panel-${index + 1}`} key={asset.id}>
              <div className="panel-index panel-reveal"><span>{String(index + 1).padStart(2, "0")}</span><span>/ 04</span></div>
              <div className="panel-copy panel-reveal"><p>{asset.type}</p><h2>{asset.name}</h2><div><span>{asset.description}</span><button onClick={() => setOverlay(index)}>Inspect record</button></div></div>
              <div className="panel-product panel-reveal"><ProductSurface index={index} /></div>
              <div className="panel-record panel-reveal"><span>{asset.status}</span><strong>{asset.price}</strong><small>{asset.route}</small></div>
            </article>
          ))}
        </section>

        <section className="method-intro" id="method">
          <div className="method-label"><span>03</span><span>Transfer method</span></div>
          <h2>The handover is<br/><em>part of the product.</em></h2>
          <p>A serious asset needs more than a download link. Each approved record makes identity, ownership, condition and transfer legible before private access begins.</p>
          <div className="review-matrix" aria-label="What Mayank reviews">
            <article className="review-point"><span>01 / Seller</span><strong>Identity is checked privately.</strong><p>Public listings can protect personal details while Mayank verifies who is behind the asset.</p></article>
            <article className="review-point"><span>02 / Rights</span><strong>Ownership needs evidence.</strong><p>Repository history, source files, registrar records or original working files support the claim.</p></article>
            <article className="review-point"><span>03 / Reality</span><strong>Condition is written down.</strong><p>What works, what depends on a provider and what is missing remain visible to the buyer.</p></article>
            <article className="review-point"><span>04 / Route</span><strong>Transfer must be plausible.</strong><p>Provider rules, expected duration, access steps and the support window shape the handover.</p></article>
          </div>
        </section>

        <section className="handover" aria-label="Transfer process">
          <div className="handover-track">
            <article className="handover-opening"><span>From idle</span><strong>to acquired.</strong><p>Four records turn an interesting asset into a practical transaction.</p></article>
            <article><span>01 / Identity</span><h3>Know the<br/>seller.</h3><p>The seller is checked privately. Personal contact details stay protected until an enquiry is accepted.</p><div className="method-seal">Private<br/>review</div></article>
            <article><span>02 / Ownership</span><h3>Trace the<br/>work.</h3><p>Repository history, registrar records and original files support the ownership claim.</p><div className="method-lines" aria-hidden="true"><i/><i/><i/><i/></div></article>
            <article><span>03 / Condition</span><h3>See what<br/>remains.</h3><p>Working features, dependencies, missing pieces and exclusions are recorded without cosmetic language.</p><div className="condition-meter"><i/><i/><i/><i/><i/></div></article>
            <article><span>04 / Handover</span><h3>Move with<br/>a route.</h3><p>The buyer receives a defined transfer method, expected duration and support window.</p><div className="handover-mark">M</div></article>
          </div>
        </section>

        <section className="market" id="market">
          <div className="market-head"><div><span>04 / Current index</span><h2>Four assets.<br/>No filler.</h2></div><div><label htmlFor="asset-search">Search the index</label><input id="asset-search" value={query} onChange={(event) => { const nextQuery = event.target.value; setQuery(nextQuery); const next = assets.findIndex((asset) => (assetFilter === "All" || asset.type === assetFilter) && `${asset.name} ${asset.type}`.toLowerCase().includes(nextQuery.toLowerCase())); if (next >= 0) setMarketFocus(next); }} placeholder="Name or category" /></div></div>
          <div className="market-filter" aria-label="Filter assets by category">
            {assetFilters.map((filter) => <button key={filter} type="button" className={assetFilter === filter ? "is-active" : ""} aria-pressed={assetFilter === filter} onClick={() => { setAssetFilter(filter); const next = filter === "All" ? 0 : assets.findIndex((asset) => asset.type === filter); if (next >= 0) setMarketFocus(next); }}>{filter === "All" ? "All records" : filter}</button>)}
          </div>
          <div className="reveal-rule" />
          <div className="market-stage">
            <div className="market-table" role="list">
              {visibleAssets.map((asset) => {
                const index = assets.findIndex((candidate) => candidate.id === asset.id);
                return <button key={asset.id} role="listitem" className={marketFocus === index ? "is-inspecting" : ""} onMouseEnter={() => setMarketFocus(index)} onFocus={() => setMarketFocus(index)} onClick={() => setOverlay(index)}><span>{asset.id}</span><strong>{asset.name}</strong><span>{asset.type}</span><span>{asset.price}</span><span>{asset.status}</span></button>;
              })}
              {visibleAssets.length === 0 && <p className="empty-index">No matching records in the current edition.</p>}
            </div>
            <aside className={`market-lens market-lens-${marketFocus + 1}`} aria-live="polite">
              <div className="lens-head"><span>Active inspection</span><span>{assets[marketFocus].id}</span></div>
              <div className="lens-monogram" aria-hidden="true">{assets[marketFocus].name.charAt(0)}</div>
              <div className="lens-title"><span>{assets[marketFocus].type}</span><h3>{assets[marketFocus].name}</h3></div>
              <div className="lens-measure"><span>{assets[marketFocus].label}</span><strong>{assets[marketFocus].measure}</strong></div>
              <div className="lens-bars" aria-hidden="true">{assets[marketFocus].bars.slice(0, 8).map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
              <div className="lens-route"><span>Transfer route</span><p>{assets[marketFocus].route}</p></div>
              <button type="button" onClick={() => setOverlay(marketFocus)}>Open inspection record</button>
            </aside>
          </div>
        </section>

        <section className="listing" id="list">
          <div className="listing-copy"><span>05 / Founder intake</span><h2>Put the work<br/><em>back to work.</em></h2><p>Start with what the asset is and why it still matters. Ownership and transfer eligibility are reviewed before anything appears publicly.</p><div className="listing-note"><span>Sell or rent</span><span>Private review first</span><span>Nothing publishes automatically</span></div></div>
          <form onSubmit={submitDraft} className={drafted ? "is-complete" : ""}>
            {drafted ? <div className="draft-success"><span>Draft created locally</span><strong>Your asset has not been published or sent.</strong><button type="button" onClick={() => setDrafted(false)}>Create another draft</button></div> : <>
              <div className="form-chapter"><span>01 / Asset</span><strong>Describe what exists.</strong></div>
              <label><span>Asset name</span><input name="asset" required placeholder="What did you build?" /></label>
              <label><span>Category</span><select name="category" required defaultValue=""><option value="" disabled>Select the closest fit</option><option>Complete product</option><option>Code or technical asset</option><option>Domain and identity</option><option>Design system or template</option><option>Provider-dependent asset</option></select></label>
              <div className="form-pair"><label><span>Deal type</span><select name="dealType" required defaultValue=""><option value="" disabled>Sell or rent</option><option>Sell</option><option>Rent or license</option></select></label><label><span>Asset age</span><input name="age" required placeholder="e.g. 18 months" /></label></div>
              <label><span>Asking price in INR</span><input name="price" type="number" min="0" inputMode="numeric" required placeholder="185000" /></label>
              <div className="form-chapter"><span>02 / Evidence</span><strong>State what works today.</strong></div>
              <label><span>Present condition</span><textarea name="condition" required placeholder="What works today, and what needs attention?" /></label>
              <label><span>Available metrics</span><textarea name="metrics" placeholder="Traffic, active users, followers, engagement, remaining credits or another useful measure" /></label>
              <label><span>Transfer readiness</span><select name="transfer" required defaultValue=""><option value="" disabled>Choose the most accurate statement</option><option>I own the asset and can transfer it</option><option>I own it but need transfer guidance</option><option>Transfer depends on provider approval</option></select></label>
              <label><span>Images or short video</span><input name="media" type="file" accept="image/*,video/*" multiple /></label>
              <div className="form-chapter"><span>03 / Contact</span><strong>Keep the first review private.</strong></div>
              <div className="form-pair"><label><span>Seller name</span><input name="seller" required placeholder="First name is enough" /></label><label><span>Contact preference</span><select name="contact" required defaultValue=""><option value="" disabled>Email or WhatsApp</option><option>Email</option><option>WhatsApp</option></select></label></div>
              <label><span>Professional email</span><input name="email" type="email" required placeholder="name@company.com" /></label>
              <label className="eligibility-confirm"><input name="eligibility" type="checkbox" required /><span>I confirm that I have the right to offer this asset and understand that provider-dependent assets require separate eligibility review.</span></label>
              <button className="submit-draft" type="submit">Create private review draft</button>
            </>}
          </form>
        </section>

        <section className="closing">
          <p className="closing-kicker">The useful part can continue.</p>
          <div className="closing-word">MAYANK</div>
          <div className="closing-foot"><p>Startup-built assets, ready for their next operator.</p><div className="closing-actions"><a href="#market">Browse the market</a><a href="#list">List an asset</a><a href="#top">Return to the beginning</a></div></div>
        </section>
      </main>
      <footer><div><strong>MAYANK</strong><span>Independent digital asset exchange</span></div><nav><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/restricted-assets">Restricted assets</Link></nav><div className="footer-status"><span>Edition 01 / Pre-launch record</span><strong>Founder details pending verification.</strong><span>Contact route will be published before launch.</span></div></footer>
      {overlay !== null && <AssetOverlay index={overlay} close={() => setOverlay(null)} move={(index) => setOverlay((index + assets.length) % assets.length)} />}
    </>
  );
}
