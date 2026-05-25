import { Panel } from "./Panel";
import { SegmentedControl } from "./SegmentedControl";
import { SectionHeader } from "./SectionHeader";
import { formatNgn, formatPercent } from "./format";

function DexTag({ dex, chain }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-white/70">
      <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
      {dex} · {chain}
    </span>
  );
}

function RatioBar({ snrPct, snrAmount, counterAmount, counterSymbol }) {
  const otherPct = Math.max(0, 100 - snrPct);
  return (
    <div className="min-w-[220px]">
      <div className="mb-2 flex h-2 overflow-hidden rounded-full bg-black/60">
        <div
          className="h-full bg-gradient-to-r from-[#00e570] to-[#00ff7a] shadow-[0_0_10px_rgba(0,255,122,0.18)]"
          style={{ width: `${snrPct}%` }}
        />
        <div className="h-full bg-white/20" style={{ width: `${otherPct}%` }} />
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-white/55">
        <span className="text-[#00ff7a]">
          {snrAmount} · {snrPct}%
        </span>
        <span>
          {counterAmount} {counterSymbol} · {otherPct}%
        </span>
      </div>
    </div>
  );
}

function HealthPill({ health, tone }) {
  const classes =
    tone === "good"
      ? "text-[#00ff7a] before:bg-[#00ff7a] before:shadow-[0_0_8px_rgba(0,255,122,0.9)]"
      : "text-[#f5b942] before:bg-[#f5b942] before:shadow-[0_0_8px_rgba(245,185,66,0.8)]";
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-bold ${classes} before:h-2 before:w-2 before:rounded-full before:content-['']`}>
      {health}
    </span>
  );
}

function PoolCell({ pool }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-9 w-14">
        <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-gradient-to-br from-[#00ff7a] to-[#006d44] text-sm font-extrabold text-black">
          ₦
        </div>
        <div
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-sm font-bold"
          style={{ background: pool.counterBadge?.bg, color: pool.counterBadge?.fg }}
        >
          {pool.counterBadge?.label}
        </div>
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{pool.name}</div>
        <div className="mt-1 font-mono text-[11px] font-semibold text-white/35">{pool.address}</div>
      </div>
    </div>
  );
}

export function TreasuryPoolsSection({ data, timeframe, onTimeframeChange }) {
  return (
    <section id="pools" className="space-y-4">
      <SectionHeader
        title="Liquidity"
        accent="Pools"
        right={
          <SegmentedControl
            value={timeframe}
            onChange={onTimeframeChange}
            options={[
              { value: "24H", label: "24H" },
              { value: "7D", label: "7D" },
              { value: "30D", label: "30D" },
              { value: "1Y", label: "1Y" },
            ]}
          />
        }
      />

      <Panel className="overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/60">
            <span>
              <span className="font-extrabold text-white">{data?.stats?.total ?? "—"}</span> pools
            </span>
            <span>
              <span className="font-extrabold text-[#00ff7a]">{data?.stats?.healthy ?? "—"}</span> healthy
            </span>
            <span className="text-[#f5b942]">{data?.stats?.imbalanced ?? "—"} imbalanced</span>
            <span>
              · win rate{" "}
              <span className="font-extrabold text-[#00ff7a]">
                {formatPercent(data?.stats?.winRatePct ?? 0, { digits: 1, sign: false })}
              </span>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead className="bg-white/4">
              <tr className="border-y border-white/10 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                <th className="px-6 py-4">Pool</th>
                <th className="px-6 py-4">DEX · Chain</th>
                <th className="px-6 py-4">SNR / Counter</th>
                <th className="px-6 py-4 text-right">TVL</th>
                <th className="px-6 py-4 text-right">Vol 24H</th>
                <th className="px-6 py-4 text-right">Vol {timeframe}</th>
                <th className="px-6 py-4 text-right">Vol 1Y</th>
                <th className="px-6 py-4 text-center">Health</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(data?.pools || []).map((p) => (
                <tr key={p.id} className="border-b border-white/10 hover:bg-white/4">
                  <td className="px-6 py-5">
                    <PoolCell pool={p} />
                  </td>
                  <td className="px-6 py-5">
                    <DexTag dex={p.dex} chain={p.chain} />
                  </td>
                  <td className="px-6 py-5">
                    <RatioBar snrPct={p.snrPct} snrAmount={p.snrAmount} counterAmount={p.counterAmount} counterSymbol={p.counterSymbol} />
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-white">{formatNgn(p.tvlNgn, { digits: 1 })}</td>
                  <td className="px-6 py-5 text-right text-white/75">{formatNgn(p.vol24hNgn, { digits: 1 })}</td>
                  <td className="px-6 py-5 text-right text-white/75">{formatNgn(p.vol30dNgn, { digits: 1 })}</td>
                  <td className="px-6 py-5 text-right text-white/75">{formatNgn(p.vol1yNgn, { digits: 1 })}</td>
                  <td className="px-6 py-5 text-center">
                    <HealthPill health={p.health} tone={p.healthTone} />
                  </td>
                </tr>
              ))}

              {!data?.pools?.length ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm font-semibold text-white/55">
                    No pools found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

