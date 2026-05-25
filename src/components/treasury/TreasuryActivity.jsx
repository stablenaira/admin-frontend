import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";
import { SegmentedControl } from "./SegmentedControl";

function typeTone(type) {
  if (type === "mint") return { bg: "rgba(0,255,122,0.10)", fg: "#00ff7a", label: "+" };
  if (type === "burn") return { bg: "rgba(255,84,84,0.12)", fg: "#ff5454", label: "−" };
  if (type === "swap") return { bg: "rgba(245,185,66,0.10)", fg: "#f5b942", label: "↔" };
  return { bg: "rgba(107,184,255,0.10)", fg: "#6bb8ff", label: "→" };
}

function TxRow({ item }) {
  const t = typeTone(item.type);
  const amountColor = item.amount?.startsWith("+") ? "#00ff7a" : item.amount?.startsWith("−") ? "#ff5454" : "rgba(255,255,255,0.85)";

  return (
    <div className="grid grid-cols-[40px_1fr_140px_120px_80px] items-center gap-4 border-b border-white/10 px-6 py-4 last:border-b-0 hover:bg-white/4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-extrabold" style={{ background: t.bg, color: t.fg }}>
        {t.label}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-white">{item.title}</div>
        <div className="mt-1 truncate font-mono text-[11px] font-semibold text-white/35">{item.subtitle}</div>
      </div>
      <div className="text-right font-mono text-xs font-extrabold" style={{ color: amountColor }}>
        {item.amount}
      </div>
      <div className="text-right text-xs font-semibold text-white/55">{item.context}</div>
      <div className="text-right font-mono text-[11px] font-semibold text-white/35">{item.time}</div>
    </div>
  );
}

export function TreasuryActivity({ data, filter, onFilterChange }) {
  return (
    <section id="activity" className="space-y-4">
      <SectionHeader
        title="Recent"
        accent="Activity"
        right={
          <SegmentedControl
            value={filter}
            onChange={onFilterChange}
            options={[
              { value: "All", label: "All" },
              { value: "Mint", label: "Mint" },
              { value: "Burn", label: "Burn" },
              { value: "Bridge", label: "Bridge" },
            ]}
          />
        }
      />

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            {(data?.items || []).map((x) => (
              <TxRow key={x.id} item={x} />
            ))}

            {!data?.items?.length ? <div className="px-6 py-12 text-center text-sm font-semibold text-white/55">No activity</div> : null}
          </div>
        </div>
      </Panel>
    </section>
  );
}

