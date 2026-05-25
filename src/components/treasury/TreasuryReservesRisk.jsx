import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";
import { formatNgn, formatPercent } from "./format";

function Donut({ slices, size = 152, stroke = 16 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      {slices.map((s) => {
        const len = (c * s.pct) / 100;
        const dash = `${len} ${c - len}`;
        const el = (
          <circle
            key={s.symbol}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

function AlertRow({ alert }) {
  const tone =
    alert.tone === "warn"
      ? { border: "#f5b942", bg: "rgba(245,185,66,0.10)", fg: "#f5b942", icon: "!" }
      : alert.tone === "info"
        ? { border: "#6bb8ff", bg: "rgba(107,184,255,0.10)", fg: "#6bb8ff", icon: "i" }
        : { border: "#00ff7a", bg: "rgba(0,255,122,0.10)", fg: "#00ff7a", icon: "✓" };

  return (
    <div className="flex gap-3 rounded-xl border-l-2 bg-white/6 p-4" style={{ borderLeftColor: tone.border }}>
      <div className="flex h-7 w-7 flex-none items-center justify-center rounded-lg text-xs font-extrabold" style={{ background: tone.bg, color: tone.fg }}>
        {tone.icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{alert.title}</div>
        <div className="mt-1 text-xs font-medium text-white/60">{alert.message}</div>
        <div className="mt-2 font-mono text-[10px] font-semibold text-white/35">{alert.meta}</div>
      </div>
    </div>
  );
}

export function TreasuryReservesRisk({ data }) {
  return (
    <section id="reserves" className="space-y-4">
      <SectionHeader title="Reserves &" accent="Risk" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Collateral Mix</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">
              {formatPercent(data?.collateralRatioPct ?? 0, { digits: 1, sign: false })} backed
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <Donut slices={data?.collateralMix || []} />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">Total</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-white">{formatNgn(data?.totalReservesNgn ?? 0, { digits: 1 })}</div>
                <div className="mt-1 text-[11px] font-semibold text-white/55">USD equiv.</div>
              </div>
            </div>

            <div className="flex min-w-[220px] flex-1 flex-col gap-3">
              {(data?.collateralMix || []).map((r) => (
                <div key={r.symbol} className="grid grid-cols-[12px_1fr_auto_auto] items-center gap-3 text-xs font-semibold">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
                  <span className="text-white/80">{r.symbol}</span>
                  <span className="font-mono text-[11px] font-bold text-white/45">{r.pct}%</span>
                  <span className="text-xs font-extrabold text-white">{formatNgn(r.valueNgn, { digits: 1 })}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Chain Distribution</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">5 networks</div>
          </div>

          <div className="space-y-4">
            {(data?.chainDistribution || []).map((c) => (
              <div key={c.chain}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold" style={{ background: c.color, color: c.fg || "#fff" }}>
                      {c.symbol}
                    </div>
                    <span>{c.chain}</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {c.amount} <span className="ml-2 text-xs font-semibold text-white/55">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/60">
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Risk & Alerts</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">Live monitor</div>
          </div>

          <div className="space-y-3">
            {(data?.alerts || []).map((a) => (
              <AlertRow key={a.id} alert={a} />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}
