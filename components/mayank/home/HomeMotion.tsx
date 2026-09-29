"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll";

export function HomeMotion() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const visited = root.dataset.visited === "1";
    try { window.sessionStorage.setItem("mayank-visited", "1"); } catch { /* private mode */ }

    if (prefersReducedMotion()) {
      gsap.set(".site-loader", { display: "none" });
      root.classList.add("motion-ready");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const layer = document.querySelector<HTMLElement>(".transition-layer");
    const arriving = layer && getComputedStyle(layer).visibility === "visible";

    const context = gsap.context(() => {
      const entrance = gsap.timeline({ delay: visited ? (arriving ? 0.5 : 0.1) : 0 });
      if (!visited) {
        gsap.set(".leaf-letter", { opacity: 0, scale: 0.82 });
        entrance.fromTo(".archive-leaf", { x: (index) => (index - 2.5) * 150, y: (index) => Math.abs(index - 2.5) * 34, rotate: (index) => (index - 2.5) * 7, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.05, stagger: 0.075, ease: "power4.out" })
          .to(".archive-leaf.is-front .leaf-letter", { opacity: 1, scale: 1, duration: 0.52, ease: "power3.out" }, "-=.25")
          .to(".archive-leaf", { x: (index) => (index - 2.5) * Math.min(185, window.innerWidth * 0.105), scaleY: 0.72, duration: 1.05, stagger: 0.03, ease: "power3.inOut" }, "+=.55")
          .to(".archive-leaf:not(.is-front) .leaf-letter", { opacity: 1, scale: 1, duration: 0.62, stagger: 0.055, ease: "power3.out" }, "<.2")
          .fromTo(".loader-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.inOut" }, "<")
          .to(".site-loader", { clipPath: "inset(0 0 100% 0)", duration: 1.15, ease: "power4.inOut" }, "+=.45")
          .set(".site-loader", { display: "none" })
          .addLabel("hero", "-=.85");
      } else {
        gsap.set(".site-loader", { display: "none" });
        entrance.addLabel("hero", 0);
      }
      entrance.fromTo(".hero-visual", { clipPath: "inset(16% 12% 16% 12%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.45, ease: "power4.out" }, "hero")
        .fromTo(".hero-line > span", { yPercent: 120 }, { yPercent: 0, duration: 1.05, stagger: 0.08, ease: "power4.out" }, "hero+=.3")
        .fromTo(".hero-statement > p, .hero-topline > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" }, "hero+=.55")
        .fromTo(".hero-actions > a", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }, "hero+=.7")
        .fromTo(".hero-proof > *", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07 }, "hero+=.8");

      gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".home", start: "top top", end: "bottom bottom", scrub: 0.15 } });

      // Hero journey: the statement leaves, the archive expands, a live record opens over it.
      gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 1.25 } })
        .to(".hero-statement", { xPercent: -22, opacity: 0, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(".hero-visual", { left: "0vw", width: "100vw", duration: 1.45, ease: "power3.inOut" }, 0)
        .to(".hero-visual img", { scale: 1.1, yPercent: 3, duration: 1.45, ease: "power2.inOut" }, 0)
        .to(".hero-visual-index", { opacity: 0, duration: 0.45 }, 0.15)
        .to(".hero-proof", { yPercent: 105, opacity: 0, duration: 0.75, ease: "power2.in" }, 0.08)
        .fromTo(".hero-live-record", { clipPath: "inset(100% 0 0 0)", yPercent: 14 }, { clipPath: "inset(0% 0 0 0)", yPercent: 0, duration: 1.4, ease: "power4.inOut" }, 1.12)
        .set(".hero-live-record", { pointerEvents: "auto" }, 1.2)
        .fromTo(".hero-record-head > *, .hero-record-foot > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, 1.75)
        .fromTo(".hero-live-product", { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.85, ease: "power3.out" }, 1.62);

      // Why: the archive photograph opens from a crop while the manifesto brightens line by line.
      gsap.timeline({ scrollTrigger: { trigger: ".why", start: "top 85%", end: "center 45%", scrub: 1.1 } })
        .fromTo(".why-image", { clipPath: "inset(14% 12% 14% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut" }, 0)
        .fromTo(".why-image img", { scale: 1.16, yPercent: -6 }, { scale: 1.02, yPercent: 4, ease: "none" }, 0);
      gsap.utils.toArray<HTMLElement>(".manifesto-line").forEach((line) => {
        gsap.fromTo(line, { opacity: 0.14 }, { opacity: 1, scrollTrigger: { trigger: line, start: "top 78%", end: "bottom 56%", scrub: 0.8 } });
      });

      gsap.utils.toArray<HTMLElement>(".section-head").forEach((head) => {
        gsap.fromTo(head.querySelectorAll(".label, h2, .section-head-aside > *"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: head, start: "top 82%" } });
      });

      gsap.fromTo(".live-index .asset-rows li", { clipPath: "inset(0 0 100% 0)", y: 22 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".live-index .asset-rows", start: "top 82%" } });

      // Category leaves rise like the loader's archive leaves.
      gsap.fromTo(".leaf", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.05, stagger: 0.07, ease: "power4.inOut", scrollTrigger: { trigger: ".leaves", start: "top 82%" } });

      gsap.timeline({ scrollTrigger: { trigger: ".edition-carousel", start: "top 82%", end: "center 58%", scrub: 1 } })
        .fromTo(".edition-head > *", { y: 38, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" }, 0)
        .fromTo(".carousel-viewport", { clipPath: "inset(0 0 0 18%)", x: 90 }, { clipPath: "inset(0 0 0 0%)", x: 0, duration: 1.2, ease: "power4.inOut" }, 0.15);
      gsap.fromTo(".cutout-specimen", { yPercent: -5 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".edition-carousel", start: "top bottom", end: "bottom top", scrub: 1.15 } });

      const media = gsap.matchMedia();
      media.add("(min-width: 981px)", () => {
        const track = document.querySelector<HTMLElement>(".handover-track");
        if (!track) return;
        gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: "none", scrollTrigger: { trigger: ".handover", start: "top top", end: () => `+=${track.scrollWidth - window.innerWidth}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
      });
      media.add("(max-width: 980px)", () => {
        gsap.utils.toArray<HTMLElement>(".handover article").forEach((article) => {
          gsap.fromTo(article.children, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: article, start: "top 78%" } });
        });
      });

      gsap.timeline({ scrollTrigger: { trigger: ".seller-band", start: "top 78%" } })
        .fromTo(".seller-copy > *", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" })
        .fromTo(".seller-steps li", { clipPath: "inset(0 100% 0 0)", x: 24 }, { clipPath: "inset(0 0% 0 0)", x: 0, duration: 0.7, stagger: 0.1, ease: "power3.inOut" }, 0.2)
        .fromTo(".seller-actions > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, 0.6);

      gsap.fromTo(".closing-word", { letterSpacing: "-.12em", scale: 0.65 }, { letterSpacing: "-.055em", scale: 1, ease: "none", scrollTrigger: { trigger: ".closing", start: "top bottom", end: "center center", scrub: 1.2 } });
    });
    root.classList.add("motion-ready");
    return () => context.revert();
  }, []);
  return null;
}
