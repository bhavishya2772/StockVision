<div align="center">

# 📊 StockCandle

### Multi-Timeframe Pattern Intelligence & Quantitative ML Terminal

[![CI](https://github.com/your-username/stockcandle/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/stockcandle/actions/workflows/ci.yml)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Yahoo Finance](https://img.shields.io/badge/Yahoo_Finance-Live_Feed-7B1FA2?logo=yahoo&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10b981)

*Replace subjective chart analysis with institutional quantitative rigor.*

</div>

---

## 🏗️ Architectural Overview

StockCandle is a **full-stack quantitative analysis terminal** built with the Next.js 14 App Router. It ingests real-time OHLCV market data across three synchronized timeframes, applies mathematical candlestick pattern recognition, and produces calibrated machine-learning risk metrics — all in one reactive interface.

```
 ┌───────────────────────────────────────────────────────────┐
 │                    CLIENT (React 18)                      │
 │  Landing · Live Terminal · Backtests · Methodology Docs   │
 └────────────────────────┬──────────────────────────────────┘
                          │  fetch /api/market-data?ticker=...
 ┌────────────────────────▼──────────────────────────────────┐
 │              NEXT.JS ROUTE HANDLER (Edge-Ready)           │
 │   Yahoo Finance API ──► Pattern Engine ──► ML Inference   │
 │   Synthetic Fallback ──► ATR/VaR/RSI ──► Barrier Labels   │
 └───────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| **Multi-Timeframe Analysis** | Synchronized 1-Day (execution), 1-Week (momentum), and 1-Month (macro regime) OHLCV chart views |
| **Rule-Based Pattern Recognition** | 11+ candlestick algorithms — Hammer, Inverted Hammer, Engulfing, Morning/Evening Star, Doji, Support/Resistance — scored with mathematical confidence ratings |
| **Triple-Barrier ML Probability Engine** | Calibrated directional win probability (28–91%), dynamic ATR-based stop-loss/take-profit barriers, and Marcos López de Prado-inspired labeling |
| **Live Quotes Polling** | Real-time market data via Yahoo Finance with 20-second auto-refresh and 12-second server-side cache |
| **95% Daily Value-at-Risk (VaR)** | Parametric risk model computing maximum expected single-day loss at 95% confidence |
| **5-Year Quantitative Backtests** | Strategy equity curves vs. buy-and-hold benchmarks with Sharpe, Sortino, max drawdown, and profit factor metrics |
| **Synthetic Fallback** | Deterministic PRNG-generated market data ensuring the terminal works offline or when APIs are rate-limited |

---

## 📂 Project Structure

```
stockcandle/
├── app/
│   ├── api/market-data/route.ts   # Dynamic API route (Yahoo Finance + Pattern Engine)
│   ├── backtest/page.tsx          # 5-year backtest equity curves & trade log
│   ├── methodology/page.tsx       # Full quant documentation & formulas
│   ├── terminal/page.tsx          # Live trading terminal with ML sidebar
│   ├── globals.css                # Dark institutional theme & animations
│   ├── layout.tsx                 # Root layout (Inter + JetBrains Mono fonts)
│   └── page.tsx                   # Landing page with hero & pipeline explainer
├── components/
│   ├── Chart.tsx                  # SVG candlestick & equity curve renderer
│   ├── Nav.tsx                    # Navigation bar with live connection beacon
│   └── ui.tsx                     # Card, Stat, Badge reusable components
├── lib/
│   ├── constants.ts               # Preset watchlist & ticker metadata
│   ├── data.ts                    # Backtest engine with triple-barrier labeling
│   ├── indicators.ts              # SMA, RSI, ATR, Support/Resistance, VaR
│   ├── marketService.ts           # Yahoo Finance integration & ML inference
│   ├── patterns.ts                # Mathematical candlestick pattern detection
│   ├── synthetic.ts               # Deterministic synthetic OHLCV generator
│   └── types.ts                   # TypeScript interfaces & type definitions
├── .github/workflows/ci.yml      # GitHub Actions CI (lint + build)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/your-username/stockcandle.git
cd stockcandle

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **No API keys required.** StockCandle uses the `yahoo-finance2` package which requires no authentication. If Yahoo Finance is unreachable, the terminal automatically falls back to deterministic synthetic market data.

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build with TypeScript type-checking |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with Next.js core-web-vitals rules |

---

## 📐 Quantitative Methodology

### Pattern Recognition Engine

Each candlestick pattern is detected using **strictly defined geometric ratios** — zero subjectivity:

- **Hammer**: `LowerWick ≥ 2.0 × Body ∧ UpperWick ≤ 0.1 × Range ∧ Low ≈ LocalSwingLow`
- **Engulfing**: `Body[t] completely subsumes Body[t-1] with opposing polarity`
- **Morning Star**: `3-bar reversal with star body ≤ 30% of range and 50% midpoint penetration`

### Triple-Barrier Labeling

Following Marcos López de Prado's methodology:
- **Upper Barrier (Take-Profit)**: `+k × ATR(14)` where k adapts to win probability
- **Lower Barrier (Stop-Loss)**: `-1.5 × ATR(14)`
- **Vertical Barrier (Time)**: `21 trading bars`

### Risk Metrics

- **Sharpe Ratio**: `(μ / σ) × √(252)` — risk-adjusted return
- **Sortino Ratio**: `(μ / σ_d) × √(252)` — downside-only volatility penalty
- **VaR(95%)**: `1.64485 × σ_daily × Price` — maximum expected daily loss

---

## 📡 Preset Watchlist

| Ticker | Name | Sector |
|--------|------|--------|
| `AAPL` | Apple Inc. | Technology |
| `NVDA` | NVIDIA Corp. | Semiconductors |
| `TSLA` | Tesla Inc. | Automotive / Energy |
| `MSFT` | Microsoft Corp. | Technology |
| `SPY` | SPDR S&P 500 ETF | Index Fund |
| `QQQ` | Invesco QQQ Trust | Nasdaq ETF |
| `BTC-USD` | Bitcoin USD | Cryptocurrency |

> You can also search **any valid ticker symbol** in the Live Terminal.

---

## ⚠️ Risk Disclaimer

> **This software is for educational and research purposes only.** Financial markets involve substantial risk of capital loss. StockCandle is an analytical engine combining algorithmic candlestick recognition with parametric risk models. It does **not** constitute financial advice, investment recommendations, or solicitation to trade. Past performance of backtested strategies does not guarantee future results. Users assume full responsibility for any trading decisions made using this software.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ using **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Yahoo Finance**

</div>
#
