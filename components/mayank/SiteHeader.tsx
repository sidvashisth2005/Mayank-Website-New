"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "./PageTransition";
import { jumpToTop, lockScroll } from "@/lib/scroll";

const primary = [
  { href: "/market", label: "Market" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/restricted-assets", label: "Standards" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Coloured bands marked data-header-tone="light" take a plain paper header;
  // everywhere else the difference blend keeps it legible on paper and ink.
  useEffect(() => {
    const header = headerRef.current;
    const bands = Array.from(document.querySelectorAll<HTMLElement>("[data-header-tone=\"light\"]"));
    header?.classList.remove("is-light");
    if (!header || !bands.length) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)));
      header.classList.toggle("is-light", visible.size > 0);
    }, { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - 40)}px 0px` });
    bands.forEach((band) => observer.observe(band));
    return () => observer.disconnect();
  }, [pathname]);
  const [open, setOpen] = useState(false);

  function setMenu(next: boolean) {
    setOpen(next);
    lockScroll(next);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      lockScroll(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function onWordmark(event: MouseEvent<HTMLAnchorElement>) {
    if (open) setMenu(false);
    if (pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(null, "", "/");
    jumpToTop();
    ScrollTrigger.update();
    window.requestAnimationFrame(() => ScrollTrigger.update());
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header ref={headerRef} className={`site-header${open ? " is-menu-open" : ""}`}>
        <TransitionLink className="wordmark" href="/" onClick={onWordmark} aria-label="Mayank, home">MAYANK</TransitionLink>
        <nav className="site-nav" aria-label="Primary navigation">
          {primary.map((item) => (
            <TransitionLink key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</TransitionLink>
          ))}
        </nav>
        <TransitionLink className="header-cta" href="/sell" aria-current={isActive("/sell") ? "page" : undefined}>List an asset</TransitionLink>
        <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="site-menu" onClick={() => setMenu(!open)}>{open ? "Close" : "Menu"}</button>
      </header>
      <div className="site-menu" id="site-menu" data-open={open} aria-hidden={!open} inert={!open}>
        <i /><i /><i />
        <nav aria-label="Menu">
          <span>Mayank / Edition 01</span>
          <TransitionLink href="/market" onClick={() => setMenu(false)}>Browse the market</TransitionLink>
          <TransitionLink href="/sell" onClick={() => setMenu(false)}>List an asset</TransitionLink>
          <TransitionLink href="/how-it-works" onClick={() => setMenu(false)}>How it works</TransitionLink>
          <div className="site-menu-minor">
            <TransitionLink href="/restricted-assets" onClick={() => setMenu(false)}>Restricted assets</TransitionLink>
            <TransitionLink href="/terms" onClick={() => setMenu(false)}>Terms</TransitionLink>
            <TransitionLink href="/privacy" onClick={() => setMenu(false)}>Privacy</TransitionLink>
          </div>
        </nav>
      </div>
    </>
  );
}
