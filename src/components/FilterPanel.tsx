import clsx from "clsx";
import { ChangeEvent } from "react";

export interface ControlState {
  minScore: number;
  minMargin: number;
  minCagr: number;
  maxDebt: number;
  horizonYears: number;
  discountRateDelta: number;
  growthRateDelta: number;
}

interface FilterPanelProps {
  values: ControlState;
  onChange: (next: ControlState) => void;
}

const numberFormatter = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

const FieldLabel = ({
  label,
  value,
  suffix
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) => (
  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
    <span>{label}</span>
    <span className="font-semibold text-slate-200">
      {value}
      {suffix}
    </span>
  </div>
);

const SliderField = ({
  min,
  max,
  step,
  value,
  onChange,
  formatValue,
  label,
  suffix
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  label: string;
  suffix?: string;
}) => (
  <div className="space-y-2 rounded-2xl border border-white/5 bg-white/3 p-4 backdrop-blur-xl">
    <FieldLabel label={label} value={formatValue(value)} suffix={suffix} />
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
      className="w-full accent-brand-400"
    />
    <div className="flex justify-between text-[11px] uppercase tracking-wide text-slate-500">
      <span>{formatValue(min)}</span>
      <span>{formatValue(max)}</span>
    </div>
  </div>
);

const formatPercent = (value: number) => numberFormatter.format(value);
const formatNumber = (value: number) => value.toFixed(0);
const formatDelta = (value: number) => `${Math.round(value * 100)} bps`;

export function FilterPanel({ values, onChange }: FilterPanelProps) {
  const update = (patch: Partial<ControlState>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <aside className="glow-border relative grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm shadow-2xl shadow-brand-900/40 backdrop-blur-2xl">
      <div>
        <h2 className="text-lg font-semibold text-white">Signal Refinement</h2>
        <p className="text-xs text-slate-400">
          Tune intrinsic value model and filter for asymmetric upside candidates.
        </p>
      </div>

      <div className="grid gap-3">
        <SliderField
          label="Min Multibagger Score"
          min={40}
          max={95}
          step={1}
          value={values.minScore}
          onChange={(val) => update({ minScore: val })}
          formatValue={formatNumber}
        />
        <SliderField
          label="Minimum Margin of Safety"
          min={-0.1}
          max={0.6}
          step={0.01}
          value={values.minMargin}
          onChange={(val) => update({ minMargin: val })}
          formatValue={(value) => formatPercent(value)}
        />
        <SliderField
          label="Minimum 5Y CAGR"
          min={0.1}
          max={0.6}
          step={0.01}
          value={values.minCagr}
          onChange={(val) => update({ minCagr: val })}
          formatValue={(value) => formatPercent(value)}
        />
        <SliderField
          label="Max Debt to Equity"
          min={0.1}
          max={1.2}
          step={0.01}
          value={values.maxDebt}
          onChange={(val) => update({ maxDebt: val })}
          formatValue={(value) => value.toFixed(2)}
        />
      </div>

      <div className="grid gap-3">
        <div className={clsx("rounded-2xl border border-white/5 bg-brand-500/10 p-4")}>
          <FieldLabel label="Projection Horizon" value={values.horizonYears} suffix="y" />
          <input
            type="range"
            min={5}
            max={15}
            step={1}
            value={values.horizonYears}
            onChange={(event: ChangeEvent<HTMLInputElement>) => update({ horizonYears: Number(event.target.value) })}
            className="mt-3 w-full accent-brand-500"
          />
        </div>
        <SliderField
          label="Discount Rate Adjustment"
          min={-0.04}
          max={0.04}
          step={0.005}
          value={values.discountRateDelta}
          onChange={(val) => update({ discountRateDelta: val })}
          formatValue={(value) => formatDelta(value)}
        />
        <SliderField
          label="Growth Rate Adjustment"
          min={-0.08}
          max={0.08}
          step={0.005}
          value={values.growthRateDelta}
          onChange={(val) => update({ growthRateDelta: val })}
          formatValue={(value) => formatDelta(value)}
        />
      </div>
    </aside>
  );
}

export default FilterPanel;
