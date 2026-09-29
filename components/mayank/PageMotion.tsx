"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll";

// Shared motion vocabulary for inner pages, driven by data attributes:
//   .cut-title      headline lines rise out of a crop
//   [data-rise]     first-screen copy lifts in after the title
//   [data-reveal]   later content lifts in as it enters the viewport
//   [data-rule]     rules draw left to right
//   [data-crop]     images open from an inset crop
//   [data-count]    registers count up to their value
export function PageMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.add("motion-ready");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const layer = document.querySelector<HTMLElement>(".transition-layer");
    const delay = layer && getComputedStyle(layer).visibility === "visible" ? 0.55 : 0.1;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay });
      intro.fromTo(".cut-title > span > *", { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: 0.09, ease: "power4.out" })
        .fromTo("[data-rise]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "power3.out" }, "-=.7");

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count);
        const counter = { value: 0 };
        intro.to(counter, { value: target, duration: 1.1, ease: "power2.out", onUpdate: () => { element.textContent = String(Math.round(counter.value)); } }, 0.3);
      });

      gsap.utils.toArray<HTMLElement>("[data-crop]").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(14% 10% 14% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: element, start: "top 88%" }, delay: element.getBoundingClientRect().top < window.innerHeight ? delay + 0.2 : 0 });
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((element) => {
        gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 90%" } });
      });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });
    });
    root.classList.add("motion-ready");
    return () => context.revert();
  }, []);
  return null;
}
