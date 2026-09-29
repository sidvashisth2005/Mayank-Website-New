import { categoryOf, formatPrice, type Asset } from "@/lib/assets";

// A record plate is drawn from the record itself: its metric series becomes a
// contour field, its id sets the hatch angle, its price punches the edge.
// The same record always produces the same plate.

export type PlateSource = { id: string; name: string; ink: string; bars: number[]; label: string; price?: string };

export function plateFrom(asset: Asset): PlateSource {
  return { id: asset.id, name: asset.name, ink: categoryOf(asset.category).ink, bars: asset.bars, label: categoryOf(asset.category).label, price: formatPrice(asset) };
}

function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index++) value = Math.imul(value ^ text.charCodeAt(index), 16777619);
  return value >>> 0;
}

function smoothPath(points: [number, number][]) {
  let path = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return path;
}

function contours(bars: number[], seed: number, box: { x: number; y: number; w: number; h: number }, lines: number) {
  const values = bars.length ? bars : [50];
  const phase = (seed % 97) / 97;
  return Array.from({ length: lines }, (_, line) => {
    const weight = 0.3 + 0.7 * Math.sin((Math.PI * (line + 0.5)) / lines);
    const base = box.y + (box.h * (line + 1)) / (lines + 1);
    const points = values.map((_, index) => {
      const value = values[(index + line) % values.length];
      const x = box.x + (box.w * index) / (values.length - 1);
      const wave = Math.sin(index * 0.9 + line * 0.45 + phase * 6.28) * 0.18;
      return [x, base - ((value / 100) - 0.5 + wave) * (box.h / (lines + 1)) * 2.4 * weight] as [number, number];
    });
    return smoothPath(points);
  });
}

type Variant = "cover" | "stamp" | "thumb";

export function RecordPlate({ source, variant = "cover", className = "", title }: { source: PlateSource; variant?: Variant; className?: string; title?: string }) {
  const seed = hash(source.id + source.name);
  const angle = 25 + (seed % 5) * 11;
  const monogram = source.name.trim().charAt(0).toUpperCase() || "M";
  const patternId = `hatch-${source.id}-${variant}`.replace(/[^a-zA-Z0-9-]/g, "");

  if (variant === "thumb") {
    return (
      <svg className={`record-plate is-thumb ${className}`} viewBox="0 0 100 100" {...(title === "" ? { "aria-hidden": true } : { role: "img", "aria-label": title ?? `${source.name} record plate` })}>
        <rect width="100" height="100" fill={source.ink} />
        <g fill="none" stroke="#f7f7f5" strokeOpacity=".5" strokeWidth=".8">
          {contours(source.bars, seed, { x: 6, y: 8, w: 88, h: 60 }, 6).map((path, index) => <path key={index} d={path} />)}
        </g>
        <text x="92" y="92" textAnchor="end" fill="#f7f7f5" style={{ font: "italic 400 38px var(--serif)" }}>{monogram}</text>
      </svg>
    );
  }

  const stamp = variant === "stamp";
  const digits = (source.price ?? source.id).replace(/\D/g, "").padEnd(12, "0").slice(0, 12);
  return (
    <svg className={`record-plate is-${variant} ${className}`} viewBox="0 0 400 500" {...(title === "" ? { "aria-hidden": true } : { role: "img", "aria-label": title ?? `${source.name} record plate, ${source.label}` })}>
      <defs>
        <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
          <line x1="0" y1="0" x2="0" y2="9" stroke="#f7f7f5" strokeOpacity=".42" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width="400" height="500" fill={source.ink} />
      <text x="24" y="40" fill="#f7f7f5" style={{ font: "450 13px var(--mono)", letterSpacing: ".08em" }}>{source.id}</text>
      <text x="376" y="40" textAnchor="end" fill="#f7f7f5" fillOpacity=".75" style={{ font: "450 11px var(--mono)", letterSpacing: ".08em", textTransform: "uppercase" }}>{source.label}</text>
      <line x1="24" y1="56" x2="376" y2="56" stroke="#f7f7f5" strokeOpacity=".35" />
      <g className="plate-register" fill="none" stroke="#f7f7f5" strokeOpacity=".7">
        <circle cx="356" cy="86" r="9" />
        <line x1="342" y1="86" x2="370" y2="86" />
        <line x1="356" y1="72" x2="356" y2="100" />
      </g>
      <g className="plate-contours" data-draw fill="none" stroke="#f7f7f5" strokeOpacity=".58" strokeWidth="1.1">
        {contours(source.bars, seed, { x: 24, y: 96, w: 352, h: 250 }, stamp ? 11 : 15).map((path, index) => <path key={index} d={path} />)}
      </g>
      <rect x="24" y="372" width="170" height="62" fill={`url(#${patternId})`} />
      <rect x="24" y="372" width="170" height="62" fill="none" stroke="#f7f7f5" strokeOpacity=".4" />
      <g fill="#f7f7f5">
        {digits.split("").map((digit, index) => (
          <rect key={index} x={24 + index * 14} y="450" width="8" height="18" fillOpacity={Number(digit) % 2 ? 0.9 : 0.22} />
        ))}
      </g>
      {stamp && <text x="24" y="358" fill="#f7f7f5" style={{ font: "560 30px var(--display)", letterSpacing: "-.04em" }}>{source.name}</text>}
      <text x="380" y="478" textAnchor="end" fill="#f7f7f5" style={{ font: `italic 400 ${stamp ? 150 : 176}px var(--serif)` }}>{monogram}</text>
    </svg>
  );
}
