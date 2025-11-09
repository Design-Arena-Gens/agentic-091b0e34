import clsx from "clsx";

interface MetricBadgeProps {
  label: string;
  value: string;
  tone?: "positive" | "neutral" | "negative";
}

export const MetricBadge = ({ label, value, tone = "neutral" }: MetricBadgeProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-2xl border px-4 py-3 text-xs uppercase tracking-wide",
        tone === "positive" && "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
        tone === "neutral" && "border-white/10 bg-white/5 text-slate-200",
        tone === "negative" && "border-rose-500/40 bg-rose-500/15 text-rose-100"
      )}
    >
      <span className="text-[11px] font-semibold text-white/70">{label}</span>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
};

export default MetricBadge;
