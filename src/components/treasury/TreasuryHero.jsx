import { Panel } from "./Panel";
import { formatCompactNumber, formatNgn, formatPercent } from "./format";

function DeltaPill({ pct, windowLabel }) {
  const up = pct >= 0;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${
        up ? "border-[#00ff7a33] bg-[#00ff7a12] text-[#00ff7a]" : "border-[#ff545433] bg-[#ff545412] text-[#ff5454]"
      }`}
    >
      <svg viewBox="0 0 12 12" className={`h-3 w-3 ${up ? "" : "rotate-180"}`} fill="none">
        <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
      </svg>
      <span>
        {formatPercent(pct, { digits: 2 })} · {windowLabel}
      </span>
    </div>
  );
}

export function SupplyHero({ supply }) {
  if (!supply) return null;
  return (
    <Panel className="p-6 md:p-7">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/60">
        Circulating Supply
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/8 text-[10px] font-bold text-white/35">
          i
        </span>
      </div>

      <div className="mb-4 text-5xl font-extrabold tracking-tight text-[#00ff7a] drop-shadow-[0_0_40px_rgba(0,255,122,0.18)] md:text-6xl">
        {formatCompactNumber(supply.circulating, { digits: 1 })}
        <span className="ml-2 text-2xl font-bold text-[#00e570]">{supply.tokenSymbol}</span>
      </div>

      <DeltaPill pct={supply.deltaPct24h} windowLabel="24h" />

      <div className="my-6 h-px bg-white/10" />

      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <div className="text-xs font-medium text-white/60">Total Value Locked</div>
          <div className="mt-1 text-xl font-bold tracking-tight text-white">{formatNgn(supply.tvlNgn, { digits: 1 })}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center text-white/35">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-white/60">Collateral Ratio</div>
          <div className="mt-1 text-xl font-bold tracking-tight text-[#00ff7a]">{formatPercent(supply.collateralRatioPct, { digits: 1, sign: false })}</div>
        </div>
      </div>
    </Panel>
  );
}

export function WeeklyVolumeChart({ points }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const axis = [max, Math.round(max * 0.66), Math.round(max * 0.33), 0];

  return (
    <Panel className="p-6 md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold tracking-tight">Weekly Volume (₦)</div>
          <div className="mt-1 text-sm text-white/60">Last 7 weeks · all pools combined</div>
        </div>
        <div className="rounded-full border border-[#00ff7a33] bg-[#00ff7a12] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#00ff7a]">
          7 / 7 weeks growth
        </div>
      </div>

      <div className="relative flex h-44 items-end gap-4 pl-10">
        <div className="absolute left-0 top-0 flex h-[calc(100%-1.25rem)] w-9 flex-col justify-between text-[10px] font-semibold text-white/35">
          {axis.map((v) => (
            <span key={v}>₦{formatCompactNumber(v, { digits: 0 })}</span>
          ))}
        </div>

        {points.map((p) => {
          const h = Math.max(0.06, p.value / max);
          return (
            <div key={p.label} className="flex flex-1 flex-col items-center justify-end gap-2">
              <div className="text-xs font-bold text-white">{formatNgn(p.value, { digits: 1 })}</div>
              <div className="relative flex h-28 w-full max-w-9 flex-col justify-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-b from-[#00ff7a] to-[#00e570] shadow-[0_0_20px_rgba(0,255,122,0.18)]"
                  style={{ height: `${Math.round(h * 100)}%` }}
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white/55">{p.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function KpiCard({ kpi }) {
  const accent =
    kpi.highlight === "accent"
      ? "text-[#00ff7a]"
      : kpi.highlight === "warn"
        ? "text-[#f5b942]"
        : "text-white";

  const value =
    kpi.format === "ngn"
      ? formatNgn(kpi.value, { digits: 1 })
      : typeof kpi.value === "number" && kpi.unit === "%"
        ? `${kpi.value.toFixed(2)}%`
        : String(kpi.value);

  const delta =
    typeof kpi.deltaPct === "number"
      ? `${formatPercent(kpi.deltaPct, { digits: 2 })}`
      : typeof kpi.deltaAbs === "number"
        ? `${kpi.deltaAbs}`
        : kpi.deltaLabel;

  const trendTone = kpi.trend === "down" ? "text-[#ff5454]" : "text-[#00ff7a]";

  return (
    <Panel className="p-6">
      <div className="text-xs font-semibold text-white/60">{kpi.label}</div>
      <div className={`mt-3 text-3xl font-extrabold tracking-tight ${accent}`}>{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${trendTone}`}>
        <span>▲</span>
        <span>{delta}</span>
        <span className="font-medium text-white/50">· {kpi.window}</span>
      </div>
    </Panel>
  );
}

export function KpiRow({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k) => (
        <KpiCard key={k.id} kpi={k} />
      ))}
    </div>
  );
}
