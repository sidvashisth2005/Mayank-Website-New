"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";
import { lockScroll } from "@/lib/scroll";

export type SearchEntry = { href: string; title: string; meta: string; group: "Records" | "Pages" | "Desk"; terms: string };

const OPEN_EVENT = "mayank:search";
export const openQuickSearch = () => window.dispatchEvent(new Event(OPEN_EVENT));

// Ctrl+K / ⌘K or "/" opens a search across records and pages. Arrow keys move,
// Enter opens, Esc closes and returns focus to where it was.
export function QuickSearch({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const found = words.length ? entries.filter((entry) => words.every((word) => entry.terms.includes(word))) : entries.filter((entry) => entry.group !== "Records").concat(entries.filter((entry) => entry.group === "Records").slice(0, 5));
    return found.slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    const show = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setQuery("");
      setActive(0);
      setOpen(true);
      lockScroll(true);
    };
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName));
      if ((event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener(OPEN_EVENT, show); };
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  function close() {
    setOpen(false);
    lockScroll(false);
    returnTo.current?.focus?.();
  }

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    setOpen(false);
    lockScroll(false);
    if (entry.href !== pathname) navigate(entry.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    else if (event.key === "ArrowDown") { event.preventDefault(); setActive((index) => Math.min(results.length - 1, index + 1)); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive((index) => Math.max(0, index - 1)); }
    else if (event.key === "Enter") { event.preventDefault(); go(results[active]); }
    else if (event.key === "Tab") event.preventDefault();
  }

  if (!open) return null;
  return createPortal(
    <div className="search-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search Mayank" onKeyDown={onKeyDown}>
        <div className="search-field">
          <span className="label">Search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            placeholder="Record name, number, category or page"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="button" onClick={close}>Esc</button>
        </div>
        {results.length ? (
          <ul id="search-results" role="listbox" aria-label="Results">
            {results.map((entry, index) => (
              <li key={entry.href} id={`search-${index}`} role="option" aria-selected={index === active} onMouseMove={() => setActive(index)} onClick={() => go(entry)}>
                <span className="label">{entry.group}</span>
                <strong>{entry.title}</strong>
                <small>{entry.meta}</small>
              </li>
            ))}
          </ul>
        ) : <p className="search-empty">Nothing matches &ldquo;{query}&rdquo;. Try a category such as domain, template or code.</p>}
        <p className="search-keys"><span>↑ ↓ to move</span><span>Enter to open</span><span>Esc to close</span></p>
      </div>
    </div>,
    document.body,
  );
}
