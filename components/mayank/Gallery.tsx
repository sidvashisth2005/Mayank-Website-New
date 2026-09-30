"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { lockScroll } from "@/lib/scroll";

type Shot = { src: string; alt: string };

// Screens of a record: a main shot with thumbnails, and a full-screen viewer
// with arrows, dots, keyboard (←, →, Esc) and swipe.
export function Gallery({ shots, name }: { shots: Shot[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const go = useCallback((index: number) => setActive((index + shots.length) % shots.length), [shots.length]);

  const close = useCallback(() => {
    setOpen(false);
    lockScroll(false);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") setActive((index) => (index + 1) % shots.length);
      if (event.key === "ArrowLeft") setActive((index) => (index - 1 + shots.length) % shots.length);
      // Keep Tab inside the viewer while it is open.
      if (event.key === "Tab" && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button")];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, shots.length]);

  const openAt = (index: number) => {
    setActive(index);
    setOpen(true);
    lockScroll(true);
  };

  return (
    <div className="gallery">
      <button ref={openerRef} type="button" className="gallery-main" onClick={() => openAt(active)} aria-label={`Open ${shots[active].alt} full screen`}>
        <Image src={shots[active].src} alt={shots[active].alt} fill sizes="(max-width: 980px) 94vw, 60vw" priority={active === 0} />
        <span className="gallery-expand">View full screen</span>
      </button>
      <div className="gallery-thumbs" role="group" aria-label={`${name} screens`}>
        {shots.map((shot, index) => (
          <button key={shot.src} type="button" aria-label={`Show ${shot.alt}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)}>
            <Image src={shot.src} alt="" fill sizes="(max-width: 980px) 30vw, 18vw" />
          </button>
        ))}
      </div>

      {open && createPortal(
        <div
          ref={dialogRef}
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} screens`}
          onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => {
            if (touchX.current === null) return;
            const delta = event.changedTouches[0].clientX - touchX.current;
            if (Math.abs(delta) > 40) go(active + (delta < 0 ? 1 : -1));
            touchX.current = null;
          }}
        >
          <div className="lightbox-bar">
            <span>{name} / {shots[active].alt}</span>
            <span>{String(active + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}</span>
            <button ref={closeRef} type="button" onClick={close}>Close</button>
          </div>
          <div className="lightbox-stage">
            <Image src={shots[active].src} alt={shots[active].alt} fill sizes="100vw" />
          </div>
          <div className="lightbox-pager">
            <button type="button" className="carousel-arrow" aria-label="Previous screen" onClick={() => go(active - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: "scaleX(-1)" }}><path d="M3 12 H20 M14 6 L20 12 L14 18" /></svg>
            </button>
            <div className="carousel-dots" role="group" aria-label="Choose a screen">
              {shots.map((shot, index) => <button key={shot.src} type="button" aria-label={`Show ${shot.alt}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}
            </div>
            <button type="button" className="carousel-arrow" aria-label="Next screen" onClick={() => go(active + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12 H20 M14 6 L20 12 L14 18" /></svg>
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
