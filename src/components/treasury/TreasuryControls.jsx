import { useMemo, useState } from "react";
import { Panel } from "./Panel";
import { SectionHeader } from "./SectionHeader";
import { formatCompactNumber } from "./format";

function InfoRow({ label, value, tone = "neutral" }) {
  const cls = tone === "accent" ? "text-[#00ff7a]" : tone === "warn" ? "text-[#f5b942]" : "text-white/85";
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2.5 text-sm last:border-b-0">
      <span className="text-xs font-semibold text-white/55">{label}</span>
      <span className={`text-xs font-bold ${cls}`}>{value}</span>
    </div>
  );
}

function ActionButton({ tone, children, onClick, disabled }) {
  const cls =
    tone === "mint"
      ? "bg-[#00ff7a] text-black shadow-[0_0_32px_rgba(0,255,122,0.18)] hover:shadow-[0_4px_40px_rgba(0,255,122,0.24)]"
      : "bg-[#ff5454] text-white hover:bg-[#e64545]";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-extrabold transition ${
        disabled ? "cursor-not-allowed opacity-70" : cls
      }`}
    >
      {children}
    </button>
  );
}

function AmountInput({ value, onChange, suffixLabel, onMax }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-4 pr-28 text-lg font-extrabold tracking-tight text-white outline-none focus:border-white/20"
        placeholder="0.00"
        inputMode="decimal"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        <button
          type="button"
          onClick={onMax}
          className="rounded-md border border-white/15 bg-white/6 px-2 py-1 text-[10px] font-extrabold tracking-wide text-white/70 hover:text-white"
        >
          MAX
        </button>
        <span className="text-sm font-extrabold text-white/85">{suffixLabel}</span>
      </div>
    </div>
  );
}

function TargetInput({ value }) {
  return (
    <input
      value={value}
      readOnly
      className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm font-semibold text-white/75 outline-none"
    />
  );
}

export function TreasuryControls({ data }) {
  const mintHeadroom = data?.mint?.headroomSNR ?? 0;
  const burnTreasury = data?.burn?.treasurySNR ?? 0;

  const [mintAmount, setMintAmount] = useState("1,000,000.00");
  const [burnAmount, setBurnAmount] = useState("500,000.00");
  const [mintStatus, setMintStatus] = useState("Initiate Mint · Awaits 3 signers");
  const [burnStatus, setBurnStatus] = useState("Initiate Burn · Awaits 3 signers");

  const mintAvailLabel = useMemo(() => `Headroom ${formatCompactNumber(mintHeadroom, { digits: 1 })} SNR`, [mintHeadroom]);
  const burnAvailLabel = useMemo(() => `Treasury ${formatCompactNumber(burnTreasury, { digits: 1 })} SNR`, [burnTreasury]);

  const flash = async (setter, original) => {
    setter("✓ Signature requested");
    await new Promise((r) => setTimeout(r, 1300));
    setter(original);
  };

  return (
    <section id="controls" className="space-y-4">
      <SectionHeader
        title="Supply"
        accent="Controls"
        pill={{ label: `Multisig ${data?.multisig?.threshold || "3-of-5 required"}`, tone: "neutral", leftDot: true }}
      />

      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <Panel className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">
                Mint <span className="text-[#00ff7a]">SNR</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-white/55">Creates new supply against reserves</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00ff7a12] text-[#00ff7a]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/55">
            <span>Amount to mint</span>
            <span className="font-mono text-[11px] text-white/45">{mintAvailLabel}</span>
          </div>
          <AmountInput value={mintAmount} onChange={setMintAmount} suffixLabel="SNR" onMax={() => setMintAmount(`${mintHeadroom.toLocaleString("en-US")}.00`)} />

          <div className="mt-4 mb-2 text-xs font-semibold text-white/55">Destination · Chain</div>
          <TargetInput value={data?.mint?.destination || "—"} />

          <div className="mt-4">
            <InfoRow label="New circulating supply" value={data?.mint?.newCirculating || "—"} />
            <InfoRow label="Required collateral" value={data?.mint?.requiredCollateral || "—"} />
            <InfoRow label="Post-mint ratio" value={data?.mint?.postRatio || "—"} tone="accent" />
            <InfoRow label="Gas estimate" value={data?.mint?.gasEstimate || "—"} />
          </div>

          <ActionButton
            tone="mint"
            onClick={() => flash(setMintStatus, "Initiate Mint · Awaits 3 signers")}
            disabled={false}
          >
            {mintStatus}
          </ActionButton>
        </Panel>

        <Panel className="p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold tracking-tight">
                Burn <span className="text-[#ff5454]">SNR</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-white/55">Reduces circulating supply</div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff545412] text-[#ff5454]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
              </svg>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/55">
            <span>Amount to burn</span>
            <span className="font-mono text-[11px] text-white/45">{burnAvailLabel}</span>
          </div>
          <AmountInput value={burnAmount} onChange={setBurnAmount} suffixLabel="SNR" onMax={() => setBurnAmount(`${burnTreasury.toLocaleString("en-US")}.00`)} />

          <div className="mt-4 mb-2 text-xs font-semibold text-white/55">Source · Chain</div>
          <TargetInput value={data?.burn?.source || "—"} />

          <div className="mt-4">
            <InfoRow label="New circulating supply" value={data?.burn?.newCirculating || "—"} />
            <InfoRow label="Collateral released" value={data?.burn?.collateralReleased || "—"} />
            <InfoRow label="Post-burn ratio" value={data?.burn?.postRatio || "—"} tone="accent" />
            <InfoRow label="Gas estimate" value={data?.burn?.gasEstimate || "—"} />
          </div>

          <ActionButton tone="burn" onClick={() => flash(setBurnStatus, "Initiate Burn · Awaits 3 signers")} disabled={false}>
            {burnStatus}
          </ActionButton>
        </Panel>
      </div>
    </section>
  );
}
