"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll";
import { loaderRemaining } from "./SiteLoader";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/";

// Registration effect: characters cycle through the archive's glyph set and
// settle left to right, like a record being stamped.
function scramble(element: HTMLElement, delay = 0) {
  const text = element.textContent ?? "";
  const state = { progress: 0 };
  return gsap.to(state, {
    progress: 1,
    duration: Math.min(0.9, 0.25 + text.length * 0.018),
    delay,
    ease: "none",
    onUpdate: () => {
      const settled = Math.floor(state.progress * text.length);
      element.textContent = text
        .split("")
        .map((char, index) => (index < settled || char === " " ? char : GLYPHS[(index * 7 + Math.floor(state.progress * 40)) % GLYPHS.length]))
        .join("");
    },
    onComplete: () => { element.textContent = text; },
  });
}

function strokeLength(shape: SVGGeometryElement) {
  try {
    return Math.ceil(shape.getTotalLength() || 0);
  } catch {
    return 0;
  }
}

function drawIn(svg: Element, delay = 0) {
  // Hidden SVGs (display: none at this breakpoint) cannot be measured.
  if (!svg.getClientRects().length) return;
  const shapes = Array.from(svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon, rect, circle"))
    .filter((shape) => typeof shape.getTotalLength === "function" && shape.getAttribute("fill") !== "currentColor" && strokeLength(shape) > 0);
  if (!shapes.length) return;
  shapes.forEach((shape) => {
    const length = strokeLength(shape);
    gsap.set(shape, { strokeDasharray: length, strokeDashoffset: length });
  });
  return gsap.to(shapes, { strokeDashoffset: 0, duration: 1.3, stagger: 0.02, delay, ease: "power2.inOut", onComplete: () => { gsap.set(shapes, { clearProps: "strokeDasharray,strokeDashoffset" }); } });
}

// Shared motion vocabulary for inner pages, driven by data attributes:
//   .cut-title      headline lines rise out of a crop
//   [data-rise]     first-screen copy lifts in after the title
//   [data-reveal]   later content lifts in as it enters the viewport
//   [data-rule]     rules draw left to right
//   [data-crop]     images open from an inset crop
//   [data-count]    figures count up (data-prefix, data-suffix, data-decimals)
//   [data-scramble] mono labels decode once
//   [data-draw]     line drawings draw their strokes on reveal
//   [data-tilt]     a surface rises from a tilted plane to flat on scroll
export function PageMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.add("motion-ready");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const layer = document.querySelector<HTMLElement>(".transition-layer");
    const waiting = loaderRemaining();
    const delay = waiting > 0 ? Math.max(0.1, waiting - 0.25) : layer && getComputedStyle(layer).visibility === "visible" ? 0.55 : 0.1;
    const inView = (element: Element) => element.getBoundingClientRect().top < window.innerHeight;

    const context = gsap.context(() => {
      const intro = gsap.timeline({ delay });
      intro.fromTo(".cut-title > span > *", { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: 0.09, ease: "power4.out" })
        .fromTo("[data-rise]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "power3.out" }, "-=.7");

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const target = Number(element.dataset.count);
        const decimals = Number(element.dataset.decimals ?? 0);
        const format = (value: number) => `${element.dataset.prefix ?? ""}${value.toFixed(decimals)}${element.dataset.suffix ?? ""}`;
        const counter = { value: 0 };
        element.textContent = format(0);
        gsap.to(counter, { value: target, duration: 1.4, delay: inView(element) ? delay + 0.35 : 0, ease: "power2.out", onUpdate: () => { element.textContent = format(counter.value); }, scrollTrigger: inView(element) ? undefined : { trigger: element, start: "top 90%" } });
      });

      gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((element) => {
        if (inView(element)) scramble(element, delay + 0.2);
        else ScrollTrigger.create({ trigger: element, start: "top 90%", once: true, onEnter: () => scramble(element) });
      });

      gsap.utils.toArray<Element>("[data-draw]").forEach((svg) => {
        if (inView(svg)) drawIn(svg, delay + 0.25);
        else ScrollTrigger.create({ trigger: svg, start: "top 92%", once: true, onEnter: () => drawIn(svg) });
      });

      gsap.utils.toArray<HTMLElement>("[data-crop]").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(14% 10% 14% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: element, start: "top 88%" }, delay: inView(element) ? delay + 0.2 : 0 });
      });

      gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((element) => {
        gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 1.1, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 90%" } });
      });

      // Stamps are pressed on: they arrive large, rotate into place and land hard.
      gsap.utils.toArray<HTMLElement>("[data-stamp]").forEach((element) => {
        const press = { scale: 1, rotate: 0, opacity: 1, duration: 0.42, ease: "power4.in", delay: inView(element) ? delay + 0.6 : 0 };
        gsap.fromTo(element, { scale: 1.5, rotate: 8, opacity: 0 }, { ...press, rotate: Number(element.dataset.stamp || 0), scrollTrigger: inView(element) ? undefined : { trigger: element, start: "top 85%" } });
      });

      // Strike-throughs draw across a row as it enters, like an entry being ruled out.
      gsap.utils.toArray<HTMLElement>("[data-strike]").forEach((element) => {
        gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left", duration: 0.9, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 82%" } });
      });

      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: true }),
      });

      const media = gsap.matchMedia();
      media.add("(min-width: 981px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((element) => {
          gsap.fromTo(element, { rotateX: 20, scale: 0.9, y: 60, transformPerspective: 1400, transformOrigin: "50% 100%" }, { rotateX: 0, scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: element, start: "top 98%", end: "top 30%", scrub: 1 } });
        });
      });
    });
    root.classList.add("motion-ready");
    return () => context.revert();
  }, []);
  return null;
}
