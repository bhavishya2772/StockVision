export interface Candle {
  date: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v?: number;
}

export type PatternName =
  | "Bullish Hammer"
  | "Inverted Hammer"
  | "Shooting Star"
  | "Bullish Engulfing"
  | "Bearish Engulfing"
  | "Morning Star"
  | "Evening Star"
  | "Dragonfly Doji"
  | "Gravestone Doji"
  | "Doji"
  | "Support Bounce"
  | "Resistance Rejection";

export interface Pat {
  i: number;
  date?: string;
  name: PatternName;
  bias: 1 | -1; // 1: Bullish, -1: Bearish
  conf: number; // 0 - 100%
  tf: "1D" | "1W" | "1M";
  desc?: string;
  price?: number;
}

export interface IndicatorSeries {
  sma20: (number | null)[];
  sma50: (number | null)[];
  rsi: (number | null)[];
  atr: number;
  supportLevel?: number;
  resistanceLevel?: number;
}

export interface TimeframeData {
  timeframe: "1D" | "1W" | "1M";
  label: string;
  candles: Candle[];
  patterns: Pat[];
  indicators: IndicatorSeries;
  trend: 1 | -1 | 0;
  regime: string;
}

export interface AnalysisPayload {
  ticker: string;
  name: string;
  currency: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: string;
  isRealData: boolean;

  timeframes: {
    "1D": TimeframeData;
    "1W": TimeframeData;
    "1M": TimeframeData;
  };

  mlInference: {
    winProbability: number; // 0 - 100
    verdict: "STRONG BUY" | "BUY" | "NEUTRAL" | "HIGH RISK SELL";
    directionalBias: 1 | -1 | 0;
    entryPrice: number;
    stopLoss: number;
    target1: number;
    target2: number;
    rrr: number;
    var95: number;
    varPercent: number;
    maxDrawdownRisk: number;
    macroRegime: string;
    momentumState: string;
    confluenceScore: number;
    activePatterns: Pat[];
  };
}

export interface BacktestTrade {
  id: string;
  date: string;
  pattern: string;
  dir: number; // 1: Long, -1: Short
  entry: number;
  exit: number;
  ret: number;
  out: "Win" | "Loss" | "Timeout";
  holdingPeriod: number;
}

export interface BacktestResult {
  ticker: string;
  trades: BacktestTrade[];
  curve: { i: number; date: string; v: number }[];
  benchmark: { i: number; date: string; v: number }[];
  totalTrades: number;
  winRate: number;
  sharpe: number;
  sortino: number;
  mdd: number;
  profitFactor: number;
  totalReturn: number;
  benchmarkReturn: number;
}
