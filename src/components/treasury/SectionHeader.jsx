import { StatusPill } from "./StatusPill";

export function SectionHeader({ title, accent, right, pill }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 px-1">
      <h2 className="text-2xl font-bold tracking-tight">
        {title} {accent ? <span className="text-[#00ff7a]">{accent}</span> : null}
      </h2>
      <div className="flex items-center gap-2">
        {pill ? (
          <StatusPill tone={pill.tone || "neutral"} leftDot={pill.leftDot}>
            {pill.label}
          </StatusPill>
        ) : null}
        {right}
      </div>
    </div>
  );
}

