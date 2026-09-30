import type { CSSProperties, ReactNode } from "react";
import type { Brand } from "@/lib/catalogue/studio";

// Building blocks for the product screens rendered in the image studio.

export const fontOf = (brand: Brand) => (brand.font === "serif" ? "var(--serif)" : brand.font === "mono" ? "var(--mono)" : "var(--display)");

export function Canvas({ brand, children, style }: { brand: Brand; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, width: 1600, height: 1000, overflow: "hidden", background: brand.bg, color: brand.ink, fontFamily: "var(--display)", letterSpacing: "-0.01em", ...style }}>
      {children}
    </div>
  );
}

export function Browser({ brand, url, children, style }: { brand: Brand; url: string; children: ReactNode; style?: CSSProperties }) {
  const chrome = brand.dark ? "#0c0e11" : "#e9e9e6";
  return (
    <div style={{ position: "absolute", left: 70, top: 60, right: 70, bottom: 0, display: "flex", flexDirection: "column", border: `1px solid ${brand.dark ? "#2a2e35" : "#d6d6d1"}`, borderBottom: 0, borderRadius: "12px 12px 0 0", overflow: "hidden", background: brand.surface, ...style }}>
      <div style={{ height: 46, flex: "none", display: "flex", alignItems: "center", gap: 16, padding: "0 18px", background: chrome }}>
        <div style={{ display: "flex", gap: 8 }}>{["#e0685b", "#e6b44a", "#5cb46a"].map((c) => <i key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}</div>
        <div style={{ flex: 1, maxWidth: 560, margin: "0 auto", height: 28, borderRadius: 7, background: brand.dark ? "#1b1e23" : "#f7f7f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: brand.muted }}>{url}</div>
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

export function Phone({ brand, children, style, width = 330 }: { brand: Brand; children: ReactNode; style?: CSSProperties; width?: number }) {
  return (
    <div style={{ position: "absolute", width, height: width * 2.05, borderRadius: 48, border: "11px solid #16181b", background: brand.surface, overflow: "hidden", ...style }}>
      <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 12, fontWeight: 600, color: brand.ink }}>
        <span>9:41</span><i style={{ width: 90, height: 22, borderRadius: 12, background: "#16181b" }} /><span>100%</span>
      </div>
      <div style={{ position: "absolute", inset: "34px 0 0", overflow: "hidden" }}>{children}</div>
    </div>
  );
}

export function AreaChart({ values, brand, width, height, fill = true }: { values: number[]; brand: Brand; width: number; height: number; fill?: boolean }) {
  const max = Math.max(...values) * 1.1;
  const min = Math.min(...values) * 0.8;
  const x = (i: number) => (width * i) / (values.length - 1);
  const y = (v: number) => height - ((v - min) / (max - min)) * height;
  const line = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height + 24} style={{ display: "block", overflow: "visible" }}>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={0} x2={width} y1={height * f} y2={height * f} stroke={brand.dark ? "#2a2e35" : "#ececea"} />)}
      {fill && <polygon points={`0,${height} ${line} ${width},${height}`} fill={brand.accent} fillOpacity={0.12} />}
      <polyline points={line} fill="none" stroke={brand.accent} strokeWidth={2.5} />
      {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={3.5} fill={brand.surface} stroke={brand.accent} strokeWidth={2} />)}
      {["O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A", "S"].slice(0, values.length).map((m, i) => <text key={i} x={x(i)} y={height + 20} textAnchor="middle" fontSize={11} fill={brand.muted}>{m}</text>)}
    </svg>
  );
}

export function Bars({ values, brand, width, height, color }: { values: number[]; brand: Brand; width: number; height: number; color?: string }) {
  const max = Math.max(...values);
  const gap = 8;
  const w = (width - gap * (values.length - 1)) / values.length;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {values.map((v, i) => <rect key={i} x={i * (w + gap)} y={height - (v / max) * height} width={w} height={(v / max) * height} rx={3} fill={color ?? brand.accent} fillOpacity={i === values.length - 1 ? 1 : 0.55} />)}
    </svg>
  );
}

export function Pill({ children, color, brand }: { children: ReactNode; color: string; brand: Brand }) {
  return <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color, background: brand.dark ? `${color}22` : `${color}1a` }}>{children}</span>;
}

export function Card({ brand, children, style }: { brand: Brand; children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: brand.surface, border: `1px solid ${brand.dark ? "#2a2e35" : "#e6e6e2"}`, borderRadius: 12, padding: 20, ...style }}>{children}</div>;
}

export const initials = (name: string) => name.split(/\s|-/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();

// Deterministic pseudo-random numbers so every capture is identical.
export function seeded(seed: string) {
  let value = 0;
  for (const char of seed) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}
