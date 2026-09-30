import type { CSSProperties } from "react";
import { assets, categories } from "@/lib/assets";

// Four readings of the index, computed from the records on this page. Nothing
// here is invented: change the catalogue and the charts change with it.

const lakh = (value: number) => (value >= 100000 ? `₹${(value / 100000).toFixed(1)}L` : `₹${Math.round(value / 1000)}k`);

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

// "5–7 days" counts as its upper bound.
const windowDays = (text: string) => Math.max(...(text.match(/\d+/g) ?? ["0"]).map(Number));

function Bars({ rows, format }: { rows: { label: string; value: number; ink?: string; note?: string }[]; format: (value: number) => string }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <dl className="pulse-bars">
      {rows.map((row) => (
        <div key={row.label} style={{ "--cat": row.ink ?? "var(--ink)" } as CSSProperties}>
          <dt>{row.label}{row.note && <small>{row.note}</small>}</dt>
          <dd><i style={{ width: `${(row.value / max) * 100}%` }} /><span>{format(row.value)}</span></dd>
        </div>
      ))}
    </dl>
  );
}

export function MarketPulse() {
  const byCategory = categories.map((category) => {
    const priced = assets.filter((asset) => asset.category === category.key && !asset.priceUnit);
    return { label: category.plural, value: priced.length ? median(priced.map((asset) => asset.price)) : 0, ink: category.ink, note: `${priced.length} sale ${priced.length === 1 ? "record" : "records"}` };
  }).filter((row) => row.value > 0).sort((a, b) => b.value - a.value);

  const buckets = [["Up to 7 days", 0, 7], ["8 to 14 days", 8, 14], ["15 to 21 days", 15, 21], ["22 to 30 days", 22, 30], ["Over 30 days", 31, Infinity]] as const;
  const windows = buckets.map(([label, low, high]) => ({ label, value: assets.filter((asset) => { const days = windowDays(asset.transferWindow); return days >= low && days <= high; }).length }));

  const ages = [["Under a year", 0, 11], ["One to two years", 12, 23], ["Two to three years", 24, 35], ["Three years or more", 36, Infinity]] as const;
  const ageRows = ages.map(([label, low, high]) => ({ label, value: assets.filter((asset) => asset.ageMonths >= low && asset.ageMonths <= high).length }));

  const mix = [
    { label: "For sale, available", value: assets.filter((asset) => asset.deal === "sell" && asset.status === "live").length, tone: "sell" },
    { label: "For rent, available", value: assets.filter((asset) => asset.deal === "rent" && asset.status === "live").length, tone: "rent" },
    { label: "Closed", value: assets.filter((asset) => asset.status !== "live").length, tone: "closed" },
  ];

  return (
    <section className="pulse" aria-labelledby="pulse-title">
      <header className="pulse-head">
        <span className="label">Market pulse / Edition 01 sample data</span>
        <h2 id="pulse-title">What the index <em>says.</em></h2>
        <p>Computed from the {assets.length} records on this page. Prices are asking prices; rentals are left out of the medians.</p>
      </header>
      <div className="pulse-grid">
        <figure>
          <figcaption><span className="label">01</span>Median asking price by category</figcaption>
          <Bars rows={byCategory} format={lakh} />
        </figure>
        <figure>
          <figcaption><span className="label">02</span>How the index divides</figcaption>
          <div className="pulse-mix" role="img" aria-label={mix.map((row) => `${row.label}: ${row.value}`).join(", ")}>
            {mix.map((row) => <i key={row.label} className={`is-${row.tone}`} style={{ flexGrow: row.value }} />)}
          </div>
          <ul className="pulse-legend">{mix.map((row) => <li key={row.label}><i className={`is-${row.tone}`} />{row.label}<b>{row.value}</b></li>)}</ul>
        </figure>
        <figure>
          <figcaption><span className="label">03</span>Stated transfer window</figcaption>
          <Bars rows={windows} format={(value) => `${value}`} />
        </figure>
        <figure>
          <figcaption><span className="label">04</span>Age of the asset at listing</figcaption>
          <Bars rows={ageRows} format={(value) => `${value}`} />
        </figure>
      </div>
    </section>
  );
}
