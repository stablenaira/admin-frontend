export function StatusPill({ tone = "neutral", leftDot = false, children, className = "" }) {
  const toneClasses =
    tone === "accent"
      ? "border-[#00ff7a33] bg-[#00ff7a12] text-[#00ff7a]"
      : tone === "warn"
        ? "border-[#f5b94233] bg-[#f5b94212] text-[#f5b942]"
        : "border-white/10 bg-white/6 text-white/70";

  const dotClasses =
    tone === "accent"
      ? "bg-[#00ff7a] shadow-[0_0_10px_rgba(0,255,122,0.9)]"
      : tone === "warn"
        ? "bg-[#f5b942] shadow-[0_0_10px_rgba(245,185,66,0.8)]"
        : "bg-white/40";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${toneClasses} ${className}`}
    >
      {leftDot ? <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`} /> : null}
      <span className="whitespace-nowrap">{children}</span>
    </div>
  );
}

