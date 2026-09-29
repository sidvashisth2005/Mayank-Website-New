import type { ReactNode } from "react";

// Technical line drawings in one archivist's hand: 1px strokes, hatching,
// dashed construction lines. They inherit colour from the surrounding ink.

const rhombus = (cx: number, cy: number, w: number, h: number) => `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
const hatch = (x: number, y: number, w: number, h: number, gap = 6) =>
  Array.from({ length: Math.floor(w / gap) }, (_, index) => <line key={index} x1={x + index * gap} y1={y} x2={x + index * gap} y2={y + h} />);

const drawings: Record<string, ReactNode> = {
  // Categories
  product: <>
    <polygon points={rhombus(120, 146, 92, 36)} />
    <polygon points={rhombus(120, 104, 92, 36)} strokeDasharray="4 4" />
    <polygon points={rhombus(120, 62, 92, 36)} />
    <line x1="28" y1="62" x2="28" y2="146" strokeDasharray="2 5" /><line x1="212" y1="62" x2="212" y2="146" strokeDasharray="2 5" /><line x1="120" y1="98" x2="120" y2="182" strokeDasharray="2 5" />
    {[0, 1, 2, 3, 4].map((index) => <line key={index} x1={84 + index * 18} y1={70 - index * 2} x2={84 + index * 18} y2={48 - [10, 22, 14, 30, 24][index]} />)}
    <g opacity=".6">{hatch(96, 132, 48, 12, 5)}</g>
  </>,
  code: <>
    <path d="M28 34 L40 22 H150 V100 H28 Z" />
    <path d="M52 58 L64 46 H174 V124 H52 Z" />
    <path d="M76 82 L88 70 H198 V148 H76 Z" />
    {Array.from({ length: 24 }, (_, index) => <rect key={index} x={92 + (index % 8) * 12} y={86 + Math.floor(index / 8) * 16} width="5" height="9" fill={(index * 7) % 3 ? "none" : "currentColor"} />)}
    <path d="M200 160 V176 M200 168 H222 M222 160 V186 M222 176 H236" strokeDasharray="3 3" />
    <line x1="76" y1="168" x2="198" y2="168" /><line x1="76" y1="164" x2="76" y2="172" /><line x1="198" y1="164" x2="198" y2="172" />
  </>,
  domain: <>
    <path d="M44 72 H156 L196 112 L156 152 H44 Z" />
    <circle cx="170" cy="112" r="7" />
    <path d="M177 110 C214 94 224 62 204 38 C196 28 186 30 184 40" />
    <g opacity=".55">{hatch(52, 80, 26, 64, 5)}</g>
    <text x="86" y="124" fill="currentColor" stroke="none" style={{ font: "italic 400 34px var(--serif)" }}>.com</text>
    <line x1="44" y1="176" x2="196" y2="176" strokeDasharray="2 5" />
  </>,
  design: <>
    {[-48, -26, -4, 18, 40].map((angle, index) => (
      <g key={angle} transform={`rotate(${angle} 76 170)`}>
        <rect x="60" y="54" width="32" height="116" />
        <line x1="60" y1="86" x2="92" y2="86" /><line x1="60" y1="112" x2="92" y2="112" />
        {index % 2 === 0 && <g opacity=".55">{hatch(64, 58, 26, 24, 5)}</g>}
      </g>
    ))}
    <circle cx="76" cy="170" r="4" />
    {[0, 1, 2].map((row) => [0, 1, 2].map((col) => <rect key={`${row}${col}`} x={168 + col * 20} y={36 + row * 20} width="14" height="14" fill={(row + col) % 3 === 0 ? "currentColor" : "none"} />))}
  </>,
  template: <>
    {[0, 1, 2].map((index) => <polygon key={index} points={`${36 + index * 34},${62 - index * 8} ${122 + index * 34},${40 - index * 8} ${122 + index * 34},${150 - index * 8} ${36 + index * 34},${172 - index * 8}`} strokeDasharray={index < 2 ? "3 4" : undefined} />)}
    <polygon points="112,40 180,23 180,54 112,71" />
    <g opacity=".55">{hatch(116, 42, 60, 24, 6)}</g>
    <line x1="114" y1="88" x2="178" y2="72" /><line x1="114" y1="100" x2="164" y2="88" /><line x1="114" y1="112" x2="172" y2="98" />
    <polygon points="114,130 150,121 150,136 114,145" fill="currentColor" />
  </>,
  provider: <>
    <circle cx="58" cy="66" r="24" /><circle cx="58" cy="66" r="8" />
    <path d="M82 66 H176 M150 66 V82 M162 66 V90 M176 66 V80" />
    <path d="M176 70 C210 92 196 124 150 136" strokeDasharray="3 4" />
    <polygon points={rhombus(140, 152, 76, 26)} />
    <path d="M64 152 V166 L140 192 L216 166 V152" />
    <line x1="140" y1="178" x2="140" y2="192" />
    <g opacity=".5">{hatch(104, 146, 72, 8, 6)}</g>
  </>,

  // Steps
  asset: <>
    <polygon points={rhombus(120, 60, 70, 28)} />
    <path d="M50 60 V132 L120 160 L190 132 V60 M120 88 V160" />
    <g opacity=".5">{hatch(126, 96, 58, 50, 7)}</g>
  </>,
  deal: <>
    <line x1="120" y1="36" x2="120" y2="172" /><path d="M92 172 H148" />
    <line x1="44" y1="60" x2="196" y2="52" /><circle cx="120" cy="56" r="4" />
    <path d="M44 60 L28 110 H60 Z M196 52 L180 102 H212 Z" />
    <path d="M28 110 Q44 124 60 110 M180 102 Q196 116 212 102" />
  </>,
  evidence: <>
    <path d="M54 30 H140 L166 56 V172 H54 Z M140 30 V56 H166" />
    {[76, 92, 108, 124].map((y) => <line key={y} x1="70" y1={y} x2={y === 124 ? 118 : 150} y2={y} />)}
    <circle cx="150" cy="134" r="28" /><line x1="170" y1="154" x2="200" y2="184" />
    <g opacity=".5">{hatch(134, 124, 32, 20, 5)}</g>
  </>,
  media: <>
    <rect x="36" y="40" width="130" height="92" strokeDasharray="3 4" />
    <rect x="54" y="58" width="130" height="92" />
    <rect x="72" y="76" width="130" height="92" />
    <polyline points="72,168 110,120 134,146 156,128 202,168" />
    <circle cx="176" cy="100" r="9" />
  </>,
  contact: <>
    <rect x="36" y="50" width="168" height="112" />
    <polyline points="36,50 120,118 204,50" />
    <path d="M36 162 L96 104 M204 162 L144 104" strokeDasharray="3 4" />
  </>,
  review: <>
    <rect x="72" y="28" width="96" height="26" /><rect x="108" y="54" width="24" height="54" />
    <rect x="48" y="108" width="144" height="36" />
    <line x1="36" y1="168" x2="204" y2="168" />
    <g opacity=".5">{hatch(54, 112, 132, 28, 7)}</g>
  </>,
  identity: <>
    <rect x="30" y="46" width="180" height="116" />
    <circle cx="76" cy="92" r="18" /><path d="M46 146 C50 120 102 120 106 146" />
    {[82, 100, 118].map((y) => <line key={y} x1="126" y1={y} x2={y === 118 ? 168 : 192} y2={y} />)}
    <line x1="30" y1="66" x2="210" y2="66" strokeDasharray="3 4" />
  </>,
  ownership: <>
    <path d="M44 28 H160 V176 H44 Z" />
    {[52, 68, 84, 100].map((y) => <line key={y} x1="60" y1={y} x2="144" y2={y} />)}
    <circle cx="160" cy="146" r="26" /><circle cx="160" cy="146" r="18" strokeDasharray="2 3" />
    <path d="M146 168 L138 196 L152 188 L160 200 L168 172" />
  </>,
  condition: <>
    <path d="M40 150 A80 80 0 0 1 200 150" />
    {[0, 1, 2, 3, 4, 5, 6].map((index) => {
      const angle = Math.PI + (index * Math.PI) / 6;
      return <line key={index} x1={120 + Math.cos(angle) * 72} y1={150 + Math.sin(angle) * 72} x2={120 + Math.cos(angle) * 84} y2={150 + Math.sin(angle) * 84} />;
    })}
    <line x1="120" y1="150" x2="168" y2="96" /><circle cx="120" cy="150" r="6" fill="currentColor" />
    <line x1="30" y1="176" x2="210" y2="176" />
  </>,
  route: <>
    <polyline points="34,150 88,150 88,72 150,72 150,128 206,128" />
    {[[34, 150], [88, 110], [150, 72], [206, 128]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 6} y={y - 6} width="12" height="12" fill="currentColor" />)}
    <path d="M34 170 H206" strokeDasharray="2 5" />
  </>,
  search: <>
    {[48, 72, 96, 120, 144].map((y) => <g key={y}><rect x="30" y={y - 8} width="12" height="12" /><line x1="52" y1={y - 2} x2={y === 96 ? 120 : 150} y2={y - 2} /></g>)}
    <circle cx="162" cy="112" r="30" /><line x1="184" y1="134" x2="212" y2="162" />
  </>,
  declined: <>
    <rect x="44" y="52" width="152" height="96" /><rect x="52" y="60" width="136" height="80" strokeDasharray="3 4" />
    <line x1="70" y1="72" x2="170" y2="128" strokeWidth="2.4" /><line x1="170" y1="72" x2="70" y2="128" strokeWidth="2.4" />
    <line x1="36" y1="172" x2="204" y2="172" />
  </>,
  conditional: <>
    <circle cx="70" cy="78" r="26" /><circle cx="70" cy="78" r="8" />
    <path d="M96 78 H176 M150 78 V94 M164 78 V100" />
    <path d="M176 78 C204 78 210 114 186 124 C170 131 170 144 170 150" strokeDasharray="3 4" />
    <rect x="166" y="160" width="8" height="8" fill="currentColor" />
    <line x1="36" y1="178" x2="204" y2="178" />
  </>,
  accepted: <>
    <path d="M40 60 H100 L112 74 H200 V168 H40 Z" />
    <line x1="40" y1="88" x2="200" y2="88" />
    <circle cx="150" cy="128" r="22" /><circle cx="150" cy="128" r="14" strokeDasharray="2 3" />
    <path d="M140 147 L134 172 L146 165 L152 176 L158 150" />
    {[104, 118].map((y) => <line key={y} x1="56" y1={y} x2="116" y2={y} />)}
  </>,
  publish: <>
    <path d="M40 30 H150 V170 H40 Z" />
    {[52, 68, 84].map((y) => <line key={y} x1="56" y1={y} x2="134" y2={y} />)}
    <g transform="rotate(-12 150 130)"><rect x="100" y="110" width="104" height="42" /><text x="152" y="140" textAnchor="middle" fill="currentColor" stroke="none" style={{ font: "450 16px var(--mono)", letterSpacing: ".12em" }}>LIVE</text></g>
  </>,
};

export type DrawingName = keyof typeof drawings;

export function Drawing({ name, className = "", title }: { name: string; className?: string; title?: string }) {
  return (
    <svg className={`drawing ${className}`} viewBox="0 0 240 200" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} data-draw>
      {drawings[name] ?? drawings.asset}
    </svg>
  );
}
