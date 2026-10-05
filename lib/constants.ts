export const PRESET_TICKERS: Record<string, { name: string; base: number; vol: number }> = {
  AAPL: { name: "Apple Inc.", base: 232, vol: 0.016 },
  NVDA: { name: "NVIDIA Corp.", base: 128, vol: 0.028 },
  TSLA: { name: "Tesla Inc.", base: 245, vol: 0.032 },
  MSFT: { name: "Microsoft Corp.", base: 430, vol: 0.015 },
  SPY: { name: "SPDR S&P 500 ETF Trust", base: 575, vol: 0.009 },
  QQQ: { name: "Invesco QQQ Trust Series 1", base: 490, vol: 0.013 },
  "BTC-USD": { name: "Bitcoin USD", base: 64500, vol: 0.038 },
};

export const SYMBOLS = Object.keys(PRESET_TICKERS);
