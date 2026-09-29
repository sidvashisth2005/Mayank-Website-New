"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { lockScroll, prefersReducedMotion } from "@/lib/scroll";

// performance.now() at which the loader starts lifting off the page.
let revealAt = 0;

// Seconds until the loader uncovers the page; pages start their entrance then.
export function loaderRemaining() {
  return typeof performance === "undefined" ? 0 : Math.max(0, (revealAt - performance.now()) / 1000);
}

// Lives in the root layout, so it plays on every full page load (including a
// browser reload) and never on navigation inside the site.
export function SiteLoader() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(".site-loader", { display: "none" });
      return;
    }
    lockScroll(true);
    gsap.set(".leaf-letter", { opacity: 0, scale: 0.82 });
    const timeline = gsap.timeline({ onComplete: () => lockScroll(false) })
      .fromTo(".archive-leaf", { x: (index) => (index - 2.5) * 150, y: (index) => Math.abs(index - 2.5) * 34, rotate: (index) => (index - 2.5) * 7, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.05, stagger: 0.075, ease: "power4.out" })
      .to(".archive-leaf.is-front .leaf-letter", { opacity: 1, scale: 1, duration: 0.52, ease: "power3.out" }, "-=.25")
      .to(".archive-leaf", { x: (index) => (index - 2.5) * Math.min(185, window.innerWidth * 0.105), scaleY: 0.72, duration: 1.05, stagger: 0.03, ease: "power3.inOut" }, "+=.55")
      .to(".archive-leaf:not(.is-front) .leaf-letter", { opacity: 1, scale: 1, duration: 0.62, stagger: 0.055, ease: "power3.out" }, "<.2")
      .fromTo(".loader-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, "<")
      .addLabel("lift", "+=.45")
      .to(".site-loader", { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "power4.inOut" }, "lift")
      .set(".site-loader", { display: "none" });
    revealAt = performance.now() + timeline.labels.lift * 1000;
    return () => {
      timeline.kill();
      lockScroll(false);
    };
  }, []);

  return (
    <div className="site-loader" aria-hidden="true">
      <div className="loader-register"><span>Edition 01</span><span>Useful work / Registered</span></div>
      <div className="loader-archive">
        {"MAYANK".split("").map((letter, index) => <i key={index} className={`archive-leaf${index === 0 ? " is-front" : ""}`}><span className="leaf-letter">{letter}</span></i>)}
      </div>
      <div className="loader-rule" />
    </div>
  );
}
