import { Candle } from "./types";

/**
 * Simple Moving Average (SMA)
 */
export function calculateSMA(candles: Candle[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const closes = candles.map((c) => c.c);

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) {
        sum += closes[j];
      }
      result.push(Number((sum / period).toFixed(2)));
    }
  }
  return result;
}

/**
 * Relative Strength Index (RSI - 14) using Wilder's Smoothing
 */
export function calculateRSI(candles: Candle[], period = 14): (number | null)[] {
  const result: (number | null)[] = [];
  const closes = candles.map((c) => c.c);

  if (closes.length <= period) {
    return candles.map(() => null);
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  result.push(null); // first candle has no delta

  let avgGain = gains.slice(0, period).reduce((s, g) => s + g, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((s, l) => s + l, 0) / period;

  for (let i = 1; i < period; i++) {
    result.push(null);
  }

  const rsInitial = avgLoss === 0 ? 100 : avgGain / avgLoss;
  result.push(avgLoss === 0 ? 100 : Number((100 - 100 / (1 + rsInitial)).toFixed(1)));

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(Number((100 - 100 / (1 + rs)).toFixed(1)));
    }
  }

  return result;
}

/**
 * Average True Range (ATR - 14)
 */
export function calculateATR(candles: Candle[], period = 14): number {
  if (candles.length < 2) return 1.0;
  const slice = candles.slice(-Math.max(period + 1, 20));

  let trSum = 0;
  let count = 0;

  for (let i = 1; i < slice.length; i++) {
    const cur = slice[i];
    const prev = slice[i - 1];
    const tr = Math.max(
      cur.h - cur.l,
      Math.abs(cur.h - prev.c),
      Math.abs(cur.l - prev.c)
    );
    trSum += tr;
    count++;
  }

  return Number((trSum / Math.max(1, count)).toFixed(2));
}

/**
 * Rolling Support & Resistance (Pivot Highs & Lows over lookback)
 */
export function calculateSupportResistance(
  candles: Candle[],
  lookback = 20
): { support: number; resistance: number } {
  if (candles.length === 0) return { support: 0, resistance: 0 };
  const slice = candles.slice(-lookback);
  const support = Math.min(...slice.map((c) => c.l));
  const resistance = Math.max(...slice.map((c) => c.h));
  return {
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
  };
}

/**
 * Historical Return Standard Deviation and 95% Parametric VaR
 */
export function calculateDailyVaR95(candles: Candle[]): {
  var95: number;
  varPercent: number;
  dailySigma: number;
} {
  if (candles.length < 10) {
    const fallbackPrice = candles[candles.length - 1]?.c || 100;
    return {
      var95: Number((fallbackPrice * 0.025).toFixed(2)),
      varPercent: 2.5,
      dailySigma: 0.015,
    };
  }

  const closes = candles.slice(-60).map((c) => c.c);
  const logReturns: number[] = [];

  for (let i = 1; i < closes.length; i++) {
    logReturns.push(Math.log(closes[i] / closes[i - 1]));
  }

  const mean = logReturns.reduce((s, r) => s + r, 0) / logReturns.length;
  const variance =
    logReturns.reduce((s, r) => s + (r - mean) ** 2, 0) / logReturns.length;
  const sigma = Math.sqrt(variance);

  const currentPrice = closes[closes.length - 1];
  // 95% normal z-score = 1.64485
  const varPercent = Number((1.64485 * sigma * 100).toFixed(2));
  const var95 = Number((currentPrice * (varPercent / 100)).toFixed(2));

  return {
    var95,
    varPercent,
    dailySigma: Number(sigma.toFixed(4)),
  };
}
