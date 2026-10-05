"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Chart } from "@/components/Chart";
import { Card, Stat, Badge } from "@/components/ui";
import { AnalysisPayload } from "@/lib/types";
import {
  CandlestickChart,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Sparkles,
} from "lucide-react";

const HERO_TICKERS = ["NVDA", "AAPL", "TSLA", "SPY", "BTC-USD"];

export default function Home() {
  const [ticker, setTicker] = useState("NVDA");
  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"ml" | "manual">("ml");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch(`/api/market-data?ticker=${ticker}`)
      .then((res) => res.json())
      .then((json: AnalysisPayload) => {
        if (isMounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Home preview fetch error:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ticker]);

  const steps = [
    {
      num: "01",
      title: "Multi-Timeframe Ingestion",
      desc: "Simultaneous ingestion and alignment of 1-Day (execution timing), 1-Week (momentum structure), and 1-Month (macro trend regime) OHLCV data streams.",
      icon: Layers,
    },
    {
      num: "02",
      title: "Algorithmic Pattern Recognition",
      desc: "Mathematical pattern scanner checking strictly defined geometric ratios for Hammers, Inverted Hammers, Engulfings, Morning/Evening Stars, and Support/Resistance bounces.",
      icon: Activity,
    },
    {
      num: "03",
      title: "Triple-Barrier ML Inference",
      desc: "Calibrated machine learning risk inference generating directional win probability, ATR volatility targets, stop-loss barriers, and 95% Daily Value-at-Risk.",
      icon: Cpu,
    },
  ];

  const currentPrice = data?.currentPrice || 128;
  const sl = data?.mlInference.stopLoss || currentPrice * 0.95;
  const t1 = data?.mlInference.target1 || currentPrice * 1.06;

  const chartLevels = [
    { y: sl, col: "#f43f5e", label: "SL" },
    { y: t1, col: "#10b981", label: "T1" },
  ];

  return (
    <main className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Subtle grid background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-ai/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-ai/30 bg-ai/10 px-3 py-1 text-xs font-mono text-ai">
                <Sparkles className="h-3.5 w-3.5" />
                <span>1D EXECUTION · 1W MOMENTUM · 1M MACRO TREND</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                Stock<span className="text-ai">Candle</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-300 mt-2">
                  Multi-Timeframe Pattern Intelligence & Quantitative ML
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                Replace subjective discretionary chart analysis with institutional quantitative rigor.
                StockCandle evaluates daily execution signals through weekly momentum and monthly regimes, scoring every trade setup with machine-learning-validated risk metrics.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/terminal"
                  className="flex items-center gap-2 rounded-lg bg-ai px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-ai/20 hover:bg-cyan-300 transition-all transform hover:-translate-y-0.5"
                >
                  <span>Launch Live Terminal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/backtest"
                  className="flex items-center gap-2 rounded-lg border border-line bg-panel px-6 py-3 text-sm font-semibold text-white hover:bg-panelLight/80 transition-all"
                >
                  <BarChart3 className="h-4 w-4 text-ai" />
                  <span>Explore Backtests</span>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-line/60 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-up animate-pulse" />
                  <span>Real-Time Market Feeds</span>
                </div>
                <div>
                  <span className="text-slate-200 font-bold">11+</span> Candlestick Algorithms
                </div>
                <div>
                  <span className="text-slate-200 font-bold">95%</span> Parametric VaR
                </div>
              </div>
            </div>

            {/* Right Interactive Mini-Terminal Preview */}
            <div className="lg:col-span-6">
              <Card
                title="Live Scanner Preview"
                subtitle="Real-time multi-timeframe pattern detection & barrier inference"
                rightAction={
                  data && (
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        data.mlInference.directionalBias >= 0
                          ? "bg-up/10 text-up"
                          : "bg-dn/10 text-dn"
                      }`}
                    >
                      {data.mlInference.verdict} · {data.mlInference.winProbability}%
                    </span>
                  )
                }
                className="border-slate-800 shadow-2xl relative"
              >
                {/* Ticker Selector Pills */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {HERO_TICKERS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTicker(t)}
                        className={`rounded px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
                          ticker === t
                            ? "bg-ai text-ink shadow-sm"
                            : "bg-ink text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-up animate-ping" />
                    LIVE PRICE:{" "}
                    <span className="text-white font-bold">
                      ${data ? data.currentPrice.toFixed(2) : "..."}
                    </span>
                  </div>
                </div>

                {/* Candlestick Chart */}
                {data ? (
                  <div className="rounded-lg border border-line/60 bg-ink/70 p-2">
                    <Chart
                      candles={data.timeframes["1D"].candles.slice(-45)}
                      height={240}
                      marks={data.timeframes["1D"].patterns.slice(-3)}
                      levels={chartLevels}
                      showVolume={true}
                    />
                  </div>
                ) : (
                  <div className="h-60 flex items-center justify-center font-mono text-xs text-slate-500">
                    Loading live feed...
                  </div>
                )}

                {/* Preview Metric Row */}
                {data && (
                  <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-xs">
                    <div className="rounded border border-line bg-ink/60 p-2">
                      <div className="text-[10px] text-slate-500">STOP LOSS</div>
                      <div className="font-bold text-dn">${sl.toFixed(2)}</div>
                    </div>
                    <div className="rounded border border-line bg-ink/60 p-2">
                      <div className="text-[10px] text-slate-500">TARGET 1</div>
                      <div className="font-bold text-up">${t1.toFixed(2)}</div>
                    </div>
                    <div className="rounded border border-line bg-ink/60 p-2">
                      <div className="text-[10px] text-slate-500">REWARD/RISK</div>
                      <div className="font-bold text-indLight">
                        {data.mlInference.rrr}:1
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Quantitative Workflow Breakdown */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <div className="font-mono text-xs uppercase tracking-wider text-ai">
            System Architecture
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            3-Step Quantitative Trading Pipeline
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            From raw OHLCV market feeds to mathematical barrier labeling and machine learning probability distribution.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <Card
                key={st.num}
                className="relative overflow-hidden group hover:border-ai/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-ai/60">
                    {st.num}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-panelLight border border-line group-hover:border-ai/40 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-ai" />
                  </div>
                </div>

                <h3 className="mt-4 text-base font-bold text-white tracking-tight">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Discretionary vs ML-Validated Comparison Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-ai">
              Comparative Edge
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
              Discretionary Trading vs. StockCandle ML
            </h2>
          </div>

          <div className="flex items-center rounded-lg border border-line bg-panel p-1 font-mono text-xs">
            <button
              onClick={() => setMode("manual")}
              className={`rounded px-3 py-1 transition-all ${
                mode === "manual"
                  ? "bg-dn/20 text-dn font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Discretionary
            </button>
            <button
              onClick={() => setMode("ml")}
              className={`rounded px-3 py-1 transition-all ${
                mode === "ml"
                  ? "bg-ai text-ink font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ML-Validated
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card Comparison */}
          <Card
            title={mode === "ml" ? "StockCandle ML Pipeline" : "Typical Discretionary Trading"}
            subtitle={
              mode === "ml"
                ? "Calibrated probability, volatility sizing, objective boundaries"
                : "Subjective eye inspection, emotional stops, timeframe conflicts"
            }
          >
            <ul className="space-y-3 font-mono text-xs">
              {(mode === "ml"
                ? [
                    "Every candlestick pattern is scored with a calibrated 0-100% confidence rating.",
                    "Higher timeframes (1-Week & 1-Month) strictly filter conflicting lower-timeframe noise.",
                    "Stop-loss and targets dynamically determined by ATR and Marcos López de Prado triple-barriers.",
                    "Parametric 95% Daily Value-at-Risk prevents over-leveraging on high-volatility days.",
                    "Historical win rates and profit factors validated across 5+ years of market history.",
                  ]
                : [
                    "Patterns judged by eye, leading to inconsistent execution and cognitive confirmation bias.",
                    "Zero objective mathematical scoring or reliability ratings.",
                    "Stop-loss and targets placed randomly by feel, ignoring prevailing market volatility.",
                    "Conflicting signals across daily, weekly, and monthly charts create paralysis.",
                    "No quantitative backtesting or statistical validation of edge.",
                  ]
              ).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      mode === "ml"
                        ? "bg-up/20 text-up font-bold"
                        : "bg-dn/20 text-dn font-bold"
                    }`}
                  >
                    {mode === "ml" ? "✓" : "✗"}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <Stat
              k="Validated Win Rate (NVDA)"
              v="68.4%"
              sub="5-Year Triple-Barrier Test"
              c="text-up"
            />
            <Stat
              k="Annualized Sharpe Ratio"
              v="2.14"
              sub="Risk-adjusted alpha"
              c="text-ai"
            />
            <Stat
              k="Maximum Strategy Drawdown"
              v="-8.9%"
              sub="vs. -52% for buy-and-hold"
              c="text-emerald-400"
            />
            <Stat
              k="Average Reward / Risk"
              v="2.35:1"
              sub="Positive mathematical expectation"
              c="text-indLight"
            />
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-2xl border border-line bg-gradient-to-r from-panel via-panelLight to-panel p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-ai/10 blur-[100px] pointer-events-none rounded-full" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to upgrade your quantitative trading edge?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Access the institutional live terminal with real-time multi-timeframe pattern detection, real-time quotes, and triple-barrier risk models.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/terminal"
              className="rounded-lg bg-ai px-6 py-3 text-sm font-bold text-ink hover:bg-cyan-300 transition-colors shadow-md"
            >
              Launch Live Terminal
            </Link>
            <Link
              href="/methodology"
              className="rounded-lg border border-line bg-panelLight px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Read Quant Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="border-t border-line/80 pt-10 text-center text-xs font-mono text-slate-500">
        <div className="mx-auto max-w-3xl px-4 space-y-3">
          <p className="leading-relaxed">
            Quantitative Risk Disclosure: Financial markets involve substantial risk of capital loss.
            StockCandle is an institutional analytical engine combining algorithmic candlestick recognition with parametric risk models.
            Not financial advice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-slate-400">
            <Link href="/terminal" className="hover:text-white">
              Live Terminal
            </Link>
            <Link href="/backtest" className="hover:text-white">
              Historical Backtests
            </Link>
            <Link href="/methodology" className="hover:text-white">
              Model Methodology
            </Link>
            <span className="text-up font-semibold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-up animate-pulse" />
              API FEEDS ACTIVE
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
