/**
 * Harness-authored. The JSON Render and Hashbrown pages import `MetricCard`,
 * `BarChart` and `PieChart` from files they never publish. These are the
 * missing components, written to the prop shapes the JSON Render catalog
 * declares: `{ title, value, delta? }` and `{ data: { label, value }[] }`.
 *
 * Shared by both routes. Each route has thin files at the paths its doc
 * imports from (`./metric-card`, `./charts/…`), re-exporting from here.
 *
 * Plain SVG and divs, no chart library, so nothing else needs installing.
 */

type Datum = { label: string; value: number };

const PALETTE = ["#4f46e5", "#0891b2", "#16a34a", "#ca8a04", "#dc2626", "#9333ea"];

export function MetricCard({
  title,
  value,
  delta,
}: {
  title: string;
  value: number;
  delta?: number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {value.toLocaleString()}
      </p>
      {delta !== undefined && (
        <p
          className={`mt-1 text-sm tabular-nums ${
            delta >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export function BarChart({ data }: { data: Datum[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      {data.map((d, i) => (
        <div key={`${d.label}-${i}`} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 truncate text-slate-600 dark:text-slate-400">
            {d.label}
          </span>
          <div className="h-4 flex-1 rounded bg-slate-100 dark:bg-slate-800">
            <div
              className="h-4 rounded"
              style={{
                width: `${(d.value / max) * 100}%`,
                backgroundColor: PALETTE[i % PALETTE.length],
              }}
            />
          </div>
          <span className="w-20 shrink-0 text-right tabular-nums">
            {d.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PieChart({ data }: { data: Datum[] }) {
  const total = data.reduce((sum, d) => sum + Math.max(0, d.value), 0) || 1;
  let start = 0;
  const slices = data.map((d, i) => {
    const fraction = Math.max(0, d.value) / total;
    const end = start + fraction;
    const path = arc(start, end);
    start = end;
    return { ...d, path, color: PALETTE[i % PALETTE.length], fraction };
  });

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <svg viewBox="-1 -1 2 2" className="h-32 w-32 shrink-0 -rotate-90">
        {slices.map((s, i) =>
          s.fraction >= 1 ? (
            <circle key={i} r="1" fill={s.color} />
          ) : (
            <path key={i} d={s.path} fill={s.color} />
          ),
        )}
      </svg>
      <ul className="space-y-1 text-sm">
        {slices.map((s, i) => (
          <li key={`${s.label}-${i}`} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span>{s.label}</span>
            <span className="tabular-nums text-slate-500">
              {(s.fraction * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** SVG path for a pie slice between two fractions of the circle. */
function arc(from: number, to: number): string {
  const point = (f: number) =>
    `${Math.cos(2 * Math.PI * f)} ${Math.sin(2 * Math.PI * f)}`;
  const largeArc = to - from > 0.5 ? 1 : 0;
  return `M ${point(from)} A 1 1 0 ${largeArc} 1 ${point(to)} L 0 0`;
}
