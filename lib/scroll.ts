import type Lenis from "lenis";

// One shared handle so any component can jump, lock or scroll without
// fighting the smooth-scroll instance.
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function jumpToTop(target?: HTMLElement | null) {
  const top = target ? target.getBoundingClientRect().top + window.scrollY - 96 : 0;
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(top, { immediate: true, force: true });
    return;
  }
  // `behavior: "auto"` still inherits the global smooth-scroll rule. Force a
  // true jump so pinned ScrollTrigger sections cannot leave an offset behind.
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previous;
}

export function scrollToElement(target: HTMLElement, offset = -96) {
  if (lenis) {
    lenis.resize();
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.classList.toggle("is-scroll-locked", locked);
}

export function resizeScroll() {
  lenis?.resize();
}
