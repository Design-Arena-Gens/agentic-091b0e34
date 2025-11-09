export type Rate = number; // decimal representation

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  eps: number;
  freeCashFlow: number; // total in USD
  sharesOutstanding: number; // total shares
  revenue: number; // total in USD
  revenueGrowth: Rate;
  fcfGrowthRate: Rate;
  profitMargin: Rate;
  roic: Rate;
  debtToEquity: number;
  cashPerShare: number;
  fiveYearCAGR: Rate;
  peRatio: number;
  pegRatio: number;
  discountRate: Rate;
  terminalGrowth: Rate;
  moatRating: Rate;
}

export interface ValuationOverrides {
  horizonYears: number;
  discountRateDelta: Rate;
  growthRateDelta: Rate;
}

export interface IntrinsicValueResult {
  intrinsicValue: number;
  terminalValue: number;
  cashFlowSum: number;
  marginOfSafety: Rate;
}

export interface FutureProjectionPoint {
  year: number;
  projectedPrice: number;
  optimistic: number;
  pessimistic: number;
}

export interface StockAnalysis {
  stock: Stock;
  intrinsic: IntrinsicValueResult;
  future: FutureProjectionPoint[];
  score: number;
  tags: string[];
}
