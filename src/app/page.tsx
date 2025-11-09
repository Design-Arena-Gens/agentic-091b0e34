/* eslint-disable react/no-array-index-key */
"use client";

import { useMemo, useState } from "react";
import FilterPanel, { ControlState } from "@/components/FilterPanel";
import StockCard from "@/components/StockCard";
import { stocks } from "@/lib/data";
import { calculateIntrinsicValue, generateTags, projectFutureValue, scoreStock } from "@/lib/calculations";
import { StockAnalysis, ValuationOverrides } from "@/lib/types";

const defaultControls: ControlState = {
  minScore: 68,
  minMargin: 0.12,
  minCagr: 0.22,
  maxDebt: 0.75,
  horizonYears: 10,
  discountRateDelta: 0,
  growthRateDelta: 0
};

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const formatPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1
});

const Statistic = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-4">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);

export default function Home() {
  const [controls, setControls] = useState<ControlState>(defaultControls);

  const overrides = useMemo<ValuationOverrides>(
    () => ({
      horizonYears: controls.horizonYears,
      discountRateDelta: controls.discountRateDelta,
      growthRateDelta: controls.growthRateDelta
    }),
    [controls]
  );

  const analysis = useMemo<StockAnalysis[]>(() => {
    return stocks.map((stock) => {
      const intrinsic = calculateIntrinsicValue(stock, overrides);
      const future = projectFutureValue(stock, overrides, overrides.horizonYears);
      const score = scoreStock(stock, intrinsic);
      const tags = generateTags(stock, intrinsic);

      return {
        stock,
        intrinsic,
        future,
        score,
        tags
      };
    });
  }, [overrides]);

  const filtered = useMemo(() => {
    return analysis
      .filter(
        ({ stock, intrinsic, score }) =>
          score >= controls.minScore &&
          intrinsic.marginOfSafety >= controls.minMargin &&
          stock.fiveYearCAGR >= controls.minCagr &&
          stock.debtToEquity <= controls.maxDebt
      )
      .sort((a, b) => b.score - a.score);
  }, [analysis, controls]);

  const aggregate = useMemo(() => {
    if (!filtered.length) {
      return {
        count: 0,
        avgMargin: 0,
        avgUpside: 0,
        bestIntrinsic: 0,
        topName: ""
      };
    }

    const avgMargin =
      filtered.reduce((acc, { intrinsic }) => acc + intrinsic.marginOfSafety, 0) / filtered.length;
    const avgUpside =
      filtered.reduce((acc, { intrinsic, stock }) => acc + (intrinsic.intrinsicValue / stock.price - 1), 0) /
      filtered.length;
    const top = filtered[0];

    return {
      count: filtered.length,
      avgMargin,
      avgUpside,
      bestIntrinsic: top?.intrinsic.intrinsicValue ?? 0,
      topName: top?.stock.name ?? ""
    };
  }, [filtered]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="mb-12 grid gap-8 lg:grid-cols-[320px_1fr]">
        <FilterPanel values={controls} onChange={setControls} />
        <div className="space-y-8">
          <header className="glow-border rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 shadow-2xl shadow-brand-900/40 backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Multibagger Radar</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Discover asymmetric upside with intrinsic value intelligence.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              This scanner blends discounted cash flows, quality factors, and growth durability to surface
              candidates capable of compounding into multibagger territory. Adjust macro assumptions, compress
              discount rates, and stress-test scenarios in real time.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Statistic label="Qualified Candidates" value={`${aggregate.count}`} />
            <Statistic label="Average Margin of Safety" value={formatPercent.format(aggregate.avgMargin)} />
            <Statistic label="Average Upside vs Price" value={formatPercent.format(aggregate.avgUpside)} />
            <Statistic
              label="Top Candidate Intrinsic"
              value={aggregate.bestIntrinsic ? formatCurrency.format(aggregate.bestIntrinsic) : "—"}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {filtered.length ? (
          filtered.map((analysisItem, index) => <StockCard key={`${analysisItem.stock.ticker}-${index}`} analysis={analysisItem} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-300">
            <p className="text-lg font-semibold text-white">No candidates match the current filters.</p>
            <p className="mt-2 text-sm text-slate-400">
              Relax the constraints or extend the horizon to surface emerging multibagger setups.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
