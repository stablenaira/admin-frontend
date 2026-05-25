import { useState } from "react";
import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";

function QueueTone(tone) {
  if (tone === "good") return { fg: "#00ff7a" };
  if (tone === "warn") return { fg: "#f5b942" };
  if (tone === "info") return { fg: "#6bb8ff" };
  return { fg: "rgba(255,255,255,0.70)" };
}

function QueueItem({ item }) {
  const [label, setLabel] = useState(item.action);
  const dots = Array.from({ length: 5 }, (_, i) => i < item.signed);
  const actionTone = item.action === "Execute" ? "bg-[#00ff7a] text-black" : "bg-[#00ff7a] text-black";

  const click = async () => {
    const orig = label;
    setLabel("✓ Requested");
    await new Promise((r) => setTimeout(r, 1200));
    setLabel(orig);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/6 p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.10em] text-white/55">{item.type}</div>
        <div className="text-lg font-extrabold tracking-tight" style={{ color: QueueTone(item.tone).fg }}>
          {item.amount}
        </div>
      </div>

      <div className="mb-3 flex gap-1.5">
        {dots.map((signed, idx) => (
          <div key={idx} className={`h-1.5 flex-1 rounded-full ${signed ? "bg-[#00ff7a]" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-white/55">
        <span>
          {item.signed} of {item.required} signed · {item.ttl}
        </span>
        <button type="button" onClick={click} className={`rounded-md px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] ${actionTone}`}>
          {label}
        </button>
      </div>
    </div>
  );
}

function OracleRow({ oracle }) {
  const border = oracle.tone === "dim" ? "rgba(255,255,255,0.22)" : "#00ff7a";
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border-l-2 bg-white/6 p-4" style={{ borderLeftColor: border }}>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white">{oracle.name}</div>
        <div className="mt-1 text-xs font-semibold text-white/45">{oracle.source}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-extrabold text-white">{oracle.price}</div>
        <div className="mt-1 font-mono text-[10px] font-semibold text-white/35">{oracle.ago}</div>
      </div>
    </div>
  );
}

function HolderTag({ tag, tone }) {
  const cls =
    tone === "good"
      ? "bg-[#00ff7a12] text-[#00ff7a]"
      : tone === "warn"
        ? "bg-[#f5b94212] text-[#f5b942]"
        : tone === "info"
          ? "bg-[#6bb8ff12] text-[#6bb8ff]"
          : "bg-white/8 text-white/65";
  return <span className={`ml-2 inline-flex rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${cls}`}>{tag}</span>;
}

function HolderRow({ holder }) {
  return (
    <div className="grid grid-cols-[30px_1fr_auto_auto] items-center gap-3 border-b border-white/10 py-3 text-xs font-semibold last:border-b-0">
      <div className="font-mono text-[11px] font-extrabold text-white/35">{holder.rank}</div>
      <div className="min-w-0">
        <span className="font-mono text-xs font-extrabold text-white">{holder.address}</span>
        <HolderTag tag={holder.tag} tone={holder.tagTone} />
      </div>
      <div className="font-mono text-xs font-extrabold text-white">{holder.balance}</div>
      <div className="min-w-[52px] text-right font-mono text-[11px] font-bold text-white/55">{holder.pct}</div>
    </div>
  );
}

export function TreasuryGovernance({ data }) {
  return (
    <section id="governance" className="space-y-4">
      <SectionHeader title="Operations &" accent="Governance" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Pending Multisig</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">{data?.multisigQueue?.length ?? "—"} items</div>
          </div>
          <div className="space-y-3">
            {(data?.multisigQueue || []).map((q) => (
              <QueueItem key={q.id} item={q} />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Oracle Feeds</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">All synced</div>
          </div>
          <div className="space-y-3">
            {(data?.oracles || []).map((o) => (
              <OracleRow key={o.id} oracle={o} />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-lg font-bold tracking-tight">Top Holders</div>
            <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/65">Concentration</div>
          </div>
          <div>
            {(data?.topHolders || []).map((h) => (
              <HolderRow key={h.id} holder={h} />
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

