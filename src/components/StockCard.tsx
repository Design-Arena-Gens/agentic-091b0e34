import { StockAnalysis } from "@/lib/types";
import MetricBadge from "./MetricBadge";
import ProjectionChart from "./ProjectionChart";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1
});

interface StockCardProps {
  analysis: StockAnalysis;
}

export const StockCard = ({ analysis }: StockCardProps) => {
  const { stock, intrinsic, future, score, tags } = analysis;

  return (
    <article className="glow-border flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-brand-900/40 backdrop-blur-2xl transition-transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-800/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-100">
              {stock.ticker}
            </span>
            <span className="text-xs uppercase tracking-wide text-slate-400">{stock.sector}</span>
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white">{stock.name}</h3>
          <p className="text-sm text-slate-400">
            Price&nbsp;
            <span className="text-brand-200">{currencyFormatter.format(stock.price)}</span>
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-right">
            <p className="text-[11px] uppercase tracking-wide text-emerald-200">Multibagger Score</p>
            <p className="text-2xl font-bold text-emerald-300">{score}</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricBadge label="Intrinsic Value" value={currencyFormatter.format(intrinsic.intrinsicValue)} tone="positive" />
        <MetricBadge label="Safety Margin" value={percentFormatter.format(intrinsic.marginOfSafety)} tone="positive" />
        <MetricBadge label="Upside Potential" value={`${Math.round((intrinsic.intrinsicValue / stock.price - 1) * 100)}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-3">
          <MetricBadge label="5Y CAGR" value={percentFormatter.format(stock.fiveYearCAGR)} />
          <MetricBadge label="Revenue Growth" value={percentFormatter.format(stock.revenueGrowth)} />
          <MetricBadge label="Return on Invested Capital" value={percentFormatter.format(stock.roic)} />
          <MetricBadge label="Debt / Equity" value={stock.debtToEquity.toFixed(2)} />
          <MetricBadge label="Moat Rating" value={`${Math.round(stock.moatRating * 100)}/100`} />
        </div>
        <ProjectionChart data={future} />
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/5 bg-black/30 p-4 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Discounted Cash Flow</span>
          <span className="text-slate-100">{currencyFormatter.format(intrinsic.cashFlowSum)}</span>
        </div>
        <div className="flex justify-between">
          <span>Terminal Value (discounted)</span>
          <span className="text-slate-100">{currencyFormatter.format(intrinsic.terminalValue)}</span>
        </div>
        <div className="flex justify-between">
          <span>FCF / Share</span>
          <span className="text-slate-100">
            {currencyFormatter.format(stock.freeCashFlow / stock.sharesOutstanding)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>PE / PEG</span>
          <span className="text-slate-100">
            {stock.peRatio.toFixed(1)} &bull; {stock.pegRatio.toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default StockCard;
