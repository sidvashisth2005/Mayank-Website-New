const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

function niceMax(value: number) {
  const power = 10 ** Math.floor(Math.log10(value || 1));
  return Math.ceil((value * 1.08) / power) * power;
}

const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });

// Twelve-month record chart: ruled axes, an ink line and a flat tint below it.
export function Chart({ values, label }: { values: number[]; label: string }) {
  const width = 640, height = 250, left = 44, right = 18, top = 22, bottom = 34;
  const max = niceMax(Math.max(...values));
  const x = (index: number) => left + ((width - left - right) * index) / (values.length - 1);
  const y = (value: number) => top + (height - top - bottom) * (1 - value / max);
  const line = values.map((value, index) => `${x(index).toFixed(1)},${y(value).toFixed(1)}`).join(" ");
  const area = `${left},${height - bottom} ${line} ${x(values.length - 1)},${height - bottom}`;
  const change = Math.round(((values[values.length - 1] - values[0]) / (values[0] || 1)) * 100);
  return (
    <figure className="record-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label}. From ${values[0]} to ${values[values.length - 1]}, a change of ${change}%.`}>
        {[0, 0.25, 0.5, 0.75, 1].map((step) => (
          <g key={step}>
            <line x1={left} x2={width - right} y1={y(max * step)} y2={y(max * step)} className="chart-rule" />
            <text x={left - 8} y={y(max * step) + 4} textAnchor="end" className="chart-tick">{compact.format(max * step)}</text>
          </g>
        ))}
        <polygon points={area} className="chart-area" />
        <polyline points={line} className="chart-line" data-draw />
        {values.map((value, index) => <rect key={index} x={x(index) - 3} y={y(value) - 3} width="6" height="6" className="chart-dot" />)}
        {MONTHS.map((month, index) => <text key={month} x={x(index)} y={height - 10} textAnchor="middle" className="chart-tick">{month}</text>)}
      </svg>
      <figcaption><span>{label}</span><strong>{change >= 0 ? "+" : ""}{change}% over 12 months</strong></figcaption>
    </figure>
  );
}

export function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const max = Math.max(...values), min = Math.min(...values);
  const points = values.map((value, index) => `${(index * 120) / (values.length - 1)},${(28 - ((value - min) / (max - min || 1)) * 24).toFixed(1)}`).join(" ");
  return (
    <svg className={`sparkline ${className}`} viewBox="0 -2 120 32" aria-hidden="true">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="116" y={Number(points.split(" ").pop()!.split(",")[1]) - 2.5} width="5" height="5" fill="currentColor" />
    </svg>
  );
}
