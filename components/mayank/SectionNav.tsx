"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToElement } from "@/lib/scroll";
import { useStuck } from "./useStuck";

// Sticky index of a record's sections with a reading-progress rule.
export function SectionNav({ sections }: { sections: [string, string][] }) {
  const [active, setActive] = useState(sections[0][0]);
  const barRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useStuck(navRef);

  useEffect(() => {
    const targets = sections.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -60% 0px" });
    targets.forEach((target) => observer.observe(target));

    const first = targets[0], last = targets[targets.length - 1];
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!first || !last || !barRef.current) return;
        const start = first.getBoundingClientRect().top + window.scrollY - 200;
        const end = last.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
        const progress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start || 1)));
        barRef.current.style.transform = `scaleX(${progress})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [sections]);

  return (
    <nav className="section-nav" aria-label="Record sections" ref={navRef}>
      <ol>
        {sections.map(([id, label], index) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              onClick={(event) => {
                const target = document.getElementById(id);
                if (!target) return;
                event.preventDefault();
                scrollToElement(target, -140);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          </li>
        ))}
      </ol>
      <i ref={barRef} aria-hidden="true" />
    </nav>
  );
}
