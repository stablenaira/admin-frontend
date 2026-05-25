import { StatusPill } from "./StatusPill";

export function TreasuryPageHeader({ meta, lastSyncLabel }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          StableNaira <span className="text-[#00ff7a]">Treasury</span>
        </h1>
        <p className="mt-3 text-sm font-semibold text-white/60">
          Live on-chain · {meta?.networkCount ?? "—"} networks · {meta?.poolCount ?? "—"} pools · {meta?.merchantCount ?? "—"} merchants
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusPill leftDot tone="neutral">
          Last sync <span className="ml-2 font-mono text-[11px] font-bold text-white/70">{lastSyncLabel}</span>
        </StatusPill>
      </div>
    </div>
  );
}

