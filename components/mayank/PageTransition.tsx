"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAsset } from "@/lib/assets";
import { jumpToTop, prefersReducedMotion, resizeScroll } from "@/lib/scroll";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

const routeLabels: Record<string, string> = {
  "/": "Mayank / Edition 01",
  "/market": "Market / Current index",
  "/sell": "Sell / Private listing",
  "/how-it-works": "Method / How it works",
  "/terms": "Governance / Terms",
  "/privacy": "Governance / Privacy",
  "/restricted-assets": "Standard / Restricted assets",
};

function labelFor(pathname: string) {
  if (routeLabels[pathname]) return routeLabels[pathname];
  const asset = pathname.startsWith("/market/") ? getAsset(pathname.split("/")[2]) : undefined;
  return asset ? `${asset.id} / ${asset.name}` : "Mayank";
}

// The six archive leaves from the loader return as the page shutter: they rise
// to cover the current page, name the destination, then lift away.
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const safety = useRef<number | undefined>(undefined);

  const reveal = useCallback(() => {
    const layer = layerRef.current;
    if (!layer) return;
    window.clearTimeout(safety.current);
    pending.current = false;
    resizeScroll();
    ScrollTrigger.refresh();
    const hash = window.location.hash.slice(1);
    jumpToTop(hash ? document.getElementById(hash) : null);
    document.getElementById("main")?.focus({ preventScroll: true });
    gsap.timeline({ delay: 0.12 })
      .to(labelRef.current, { opacity: 0, y: -10, duration: 0.22, ease: "power2.in" })
      .to(layer.querySelectorAll(".transition-leaf"), { yPercent: -100, duration: 0.62, stagger: 0.045, ease: "power3.inOut" }, "<.05")
      .set(layer, { visibility: "hidden" });
  }, []);

  const navigate = useCallback<Navigate>((href, label) => {
    const url = new URL(href, window.location.href);
    const samePath = url.pathname === window.location.pathname;
    const layer = layerRef.current;
    if (samePath || prefersReducedMotion() || !layer || pending.current) {
      router.push(href, { scroll: !samePath });
      return;
    }
    pending.current = true;
    if (labelRef.current) labelRef.current.textContent = label ?? labelFor(url.pathname);
    gsap.killTweensOf(layer.querySelectorAll(".transition-leaf"));
    gsap.timeline()
      .set(layer, { visibility: "visible" })
      .fromTo(layer.querySelectorAll(".transition-leaf"), { yPercent: 100 }, { yPercent: 0, duration: 0.55, stagger: 0.045, ease: "power3.inOut" })
      .fromTo(labelRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, "-=.18")
      .add(() => {
        router.push(href);
        safety.current = window.setTimeout(reveal, 4000);
      });
  }, [reveal, router]);

  useEffect(() => {
    if (pending.current) reveal();
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div className="transition-layer" ref={layerRef} aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <i className="transition-leaf" key={index} />)}
        <span className="transition-label" ref={labelRef} />
      </div>
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { href: string; label?: string };

export function TransitionLink({ href, label, onClick, children, ...rest }: TransitionLinkProps) {
  const navigate = useContext(TransitionContext);
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (!navigate || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || rest.target === "_blank") return;
    event.preventDefault();
    navigate(href, label);
  }
  return <Link href={href} onClick={handleClick} {...rest}>{children}</Link>;
}
