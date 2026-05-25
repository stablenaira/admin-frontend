export function SegmentedControl({ value, options, onChange, className = "" }) {
  return (
    <div className={`inline-flex rounded-full border border-white/10 bg-white/6 p-1 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active ? "bg-[#00ff7a] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

