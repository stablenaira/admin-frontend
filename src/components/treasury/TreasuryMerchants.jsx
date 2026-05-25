import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";
import { SegmentedControl } from "./SegmentedControl";

function toneToColors(tone) {
  if (tone === "good") return { bg: "rgba(0,255,122,0.10)", fg: "#00ff7a" };
  if (tone === "warn") return { bg: "rgba(245,185,66,0.10)", fg: "#f5b942" };
  if (tone === "info") return { bg: "rgba(107,184,255,0.10)", fg: "#6bb8ff" };
  if (tone === "paused") return { bg: "rgba(245,185,66,0.10)", fg: "#f5b942" };
  return { bg: "rgba(255,255,255,0.08)", fg: "rgba(255,255,255,0.70)" };
}

function MerchantKpi({ label, value, subtitle, tone = "neutral" }) {
  const t = toneToColors(tone);
  return (
    <Panel className="p-6">
      <div className="text-xs font-semibold text-white/60">{label}</div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight" style={{ color: t.fg }}>
        {value}
      </div>
      <div className="mt-2 text-xs font-semibold text-white/55">{subtitle}</div>
    </Panel>
  );
}

function CategoryTag({ category }) {
  const t = toneToColors(category.tone);
  return (
    <span className="inline-flex rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide" style={{ background: t.bg, color: t.fg }}>
      {category.label}
    </span>
  );
}

function TierBadge({ tier }) {
  const t = tier === "T1" ? toneToColors("good") : tier === "T2" ? toneToColors("info") : toneToColors("neutral");
  return (
    <span className="inline-flex rounded-md px-2 py-1 font-mono text-[11px] font-extrabold tracking-wide" style={{ background: t.bg, color: t.fg }}>
      {tier}
    </span>
  );
}

function Quota({ used, cap }) {
  const pct = cap > 0 ? (used / cap) * 100 : 0;
  const tone = pct >= 90 ? "warn" : pct >= 70 ? "warn" : "good";
  const fill =
    tone === "warn"
      ? "bg-gradient-to-r from-[#f5b942] to-[#ffd97a]"
      : "bg-gradient-to-r from-[#00e570] to-[#00ff7a]";
  return (
    <div className="min-w-[180px]">
      <div className="mb-1 flex justify-between font-mono text-[11px] font-semibold">
        <span className="text-white font-extrabold">{used.toFixed(1)}M</span>
        <span className="text-white/35">/ {cap}M</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-black/60">
        <div className={`h-full ${fill}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
    </div>
  );
}

function StatusCell({ status }) {
  const dot = status.tone === "good" ? "#00ff7a" : status.tone === "paused" ? "#f5b942" : "rgba(255,255,255,0.45)";
  const fg = status.tone === "good" ? "#00ff7a" : status.tone === "paused" ? "#f5b942" : "rgba(255,255,255,0.70)";
  return (
    <span className="inline-flex items-center justify-center gap-2 text-xs font-bold" style={{ color: fg }}>
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />
      {status.label}
    </span>
  );
}

function NetFlow({ value }) {
  const up = value >= 0;
  return (
    <span className="font-mono text-xs font-extrabold" style={{ color: up ? "#00ff7a" : "#f5b942" }}>
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(1)}M
    </span>
  );
}

function MerchantCell({ merchant }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold" style={{ background: merchant.logo.bg, color: merchant.logo.fg }}>
        {merchant.logo.letter}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{merchant.name}</div>
        <div className="mt-1 truncate font-mono text-[11px] font-semibold text-white/35">{merchant.meta}</div>
      </div>
    </div>
  );
}

export function TreasuryMerchants({ data, timeframe, onTimeframeChange }) {
  const s = data?.stats;
  return (
    <section id="merchants" className="space-y-4">
      <SectionHeader
        title="Authorized"
        accent="Merchants"
        right={
          <div className="flex items-center gap-2">
            <Panel className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff7a] shadow-[0_0_8px_rgba(0,255,122,0.7)]" />
                {s?.activeCount ?? "—"} active · {s?.pendingCount ?? "—"} pending
              </div>
            </Panel>
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
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MerchantKpi label="Total Minted (Merchants)" value={`${(s?.totalMintedM ?? 0).toFixed(1)}M SNR`} subtitle={`▲ 12.4% · ${timeframe.toLowerCase()}`} tone="good" />
        <MerchantKpi label="Total Burned (Merchants)" value={`${(s?.totalBurnedM ?? 0).toFixed(1)}M SNR`} subtitle={`▲ 8.1% · ${timeframe.toLowerCase()}`} tone="warn" />
        <MerchantKpi label="Net Merchant Inflow" value={`+${(s?.netInflowM ?? 0).toFixed(1)}M`} subtitle="Net mint over window" tone="good" />
        <MerchantKpi label="Fees Collected (0.10%)" value={`₦${(s?.feesK ?? 0).toFixed(1)}K`} subtitle="From merchants" tone="neutral" />
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead className="bg-white/4">
              <tr className="border-y border-white/10 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Tier</th>
                <th className="px-6 py-4">Daily Quota</th>
                <th className="px-6 py-4 text-right">Minted</th>
                <th className="px-6 py-4 text-right">Burned</th>
                <th className="px-6 py-4 text-right">Net flow</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {(data?.merchants || []).map((m) => (
                <tr key={m.id} className="border-b border-white/10 hover:bg-white/4">
                  <td className="px-6 py-5">
                    <MerchantCell merchant={m} />
                  </td>
                  <td className="px-6 py-5">
                    <CategoryTag category={m.category} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <TierBadge tier={m.tier} />
                  </td>
                  <td className="px-6 py-5">
                    <Quota used={m.quotaUsed} cap={m.quotaCap} />
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xs font-extrabold text-white">{m.minted.toFixed(1)}M</td>
                  <td className="px-6 py-5 text-right font-mono text-xs font-extrabold text-white">{m.burned.toFixed(1)}M</td>
                  <td className="px-6 py-5 text-right">
                    <NetFlow value={m.net} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusCell status={m.status} />
                  </td>
                </tr>
              ))}

              {!data?.merchants?.length ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm font-semibold text-white/55">
                    No merchants found
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

