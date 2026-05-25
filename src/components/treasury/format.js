const compact = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 1 });
const compact2 = new Intl.NumberFormat("en-NG", { notation: "compact", maximumFractionDigits: 2 });

export function formatCompactNumber(value, { digits = 1 } = {}) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return (digits === 2 ? compact2 : compact).format(n);
}

export function formatNgn(value, { digits = 1 } = {}) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return `₦${formatCompactNumber(n, { digits })}`;
}

export function formatPercent(value, { digits = 2, sign = true } = {}) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n).toFixed(digits);
  const prefix = sign ? (n >= 0 ? "+" : "−") : "";
  return `${prefix}${abs}%`;
}

export function formatPeg(value) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(4);
}

