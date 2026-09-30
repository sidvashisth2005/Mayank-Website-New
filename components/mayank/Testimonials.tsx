import type { ShownTestimonial } from "@/lib/server/voices";

// A ruled ledger of quotes: heading held on the left, entries on the right.
// Samples carry a visible tag and a note explains them.
export function Testimonials({ items, index, title, lead }: { items: ShownTestimonial[]; index: string; title: React.ReactNode; lead: string }) {
  const hasSamples = items.some((item) => item.sample);
  return (
    <section className="voices" aria-labelledby="voices-title">
      <header className="voices-head">
        <span className="label">{index}</span>
        <h2 id="voices-title">{title}</h2>
        <p>{lead}</p>
        {hasSamples && <p className="voices-note"><b>Sample</b> entries are written for Edition 01 to show how feedback appears. They are replaced by published member testimonials.</p>}
      </header>
      <ol className="voices-list">
        {items.map((item, position) => (
          <li key={`${item.name}-${position}`} data-reveal>
            <span className="voices-no">{String(position + 1).padStart(2, "0")}</span>
            <blockquote>
              <p>{item.quote}</p>
              <footer>
                <cite>{item.name}</cite>
                <span>{item.role}{item.city ? `, ${item.city}` : ""}</span>
                <span className="voices-track">{item.track === "buyer" ? "Bought" : "Sold"} on Mayank</span>
                {item.sample && <span className="sample-tag">Sample</span>}
              </footer>
            </blockquote>
          </li>
        ))}
      </ol>
    </section>
  );
}
