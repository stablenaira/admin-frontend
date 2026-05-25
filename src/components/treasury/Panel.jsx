export function Panel({ className = "", children, ...props }) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/7 via-white/4 to-transparent ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
