import { Candle } from "./types";
import { PRESET_TICKERS } from "./constants";

/**
 * Generate synthetic realistic market candles if external API is unreachable or for deterministic backtesting
 */
export function generateSyntheticCandles(
  ticker: string,
  count = 120,
  timeframe: "1D" | "1W" | "1M" = "1D"
): Candle[] {
  const meta = PRESET_TICKERS[ticker] || {
    name: ticker,
    base: 150 + (ticker.charCodeAt(0) * 7) % 200,
    vol: 0.02,
  };

  let seed = 1234567;
  for (let i = 0; i < ticker.length; i++) {
    seed = (seed * 31 + ticker.charCodeAt(i)) % 2147483647;
  }

  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const candles: Candle[] = [];
  let price = meta.base;
  const now = Date.now();
  const stepMs =
    timeframe === "1D"
      ? 86400000
      : timeframe === "1W"
      ? 7 * 86400000
      : 30 * 86400000;

  const volatility =
    timeframe === "1D" ? meta.vol : timeframe === "1W" ? meta.vol * 2.1 : meta.vol * 4.2;

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * stepMs);
    const dateStr = time.toISOString().split("T")[0];

    const changeRatio = (rnd() + rnd() + rnd() - 1.5) * volatility * 1.8;
    const open = price;
    const close = Math.max(1, open * (1 + changeRatio + 0.0004));
    const high = Math.max(open, close) * (1 + rnd() * volatility * 0.7);
    const low = Math.min(open, close) * (1 - rnd() * volatility * 0.7);
    const volume = Math.round(1000000 + rnd() * 5000000);

    candles.push({
      date: dateStr,
      o: Number(open.toFixed(2)),
      h: Number(high.toFixed(2)),
      l: Number(low.toFixed(2)),
      c: Number(close.toFixed(2)),
      v: volume,
    });

    price = close;
  }

  return candles;
}
