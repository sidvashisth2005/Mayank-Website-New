"use client";

import { useEffect, type RefObject } from "react";

// Marks a sticky bar with `is-stuck` while it is pinned under the header, so
// it can mask the page behind the transparent header only when it needs to.
export function useStuck(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "height:1px;margin-bottom:-1px;pointer-events:none";
    element.parentNode?.insertBefore(sentinel, element);
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 76;
    const observer = new IntersectionObserver(([entry]) => {
      element.classList.toggle("is-stuck", !entry.isIntersecting && entry.boundingClientRect.top < header);
    }, { rootMargin: `-${header + 1}px 0px 0px 0px` });
    observer.observe(sentinel);
    return () => { observer.disconnect(); sentinel.remove(); };
  }, [ref]);
}
