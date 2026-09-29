"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { TransitionLink } from "../PageTransition";
import { assets, editionPicks, formatPrice } from "@/lib/assets";
import { prefersReducedMotion } from "@/lib/scroll";

const picks = editionPicks.map((slug) => assets.find((asset) => asset.slug === slug)!);

export function TransferReel() {
  const [index, setIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  function goTo(target: number) {
    const next = (target + picks.length) % picks.length;
    const viewport = viewportRef.current;
    const slide = viewport?.children.item(next) as HTMLElement | null;
    setIndex(next);
    if (!viewport || !slide) return;
    viewport.scrollTo({ left: slide.offsetLeft - viewport.offsetLeft, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }

  return (
    <section className="edition-carousel" aria-roledescription="carousel" aria-label="Edition picks">
      <div className="edition-head">
        <div><span>Edition 01 / Transfer reel</span><h2>Four picks,<br /><em>cut from real work.</em></h2></div>
        <p>A compact view of what actually transfers, not a gallery of logos. Move through the edition to compare condition, price and handover route.</p>
        <div className="carousel-controls">
          <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(picks.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => goTo(index - 1)}>Previous record</button>
          <button type="button" onClick={() => goTo(index + 1)}>Next record</button>
        </div>
      </div>
      <div
        className="carousel-viewport"
        ref={viewportRef}
        onScroll={(event) => {
          const viewport = event.currentTarget;
          const slides = Array.from(viewport.children) as HTMLElement[];
          const nearest = slides.reduce((best, slide, slideIndex) => Math.abs(slide.offsetLeft - viewport.offsetLeft - viewport.scrollLeft) < Math.abs(slides[best].offsetLeft - viewport.offsetLeft - viewport.scrollLeft) ? slideIndex : best, 0);
          if (nearest !== index) setIndex(nearest);
        }}
      >
        {picks.map((asset, slideIndex) => (
          <article className={`carousel-card carousel-card-${slideIndex + 1}`} key={asset.slug} aria-label={`${asset.name}, ${asset.type}`}>
            <div className="carousel-card-copy">
              <span>{asset.id} / {asset.type}</span>
              <h3>{asset.name}</h3>
              <p>{asset.description}</p>
              <TransitionLink href={`/market/${asset.slug}`}>Inspect full record</TransitionLink>
            </div>
            <div className="carousel-card-facts">
              <span>Condition <strong>{asset.review}</strong></span>
              <span>Asking <strong>{formatPrice(asset)}</strong></span>
              <span>Route <strong>{asset.route}</strong></span>
            </div>
            <figure className={`cutout-specimen cutout-specimen-${slideIndex + 1}`} style={{ position: "absolute" }}>
              <Image src={slideIndex % 2 === 0 ? "/archive-detail.webp" : "/archive-object.webp"} alt="" fill sizes="(max-width: 640px) 70vw, 36vw" />
              <figcaption><span>Transfer specimen</span><strong>{String(slideIndex + 1).padStart(2, "0")}</strong></figcaption>
            </figure>
          </article>
        ))}
      </div>
    </section>
  );
}
