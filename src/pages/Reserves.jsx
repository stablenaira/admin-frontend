import { useEffect, useMemo, useState } from "react";
import { TreasuryTopbar } from "../components/treasury/TreasuryTopbar";
import { TreasuryPageHeader } from "../components/treasury/TreasuryPageHeader";
import { TreasuryReservesRisk } from "../components/treasury/TreasuryReservesRisk";
import { formatPeg } from "../components/treasury/format";
import { fetchReservesRisk, fetchTreasuryOverview } from "../services/treasuryMockApi";

function LoadingBlock({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm font-semibold text-white/60">
      {label}
    </div>
  );
}

export default function Reserves() {
  const [overview, setOverview] = useState(null);
  const [reserves, setReserves] = useState(null);
  const [error, setError] = useState(null);
  const [lastSyncSeconds, setLastSyncSeconds] = useState(9);

  const meta = useMemo(
    () => ({
      networkCount: overview?.networkCount,
      poolCount: overview?.poolCount,
      merchantCount: overview?.merchantCount,
    }),
    [overview],
  );

  useEffect(() => {
    const id = setInterval(() => setLastSyncSeconds((s) => (s >= 59 ? 0 : s + 1)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setError(null);
    fetchTreasuryOverview({ signal: controller.signal })
      .then(setOverview)
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to load overview");
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchReservesRisk({ signal: controller.signal })
      .then(setReserves)
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Failed to load reserves");
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="text-white" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <TreasuryTopbar pegValue={formatPeg(overview?.peg?.value)} alertCount={overview?.alertCount ?? 0} admin={overview?.admin} />

      <main className="mx-auto max-w-[1600px] space-y-8 px-6 py-10">
        <section className="space-y-6">
          <TreasuryPageHeader meta={meta} lastSyncLabel={`${lastSyncSeconds}s ago`} />

          {error ? (
            <div className="rounded-2xl border border-[#ff545433] bg-[#ff545412] px-4 py-3 text-sm font-semibold text-[#ff5454]">
              {error}
            </div>
          ) : null}

          {!reserves ? <LoadingBlock label="Loading reserves…" /> : <TreasuryReservesRisk data={reserves} />}
        </section>
      </main>
    </div>
  );
}

