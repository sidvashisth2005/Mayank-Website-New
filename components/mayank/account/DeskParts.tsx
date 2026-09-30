import type { ListingStatus } from "@/lib/db/schema";
import { railPosition, railSteps, statusCopy } from "@/lib/listing-status";

// Thin status stamp, in the same register as the market's SOLD / RENTED marks.
export function StatusStamp({ status }: { status: ListingStatus }) {
  const copy = statusCopy[status];
  return <span className={`desk-stamp is-${copy.tone}`}>{copy.label}</span>;
}

// Five ruled steps. Done steps are filled, the current one is outlined, and a
// stopped listing marks the step where it stopped.
export function ProgressRail({ status, compact }: { status: ListingStatus; compact?: boolean }) {
  const at = railPosition(status);
  const stopped = statusCopy[status].tone === "stop";
  return (
    <ol className={`progress-rail${compact ? " is-compact" : ""}`} aria-label={`Progress: ${statusCopy[status].label}, step ${at + 1} of ${railSteps.length}`}>
      {railSteps.map((step, index) => (
        <li key={step} className={index < at || status === "transferred" ? "is-done" : index === at ? (stopped ? "is-stopped" : "is-current") : ""}>
          <i aria-hidden="true" />
          {!compact && <span>{step}</span>}
        </li>
      ))}
    </ol>
  );
}

const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

// Thirty days of views as ruled columns. Empty days stay visible as a baseline.
export function ViewsChart({ days }: { days: { day: string; count: number }[] }) {
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(4, ...days.map((day) => day.count));
  const width = 600, height = 160, gap = 4;
  const bar = (width - gap * (days.length - 1)) / days.length;
  return (
    <figure className="views-chart">
      <svg viewBox={`0 0 ${width} ${height + 22}`} role="img" aria-label={`Record views over the last ${days.length} days: ${total} in total.`}>
        {[0, 0.5, 1].map((step) => <line key={step} x1={0} x2={width} y1={height * (1 - step)} y2={height * (1 - step)} className="chart-rule" />)}
        {days.map((day, index) => {
          const h = Math.max(1.5, (day.count / max) * height);
          return <rect key={day.day} x={index * (bar + gap)} y={height - h} width={bar} height={h} className={day.count ? "views-bar" : "views-bar is-empty"} />;
        })}
        {days.length > 0 && [0, Math.floor(days.length / 2), days.length - 1].map((index) => (
          <text key={index} x={index * (bar + gap) + bar / 2} y={height + 18} textAnchor={index === 0 ? "start" : index === days.length - 1 ? "end" : "middle"} className="chart-tick">
            {shortDate.format(new Date(`${days[index].day}T00:00:00`))}
          </text>
        ))}
      </svg>
      <figcaption><span>Record views, last {days.length} days</span><strong>{total.toLocaleString("en-IN")}</strong></figcaption>
    </figure>
  );
}

const when = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
export const formatWhen = (date: Date) => when.format(date);
