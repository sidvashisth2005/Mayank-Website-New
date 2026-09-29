"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TransitionLink } from "./PageTransition";
import { Drawing } from "./visuals/Drawings";
import { prefersReducedMotion } from "@/lib/scroll";

const tracks = {
  buyer: {
    label: "I want to buy or rent",
    cta: { href: "/market", text: "Browse the market" },
    steps: [
      ["Browse the index", "Filter by category, deal type and availability. Every record shows price, condition and transfer route up front."],
      ["Inspect the record", "Try the working sample, read the condition ledger and see exactly what transfers and what does not."],
      ["Send a private enquiry", "Your enquiry reaches the review desk first. Seller contact details stay private until it is accepted."],
      ["Review evidence and agree", "Access to repositories, registrar proof or files follows. Terms are agreed directly with the seller."],
      ["Take over with a route", "The asset moves by its documented route, inside the stated support window."],
    ],
  },
  seller: {
    label: "I want to sell or rent",
    cta: { href: "/sell", text: "List an asset" },
    steps: [
      ["Describe the asset", "Name, category, condition, terms and up to four images. The listing form saves your draft as you go."],
      ["Private review", "Mayank checks identity, ownership evidence, stated condition and whether the transfer route is plausible."],
      ["Publish the record", "Only reviewed assets enter the index. Your personal contact details never appear on the public record."],
      ["Receive introductions", "Enquiries are screened before they reach you, with the buyer's intent and budget attached."],
      ["Hand over", "Transfer the asset by its documented route and support the buyer through the agreed window."],
    ],
  },
} as const;

type Track = keyof typeof tracks;

const drawingsFor: Record<Track, string[]> = { buyer: ["search", "evidence", "contact", "ownership", "route"], seller: ["asset", "identity", "publish", "contact", "provider"] };

export function TrackToggle() {
  const [track, setTrack] = useState<Track>("buyer");
  const listRef = useRef<HTMLOListElement>(null);
  const current = tracks[track];

  useLayoutEffect(() => {
    if (!listRef.current || prefersReducedMotion()) return;
    const tween = gsap.fromTo(listRef.current.children, { clipPath: "inset(0 0 100% 0)", y: 18 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" });
    return () => { tween.revert(); };
  }, [track]);

  return (
    <div className="track">
      <div className="segmented segmented-large" role="tablist" aria-label="Choose a track">
        {(Object.keys(tracks) as Track[]).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={track === key} aria-controls="track-panel" onClick={() => setTrack(key)}>{tracks[key].label}</button>
        ))}
      </div>
      <ol className="track-steps" id="track-panel" role="tabpanel" ref={listRef}>
        {current.steps.map(([title, copy], index) => (
          <li key={`${track}-${title}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p><Drawing name={drawingsFor[track][index]} className="track-drawing" /></li>
        ))}
      </ol>
      <TransitionLink className="btn btn-solid" href={current.cta.href}>{current.cta.text}<span>{track === "buyer" ? "Sample edition" : "Private review first"}</span></TransitionLink>
    </div>
  );
}
