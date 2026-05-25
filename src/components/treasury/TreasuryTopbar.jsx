import { useMemo, useState } from "react";
import { StatusPill } from "./StatusPill";

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#00ff7a] to-[#008f44] text-sm font-extrabold text-black shadow-[0_0_24px_rgba(0,255,122,0.18)]">
        ₦
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-bold tracking-tight">StableNaira</span>
        <span className="text-xs font-medium text-white/50">/ treasury</span>
      </div>
    </div>
  );
}

function AdminChip({ initials, handle }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 py-1 pl-1 pr-3 text-xs text-white/80">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#00ff7a] to-[#008f44] text-[11px] font-extrabold text-black">
        {initials}
      </div>
      <span className="font-semibold">{handle}</span>
    </div>
  );
}

export function TreasuryTopbar({ pegValue, alertCount, admin, links = null }) {
  const resolvedLinks = useMemo(() => {
    if (links === null) return null;
    if (Array.isArray(links)) return links;
    return null;
  }, [links]);
  const [active, setActive] = useState(resolvedLinks?.[0]?.id || "overview");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-6 px-6">
        <Logo />

        {resolvedLinks?.length ? (
          <nav className="hidden items-center gap-1 md:flex">
            {resolvedLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setActive(l.id)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  active === l.id
                    ? "bg-[#00ff7a12] text-[#00ff7a]"
                    : "text-white/60 hover:bg-white/6 hover:text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <StatusPill tone="accent" leftDot>
            Peg ₦{pegValue}
          </StatusPill>
          <StatusPill tone="warn" leftDot>
            {alertCount} alerts
          </StatusPill>
          <AdminChip initials={admin?.initials || "AO"} handle={admin?.handle || "admin.eth"} />
        </div>
      </div>
    </header>
  );
}
