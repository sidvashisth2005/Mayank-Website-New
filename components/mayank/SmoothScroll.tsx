"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.95 });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    // Keep the scroll limit in step with route changes and late layout.
    const resize = () => lenis.resize();
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    ScrollTrigger.addEventListener("refresh", resize);
    return () => {
      observer.disconnect();
      ScrollTrigger.removeEventListener("refresh", resize);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
