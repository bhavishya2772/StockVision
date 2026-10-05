import { Candle, Pat, PatternName } from "./types";

/**
 * Detect candlestick patterns mathematically across an OHLCV series
 */
export function detectPatterns(candles: Candle[], tf: "1D" | "1W" | "1M"): Pat[] {
  const patterns: Pat[] = [];
  if (candles.length < 3) return patterns;

  // Compute rolling 20-period support and resistance to contextualize bounces
  for (let i = 2; i < candles.length; i++) {
    const c = candles[i];
    const p = candles[i - 1];
    const p2 = candles[i - 2];

    const range = c.h - c.l || 1e-9;
    const body = Math.abs(c.c - c.o);
    const bodyRatio = body / range;
    const lowerWick = Math.min(c.o, c.c) - c.l;
    const upperWick = c.h - Math.max(c.o, c.c);

    const prevRange = p.h - p.l || 1e-9;
    const prevBody = Math.abs(p.c - p.o) || 1e-9;

    const p2Range = p2.h - p2.l || 1e-9;
    const p2Body = Math.abs(p2.c - p2.o);

    const isBullish = c.c > c.o;
    const isBearish = c.c < c.o;
    const prevBullish = p.c > p.o;
    const prevBearish = p.c < p.o;
    const p2Bullish = p2.c > p2.o;
    const p2Bearish = p2.c < p2.o;

    // Local rolling support and resistance (lookback 15 bars prior to i)
    const windowStart = Math.max(0, i - 15);
    const windowSlice = candles.slice(windowStart, i);
    const localLow = Math.min(...windowSlice.map((k) => k.l));
    const localHigh = Math.max(...windowSlice.map((k) => k.h));

    // 1. Morning Star (3-Candle Bullish Reversal)
    if (
      p2Bearish &&
      p2Body / p2Range >= 0.45 &&
      p.c <= p2.c &&
      prevBody / prevRange <= 0.35 &&
      isBullish &&
      c.c > p2.c + (p2.o - p2.c) * 0.5
    ) {
      const conf = Math.min(96, Math.round(75 + (c.c - (p2.c + (p2.o - p2.c) * 0.5)) / range * 25));
      patterns.push({
        i,
        date: c.date,
        name: "Morning Star",
        bias: 1,
        conf,
        tf,
        desc: "3-bar bullish reversal confirmed with strong third candle penetration.",
        price: c.c,
      });
      continue;
    }

    // 2. Evening Star (3-Candle Bearish Reversal)
    if (
      p2Bullish &&
      p2Body / p2Range >= 0.45 &&
      p.c >= p2.c &&
      prevBody / prevRange <= 0.35 &&
      isBearish &&
      c.c < p2.c - (p2.c - p2.o) * 0.5
    ) {
      const conf = Math.min(95, Math.round(75 + ((p2.c - (p2.c - p2.o) * 0.5) - c.c) / range * 25));
      patterns.push({
        i,
        date: c.date,
        name: "Evening Star",
        bias: -1,
        conf,
        tf,
        desc: "3-bar bearish reversal confirmed at recent price peak.",
        price: c.c,
      });
      continue;
    }

    // 3. Bullish Engulfing
    if (
      prevBearish &&
      isBullish &&
      c.o <= p.c &&
      c.c >= p.o &&
      body > prevBody
    ) {
      const expansionRatio = body / prevBody;
      const conf = Math.min(94, Math.round(65 + Math.min(25, expansionRatio * 8)));
      patterns.push({
        i,
        date: c.date,
        name: "Bullish Engulfing",
        bias: 1,
        conf,
        tf,
        desc: "Large bullish candle completely engulfs preceding bearish body.",
        price: c.c,
      });
      continue;
    }

    // 4. Bearish Engulfing
    if (
      prevBullish &&
      isBearish &&
      c.o >= p.c &&
      c.c <= p.o &&
      body > prevBody
    ) {
      const expansionRatio = body / prevBody;
      const conf = Math.min(94, Math.round(65 + Math.min(25, expansionRatio * 8)));
      patterns.push({
        i,
        date: c.date,
        name: "Bearish Engulfing",
        bias: -1,
        conf,
        tf,
        desc: "Aggressive bearish impulse engulfs preceding buyer range.",
        price: c.c,
      });
      continue;
    }

    // 5. Bullish Hammer
    if (
      bodyRatio <= 0.35 &&
      lowerWick >= 2.0 * body &&
      upperWick <= body * 0.6 + range * 0.08 &&
      c.l <= localLow * 1.015 // Occurs near bottom
    ) {
      const conf = Math.min(93, Math.round(62 + (lowerWick / range) * 35));
      patterns.push({
        i,
        date: c.date,
        name: "Bullish Hammer",
        bias: 1,
        conf,
        tf,
        desc: "Extended lower shadow signals aggressive buyer absorption at lows.",
        price: c.c,
      });
      continue;
    }

    // 6. Inverted Hammer
    if (
      bodyRatio <= 0.35 &&
      upperWick >= 2.0 * body &&
      lowerWick <= body * 0.5 + range * 0.08 &&
      c.l <= localLow * 1.02
    ) {
      const conf = Math.min(88, Math.round(60 + (upperWick / range) * 30));
      patterns.push({
        i,
        date: c.date,
        name: "Inverted Hammer",
        bias: 1,
        conf,
        tf,
        desc: "Initial upside probe rejected but establishes high liquidity base.",
        price: c.c,
      });
      continue;
    }

    // 7. Shooting Star
    if (
      bodyRatio <= 0.35 &&
      upperWick >= 2.0 * body &&
      lowerWick <= body * 0.5 + range * 0.08 &&
      c.h >= localHigh * 0.985
    ) {
      const conf = Math.min(92, Math.round(64 + (upperWick / range) * 32));
      patterns.push({
        i,
        date: c.date,
        name: "Shooting Star",
        bias: -1,
        conf,
        tf,
        desc: "Sharp rejection of highs indicates exhaustion of upside momentum.",
        price: c.c,
      });
      continue;
    }

    // 8. Doji (Dragonfly, Gravestone, or Standard)
    if (bodyRatio <= 0.08) {
      if (lowerWick >= 0.7 * range && upperWick <= 0.15 * range) {
        patterns.push({
          i,
          date: c.date,
          name: "Dragonfly Doji",
          bias: 1,
          conf: Math.round(78 + (lowerWick / range) * 15),
          tf,
          desc: "Bullish rejection of lower levels with close pinned to the high.",
          price: c.c,
        });
      } else if (upperWick >= 0.7 * range && lowerWick <= 0.15 * range) {
        patterns.push({
          i,
          date: c.date,
          name: "Gravestone Doji",
          bias: -1,
          conf: Math.round(78 + (upperWick / range) * 15),
          tf,
          desc: "Bearish rejection of upper levels with close pinned to the low.",
          price: c.c,
        });
      } else {
        patterns.push({
          i,
          date: c.date,
          name: "Doji",
          bias: 1, // indecision
          conf: 70,
          tf,
          desc: "Market equilibrium and volatility contraction awaiting catalyst.",
          price: c.c,
        });
      }
      continue;
    }

    // 9. Support Bounce
    if (
      c.l <= localLow * 1.008 &&
      c.c > localLow &&
      lowerWick >= 1.3 * body &&
      isBullish
    ) {
      patterns.push({
        i,
        date: c.date,
        name: "Support Bounce",
        bias: 1,
        conf: 82,
        tf,
        desc: "Defended structural support zone with bullish wick recovery.",
        price: c.c,
      });
      continue;
    }

    // 10. Resistance Rejection
    if (
      c.h >= localHigh * 0.992 &&
      c.c < localHigh &&
      upperWick >= 1.3 * body &&
      isBearish
    ) {
      patterns.push({
        i,
        date: c.date,
        name: "Resistance Rejection",
        bias: -1,
        conf: 82,
        tf,
        desc: "Rejected structural supply shelf with strong seller defense.",
        price: c.c,
      });
      continue;
    }
  }

  return patterns;
}
