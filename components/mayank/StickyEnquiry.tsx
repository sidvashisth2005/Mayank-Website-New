"use client";

import { useEffect, useState } from "react";
import { ScrollLink } from "./ScrollLink";

// Phones only: once the record sheet has scrolled away, the price and the
// enquiry action stay within thumb reach. Hidden while the form is on screen.
export function StickyEnquiry({ price, label }: { price: string; label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const sheet = document.querySelector(".record-sheet");
    const form = document.getElementById("enquire");
    if (!sheet || !form) return;
    const seen = { sheet: true, form: false };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === sheet) seen.sheet = entry.isIntersecting || entry.boundingClientRect.top > 0;
        if (entry.target === form) seen.form = entry.isIntersecting;
      });
      setShow(!seen.sheet && !seen.form);
    });
    observer.observe(sheet);
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="sticky-enquiry" data-show={show} aria-hidden={!show} inert={!show}>
      <span><small>Asking</small><strong>{price}</strong></span>
      <ScrollLink target="enquire" className="btn btn-accent">{label}<span>No payment taken</span></ScrollLink>
    </div>
  );
}
