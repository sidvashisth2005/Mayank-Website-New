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
  "/sign-in": "Account / Sign in",
  "/sign-up": "Account / New member",
  "/dashboard": "Desk / Overview",
  "/dashboard/listings": "Desk / Listings",
  "/dashboard/enquiries": "Desk / Enquiries",
  "/dashboard/saved": "Desk / Saved",
  "/dashboard/settings": "Desk / Settings",
  "/admin": "Review desk / Queue",
};

function labelFor(pathname: string) {
  const path = pathname.split("?")[0];
  if (routeLabels[path]) return routeLabels[path];
  if (path.startsWith("/dashboard/listings/")) return "Desk / Record";
  if (path.startsWith("/admin/")) return "Review desk / Record";
  if (path.startsWith("/market/member/")) return "Market / Member listing";
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
    const hash = window.location.hash.slice(1);
    resizeScroll();
    jumpToTop(hash ? document.getElementById(hash) : null);
    ScrollTrigger.refresh();
    ScrollTrigger.update();
    // Scrubbed timelines ease towards the scroll position; finish that catch-up
    // now so the page opens in its resting state (the hero, fully composed).
    ScrollTrigger.getAll().forEach((trigger) => {
      const tween = trigger.getTween() as unknown;
      if (tween && typeof (tween as gsap.core.Tween).progress === "function") (tween as gsap.core.Tween).progress(1);
    });
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
        // Leave the old page at the top while the leaves cover it, so the next
        // page builds its scroll animations from the top, not from the old offset.
        if (!url.hash) jumpToTop();
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

// Programmatic navigation with the same leaf transition as TransitionLink.
export function usePageTransition() {
  const navigate = useContext(TransitionContext);
  const router = useRouter();
  return { navigate: navigate ?? ((href: string) => router.push(href)) };
}
