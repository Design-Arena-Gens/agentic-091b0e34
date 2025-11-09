import { FutureProjectionPoint, IntrinsicValueResult, Stock, ValuationOverrides } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const safeRate = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return value;
};

export const calculateIntrinsicValue = (
  stock: Stock,
  overrides?: Partial<ValuationOverrides>
): IntrinsicValueResult => {
  const horizonYears = overrides?.horizonYears ?? 10;
  const discountRate = clamp(stock.discountRate + (overrides?.discountRateDelta ?? 0), 0.06, 0.22);
  const growthRate = clamp(stock.fcfGrowthRate + (overrides?.growthRateDelta ?? 0), 0.02, 0.45);
  const terminalGrowth = clamp(stock.terminalGrowth + (overrides?.growthRateDelta ?? 0) * 0.35, 0.01, discountRate - 0.01);

  const fcfPerShare = safeRate(stock.freeCashFlow / stock.sharesOutstanding);
  let projectedCashFlow = fcfPerShare;
  let discountedCashFlowSum = 0;

  for (let year = 1; year <= horizonYears; year += 1) {
    projectedCashFlow *= 1 + growthRate;
    const discountedCF = projectedCashFlow / Math.pow(1 + discountRate, year);
    discountedCashFlowSum += discountedCF;
  }

  const terminalCashFlow = projectedCashFlow * (1 + terminalGrowth);
  const undiscountedTerminalValue = terminalCashFlow / (discountRate - terminalGrowth);
  const discountedTerminalValue = undiscountedTerminalValue / Math.pow(1 + discountRate, horizonYears);

  const intrinsicValue = discountedCashFlowSum + discountedTerminalValue + stock.cashPerShare;
  const marginOfSafety = clamp((intrinsicValue - stock.price) / intrinsicValue, -0.9, 0.95);

  return {
    intrinsicValue,
    terminalValue: discountedTerminalValue,
    cashFlowSum: discountedCashFlowSum,
    marginOfSafety
  };
};

export const projectFutureValue = (
  stock: Stock,
  overrides?: Partial<ValuationOverrides>,
  years = 10
): FutureProjectionPoint[] => {
  const baseGrowth = clamp(stock.fiveYearCAGR + (overrides?.growthRateDelta ?? 0), 0.02, 0.6);
  const optimisticDelta = 0.06;
  const pessimisticDelta = 0.04;
  const currentYear = new Date().getFullYear();

  return Array.from({ length: years }, (_, index) => {
    const yearIndex = index + 1;
    const projectedPrice = stock.price * Math.pow(1 + baseGrowth, yearIndex);
    const optimistic = stock.price * Math.pow(1 + baseGrowth + optimisticDelta, yearIndex);
    const pessimistic = stock.price * Math.pow(1 + Math.max(baseGrowth - pessimisticDelta, 0.02), yearIndex);

    return {
      year: currentYear + yearIndex,
      projectedPrice,
      optimistic,
      pessimistic
    };
  });
};

const normalize = (value: number, min: number, max: number) => {
  if (max === min) return 0.5;
  return clamp((value - min) / (max - min), 0, 1);
};

export const scoreStock = (stock: Stock, intrinsic: IntrinsicValueResult): number => {
  const marginScore = normalize(intrinsic.marginOfSafety, -0.2, 0.6);
  const growthScore = normalize(stock.fiveYearCAGR, 0.1, 0.6);
  const qualityScore = normalize(stock.roic, 0.08, 0.35);
  const leverageScore = 1 - normalize(stock.debtToEquity, 0.1, 1.2);
  const moatScore = clamp(stock.moatRating, 0, 1);

  const weighted =
    marginScore * 0.28 +
    growthScore * 0.3 +
    qualityScore * 0.18 +
    leverageScore * 0.1 +
    moatScore * 0.14;

  return Math.round(weighted * 100);
};

export const generateTags = (stock: Stock, intrinsic: IntrinsicValueResult): string[] => {
  const tags = new Set<string>();
  if (intrinsic.marginOfSafety > 0.25) tags.add("Deep Value");
  if (stock.fiveYearCAGR > 0.35) tags.add("High Growth");
  if (stock.roic > 0.2) tags.add("High ROIC");
  if (stock.debtToEquity < 0.4) tags.add("Low Leverage");
  if (stock.moatRating > 0.85) tags.add("Wide Moat");
  if (stock.profitMargin > 0.25) tags.add("Elite Margins");
  if (stock.peRatio < 35 && stock.fiveYearCAGR > 0.25) tags.add("Growth At Reasonable Price");
  if (intrinsic.intrinsicValue > stock.price * 1.5) tags.add("Potential Multibagger");
  return Array.from(tags);
};
