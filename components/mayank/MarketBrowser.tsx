"use client";

import { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { AssetRows } from "./AssetRows";
import { TransitionLink } from "./PageTransition";
import { Drawing } from "./visuals/Drawings";
import { RecordPlate, plateFrom } from "./visuals/RecordPlate";
import { assets, categories, categoryOf, dealLabel, formatPrice, galleryFor, statusLabel, type Asset, type CategoryKey } from "@/lib/assets";
import { getDossier } from "@/lib/dossiers";
import { prefersReducedMotion } from "@/lib/scroll";
import { useStuck } from "./useStuck";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

type Filters = {
  q: string;
  category: CategoryKey | "all";
  deal: "all" | "sell" | "rent";
  closed: boolean;
  sort: "newest" | "price-asc" | "price-desc" | "age";
  view: "index" | "specimens";
};

const defaults: Filters = { q: "", category: "all", deal: "all", closed: false, sort: "newest", view: "index" };
const sorts: [Filters["sort"], string][] = [["newest", "Newest listed"], ["price-asc", "Price, low to high"], ["price-desc", "Price, high to low"], ["age", "Oldest asset first"]];

function parse(params: URLSearchParams | null): Filters {
  const get = (key: string) => params?.get(key) ?? "";
  const category = categories.some((item) => item.key === get("category")) ? (get("category") as CategoryKey) : "all";
  const deal = get("deal") === "sell" || get("deal") === "rent" ? (get("deal") as "sell" | "rent") : "all";
  const sort = sorts.some(([key]) => key === get("sort")) ? (get("sort") as Filters["sort"]) : "newest";
  return { q: get("q"), category, deal, closed: get("closed") === "1", sort, view: get("view") === "specimens" ? "specimens" : "index" };
}

function toQuery(filters: Filters) {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.category !== "all") query.set("category", filters.category);
  if (filters.deal !== "all") query.set("deal", filters.deal);
  if (filters.closed) query.set("closed", "1");
  if (filters.sort !== "newest") query.set("sort", filters.sort);
  if (filters.view !== "index") query.set("view", filters.view);
  const value = query.toString();
  return value ? `?${value}` : "";
}

function apply(filters: Filters) {
  const needle = filters.q.trim().toLowerCase();
  const matches = assets.filter((asset) =>
    (filters.category === "all" || asset.category === filters.category) &&
    (filters.deal === "all" || asset.deal === filters.deal) &&
    (filters.closed || asset.status === "live") &&
    (!needle || `${asset.name} ${asset.type} ${asset.id} ${asset.summary} ${getDossier(asset.slug).stack.join(" ")}`.toLowerCase().includes(needle)),
  );
  const sorted = [...matches].sort((a, b) => {
    if (filters.sort === "price-asc") return a.price - b.price;
    if (filters.sort === "price-desc") return b.price - a.price;
    if (filters.sort === "age") return b.ageMonths - a.ageMonths;
    return b.listed.localeCompare(a.listed);
  });
  return [...sorted.filter((asset) => asset.status === "live"), ...sorted.filter((asset) => asset.status !== "live")];
}

function SpecimenGrid({ items }: { items: Asset[] }) {
  return (
    <ul className="specimen-grid">
      {items.map((asset) => {
        const dossier = getDossier(asset.slug);
        return (
          <li key={asset.slug} data-flip-id={asset.slug} className={asset.status !== "live" ? "is-closed" : ""} style={{ "--cat": categoryOf(asset.category).ink } as CSSProperties}>
            <TransitionLink href={`/market/${asset.slug}`} className="specimen-card">
              <div className="specimen-cover">
                <div className="specimen-shot"><Image src={galleryFor(asset)[0]} alt={`${asset.name}, main screen`} fill sizes="(max-width: 640px) 92vw, (max-width: 980px) 46vw, 31vw" /></div>
                <RecordPlate source={plateFrom(asset)} variant="thumb" title="" className="specimen-badge" />
                {asset.status !== "live" && <b className="record-stamp">{statusLabel[asset.status]}</b>}
              </div>
              <div className="specimen-card-meta">
                <span>{asset.id} / {asset.type}</span>
                <strong>{asset.name}</strong>
                <ul>{dossier.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                <dl><div><dt>{dealLabel[asset.deal]}</dt><dd>{formatPrice(asset)}</dd></div><div><dt>Status</dt><dd>{statusLabel[asset.status]}</dd></div></dl>
              </div>
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}

export function MarketView({ filters, update }: { filters: Filters; update?: (next: Partial<Filters>) => void }) {
  const results = useMemo(() => apply(filters), [filters]);
  const set = (next: Partial<Filters>) => update?.(next);
  const isDefault = !filters.q && filters.category === "all" && filters.deal === "all" && !filters.closed;
  const count = (key: CategoryKey) => assets.filter((asset) => asset.category === key && (filters.closed || asset.status === "live")).length;
  const reset = () => set({ q: "", category: "all", deal: "all", closed: false });
  const available = assets.filter((asset) => asset.status === "live").length;
  const controlsRef = useRef<HTMLDivElement>(null);
  useStuck(controlsRef);

  return (
    <section className="market-browser" aria-label="Browse the index">
      <div className="category-rail" role="group" aria-label="Category">
        <button type="button" className="rail-item rail-all" aria-pressed={filters.category === "all"} onClick={() => set({ category: "all" })}>
          <Drawing name="search" /><span>All records</span><i>{filters.closed ? assets.length : available}</i>
        </button>
        {categories.map((category) => (
          <button key={category.key} type="button" className="rail-item" style={{ "--cat": category.ink } as CSSProperties} aria-pressed={filters.category === category.key} onClick={() => set({ category: category.key })}>
            <Drawing name={category.key} /><span>{category.label}</span><i>{count(category.key)}</i>
          </button>
        ))}
      </div>
      <div className="market-controls" ref={controlsRef}>
        <label className="market-search">
          <span>Search the index</span>
          <input type="search" value={filters.q} onChange={(event) => set({ q: event.target.value })} placeholder="Name, type, record number or technology" />
        </label>
        <div className="market-options">
          <div className="segmented" role="group" aria-label="Deal type">
            {(["all", "sell", "rent"] as const).map((deal) => <button key={deal} type="button" aria-pressed={filters.deal === deal} onClick={() => set({ deal })}>{deal === "all" ? "All deals" : deal === "sell" ? "Buy" : "Rent"}</button>)}
          </div>
          <label className="check-chip"><input type="checkbox" checked={filters.closed} onChange={(event) => set({ closed: event.target.checked })} /><span>Include closed</span></label>
          <label className="market-sort"><span>Sort</span>
            <select value={filters.sort} onChange={(event) => set({ sort: event.target.value as Filters["sort"] })}>{sorts.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
          </label>
          <div className="segmented" role="group" aria-label="View">
            <button type="button" aria-pressed={filters.view === "index"} onClick={() => set({ view: "index" })}>Index</button>
            <button type="button" aria-pressed={filters.view === "specimens"} onClick={() => set({ view: "specimens" })}>Specimens</button>
          </div>
        </div>
      </div>
      <div className="market-status">
        <p aria-live="polite">Showing {results.length} of {assets.length} records{filters.closed ? "" : `, ${assets.length - available} closed hidden`}</p>
        {!isDefault && <button type="button" onClick={reset}>Clear filters</button>}
      </div>
      <div className="market-results">
        {results.length === 0 ? (
          <div className="market-empty">
            <Drawing name="search" />
            <div>
              <strong>No record matches this search.</strong>
              <p>Try a broader category, include closed records, or list what you are looking for through a listing enquiry.</p>
              <button type="button" onClick={reset}>Clear filters</button>
            </div>
          </div>
        ) : filters.view === "specimens" ? <SpecimenGrid items={results} /> : <AssetRows items={results} />}
      </div>
    </section>
  );
}

export function MarketBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parse(params), [params]);
  const rootRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const query = toQuery(filters);

  function update(next: Partial<Filters>) {
    const root = rootRef.current;
    const merged = { ...filters, ...next };
    if (root && !prefersReducedMotion() && merged.view === filters.view) flipState.current = Flip.getState(root.querySelectorAll("[data-flip-id]"));
    router.replace(`${pathname}${toQuery(merged)}`, { scroll: false });
  }

  useLayoutEffect(() => {
    const state = flipState.current;
    const root = rootRef.current;
    flipState.current = null;
    if (!state || !root) return;
    Flip.from(state, {
      targets: root.querySelectorAll("[data-flip-id]"),
      duration: 0.55,
      ease: "power3.inOut",
      stagger: 0.02,
      onEnter: (elements) => gsap.fromTo(elements, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power3.out" }),
    });
  }, [query]);

  return <div ref={rootRef}><MarketView filters={filters} update={update} /></div>;
}

export function MarketFallback() {
  return <MarketView filters={defaults} />;
}
