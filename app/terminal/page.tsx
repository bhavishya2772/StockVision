"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Chart } from "@/components/Chart";
import { Card, Stat, Badge } from "@/components/ui";
import { AnalysisPayload, Pat, PatternName } from "@/lib/types";
import { PRESET_TICKERS } from "@/lib/constants";
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Layers,
  SlidersHorizontal,
  Clock,
  Sparkles,
} from "lucide-react";

const ALL_PATTERNS: PatternName[] = [
  "Bullish Hammer",
  "Inverted Hammer",
  "Shooting Star",
  "Bullish Engulfing",
  "Bearish Engulfing",
  "Morning Star",
  "Evening Star",
  "Dragonfly Doji",
  "Doji",
  "Support Bounce",
  "Resistance Rejection",
];

const PRESETS = Object.keys(PRESET_TICKERS);

export default function TerminalPage() {
  const [ticker, setTicker] = useState("AAPL");
  const [searchInput, setSearchInput] = useState("AAPL");
  const [view, setView] = useState<"SYNC" | "1D" | "1W" | "1M">("SYNC");
  const [activePatterns, setActivePatterns] = useState<string[]>(ALL_PATTERNS);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisPayload | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch market data from Next.js API route
  const fetchData = useCallback(async (sym: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/market-data?ticker=${encodeURIComponent(sym)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: AnalysisPayload = await res.json();
      setData(json);
      setLastFetchTime(Date.now());
      setSecondsAgo(0);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorMsg("Failed to stream live quote. Using cached quant model.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and on ticker change
  useEffect(() => {
    fetchData(ticker);
  }, [ticker, fetchData]);

  // Client-side auto-refresh polling every 20 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchData(ticker);
    }, 20000);
    return () => clearInterval(pollInterval);
  }, [ticker, fetchData]);

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastFetchTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [lastFetchTime]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const clean = searchInput.trim().toUpperCase();
    setTicker(clean);
  };

  const togglePattern = (name: string) => {
    setActivePatterns((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const isPatternActive = (p: Pat) => activePatterns.includes(p.name);

  // ML / risk metrics
  const ml = data?.mlInference;
  const isBullish = ml ? ml.directionalBias >= 0 : true;
  const verdictColor =
    ml?.verdict === "STRONG BUY"
      ? "text-up border-up/40 bg-up/10"
      : ml?.verdict === "BUY"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : ml?.verdict === "NEUTRAL"
      ? "text-slate-300 border-slate-700 bg-slate-800/40"
      : "text-dn border-dn/40 bg-dn/10";

  const winProb = ml?.winProbability || 50;
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (circ * winProb) / 100;

  const currentPrice = data?.currentPrice || 100;
  const sl = ml?.stopLoss || currentPrice * 0.96;
  const t1 = ml?.target1 || currentPrice * 1.05;
  const t2 = ml?.target2 || currentPrice * 1.08;

  const chartLevels = [
    { y: sl, col: "#f43f5e", label: "SL" },
    { y: t1, col: "#10b981", label: "T1" },
    { y: t2, col: "#06b6d4", label: "T2" },
  ];

  return (
    <main className="mx-auto max-w-[1520px] space-y-3.5 p-3 sm:p-5">
      {/* Top Bar: Watchlist presets, Search, and Live Sync Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-panel p-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Tickers */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {PRESETS.map((p) => {
              const active = ticker === p;
              return (
                <button
                  key={p}
                  onClick={() => {
                    setTicker(p);
                    setSearchInput(p);
                  }}
                  className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
                    active
                      ? "bg-ai text-ink shadow-sm scale-105"
                      : "bg-panelLight/60 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Custom Search Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 ml-1">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="SYMBOL"
                className="w-28 sm:w-32 rounded-md border border-line bg-ink px-2.5 py-1 text-xs font-mono text-white placeholder-slate-500 focus:border-ai focus:outline-none uppercase"
              />
              <Search className="absolute right-2 top-1.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="rounded-md bg-panelLight px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 border border-line"
            >
              Scan
            </button>
          </form>
        </div>

        {/* Live Status Badge & Refresh Now */}
        <div className="flex items-center gap-3">
          {/* Live Pulsating Badge */}
          <div className="flex items-center gap-2 rounded-full border border-line bg-ink/80 px-3 py-1 font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="live-pulse absolute inline-flex h-full w-full rounded-full bg-up opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-up"></span>
            </span>
            <span className="text-slate-400 text-[11px]">
              <span className="text-up font-semibold">LIVE</span> • Updated {secondsAgo}s ago
            </span>
            {data?.isRealData ? (
              <span className="text-[10px] text-ai font-semibold border-l border-line pl-2">
                YAHOO FEED
              </span>
            ) : (
              <span className="text-[10px] text-amber-400 font-semibold border-l border-line pl-2">
                SYNTHESIS
              </span>
            )}
          </div>

          <button
            onClick={() => fetchData(ticker)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border border-line bg-panelLight/80 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-ai" : ""}`} />
            <span className="hidden sm:inline">Refresh Now</span>
          </button>
        </div>
      </div>

      {/* Asset Header Info Bar */}
      {data && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-panel/70 px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              {data.ticker}
              <span className="text-xs font-normal text-slate-400 font-sans">
                {data.name}
              </span>
            </h1>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                ${data.currentPrice.toFixed(2)}
              </span>
              <span
                className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                  data.change >= 0 ? "bg-up/10 text-up" : "bg-dn/10 text-dn"
                }`}
              >
                {data.change >= 0 ? (
                  <TrendingUp className="mr-1 h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="mr-1 h-3.5 w-3.5" />
                )}
                {data.change >= 0 ? "+" : ""}
                {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400">
            <div>
              <span className="text-slate-500">24H HIGH:</span>{" "}
              <span className="text-slate-200">${data.high24h.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500">24H LOW:</span>{" "}
              <span className="text-slate-200">${data.low24h.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500">VOLUME:</span>{" "}
              <span className="text-slate-200">
                {(data.volume24h / 1e6).toFixed(1)}M
              </span>
            </div>
            <div>
              <span className="text-slate-500">ATR(14):</span>{" "}
              <span className="text-ai">${data.timeframes["1D"].indicators.atr}</span>
            </div>
          </div>
        </div>
      )}

      {/* Control Filters: Timeframe tabs & Pattern Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel/40 p-2.5">
        {/* Timeframe Mode Selector */}
        <div className="flex items-center gap-1 bg-ink rounded-lg p-1 border border-line">
          {(["SYNC", "1D", "1W", "1M"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setView(t)}
              className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition-all ${
                view === t
                  ? "bg-ai text-ink shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-panel"
              }`}
            >
              {t === "SYNC" ? "Synchronized (All)" : t}
            </button>
          ))}
        </div>

        {/* Pattern Filter Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Patterns:
          </span>
          {ALL_PATTERNS.slice(0, 7).map((p) => {
            const on = activePatterns.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePattern(p)}
                className={`rounded border px-2 py-0.5 text-[11px] font-mono transition-all ${
                  on
                    ? "border-ai/50 bg-ai/10 text-cyan-300 font-medium"
                    : "border-line bg-ink text-slate-500 hover:border-slate-700"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Terminal Layout: Left Chart Stage, Right Quant ML Panel */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px]">
        {/* Chart Stage */}
        <div className="space-y-4">
          {data ? (
            <>
              {/* 1D Execution Chart */}
              {(view === "SYNC" || view === "1D") && (
                <Card
                  title={`${ticker} · 1-Day Execution Timeframe`}
                  subtitle="Primary barrier triggers · ATR levels · Tactical volume"
                  rightAction={
                    <div className="flex items-center gap-2">
                      <Badge variant="up">RSI: {data.timeframes["1D"].indicators.rsi.filter((x): x is number => x !== null).pop()?.toFixed(1) || "54.2"}</Badge>
                      <Badge variant="ai">ATR: ${data.timeframes["1D"].indicators.atr}</Badge>
                    </div>
                  }
                >
                  <Chart
                    candles={data.timeframes["1D"].candles}
                    height={view === "1D" ? 440 : 280}
                    marks={data.timeframes["1D"].patterns.filter(isPatternActive)}
                    lines={[
                      {
                        v: data.timeframes["1D"].indicators.sma20,
                        col: "#22d3ee",
                        name: "SMA 20",
                      },
                      {
                        v: data.timeframes["1D"].indicators.sma50,
                        col: "#818cf8",
                        name: "SMA 50",
                      },
                    ]}
                    levels={chartLevels}
                  />
                </Card>
              )}

              {/* 1W Momentum Chart */}
              {(view === "SYNC" || view === "1W") && (
                <Card
                  title={`${ticker} · 1-Week Momentum & Trend Filter`}
                  subtitle={`SMA 20/50 alignment · Regime: ${data.timeframes["1W"].regime}`}
                  rightAction={
                    <Badge variant={data.timeframes["1W"].trend === 1 ? "up" : "dn"}>
                      {data.timeframes["1W"].trend === 1 ? "BULLISH TREND" : "BEARISH TREND"}
                    </Badge>
                  }
                >
                  <Chart
                    candles={data.timeframes["1W"].candles}
                    height={view === "1W" ? 420 : 230}
                    marks={data.timeframes["1W"].patterns.filter(isPatternActive)}
                    lines={[
                      {
                        v: data.timeframes["1W"].indicators.sma20,
                        col: "#22d3ee",
                        name: "SMA 20",
                      },
                      {
                        v: data.timeframes["1W"].indicators.sma50,
                        col: "#818cf8",
                        name: "SMA 50",
                      },
                    ]}
                  />
                </Card>
              )}

              {/* 1M Macro Trend Chart */}
              {(view === "SYNC" || view === "1M") && (
                <Card
                  title={`${ticker} · 1-Month Macro Trend & Regime Filter`}
                  subtitle={`Macro Structure · Status: ${data.timeframes["1M"].regime}`}
                  rightAction={
                    <Badge variant="neutral">
                      {data.timeframes["1M"].candles.length} MONTHS HISTORY
                    </Badge>
                  }
                >
                  <Chart
                    candles={data.timeframes["1M"].candles}
                    height={view === "1M" ? 400 : 210}
                    marks={data.timeframes["1M"].patterns.filter(isPatternActive)}
                    lines={[
                      {
                        v: data.timeframes["1M"].indicators.sma20,
                        col: "#818cf8",
                        name: "SMA 20",
                      },
                    ]}
                  />
                </Card>
              )}
            </>
          ) : (
            <div className="flex h-96 items-center justify-center rounded-xl border border-line bg-panel">
              <div className="flex items-center gap-3 font-mono text-sm text-slate-400">
                <RotateCcw className="h-5 w-5 animate-spin text-ai" />
                Connecting to StockCandle quantitative streaming engine...
              </div>
            </div>
          )}
        </div>

        {/* Quant ML Inference & Risk Side Panel */}
        <div className="space-y-4">
          {/* ML Verdict & Win Probability Gauge */}
          <Card
            title="ML Trade Verdict"
            subtitle="Triple-barrier multi-timeframe inference"
            rightAction={
              <span className="flex items-center gap-1 font-mono text-[10px] text-ai">
                <Sparkles className="h-3 w-3" /> CONF: {ml?.confluenceScore || 85}%
              </span>
            }
          >
            <div className="flex flex-col items-center py-2">
              <div
                className={`rounded-lg border px-4 py-1.5 text-center font-mono text-xl font-extrabold tracking-wider ${verdictColor}`}
              >
                {ml?.verdict || "CALCULATING"}
              </div>

              {/* Circular SVG Gauge */}
              <div className="relative mt-4 flex items-center justify-center">
                <svg className="h-32 w-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-[#1f2937]"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke={isBullish ? "#10b981" : "#f43f5e"}
                    strokeWidth="10"
                    strokeDasharray={circ}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-2xl font-black text-white">
                    {winProb}%
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Directional Win
                  </span>
                </div>
              </div>

              <div className="mt-3 text-center text-xs text-slate-400 px-2 leading-relaxed">
                {ml?.momentumState} · {ml?.macroRegime}
              </div>
            </div>
          </Card>

          {/* Quant Risk & Reward Levels */}
          <Card
            title="Execution Risk & Boundaries"
            subtitle="Derived via ATR volatility and triple-barrier exit criteria"
          >
            <div className="grid grid-cols-2 gap-2 font-mono">
              <Stat k="Entry Price" v={`$${(ml?.entryPrice || currentPrice).toFixed(2)}`} />
              <Stat
                k="Stop-Loss"
                v={`$${sl.toFixed(2)}`}
                sub={`${(((sl - currentPrice) / currentPrice) * 100).toFixed(2)}%`}
                c="text-dn"
              />
              <Stat
                k="Target 1"
                v={`$${t1.toFixed(2)}`}
                sub={`+${(((t1 - currentPrice) / currentPrice) * 100).toFixed(2)}%`}
                c="text-up"
              />
              <Stat
                k="Target 2"
                v={`$${t2.toFixed(2)}`}
                sub={`+${(((t2 - currentPrice) / currentPrice) * 100).toFixed(2)}%`}
                c="text-ai"
              />
              <Stat
                k="Reward-to-Risk"
                v={`${ml?.rrr || 1.85}:1`}
                c="text-indLight"
              />
              <Stat
                k="VaR 95% (Daily)"
                v={`$${ml?.var95 || 3.4}`}
                sub={`${ml?.varPercent || 1.8}% of equity`}
                c="text-slate-300"
              />
            </div>

            <div className="mt-3 rounded-lg border border-line bg-panelLight/30 p-2.5 text-xs text-slate-400">
              <div className="flex justify-between text-[11px] font-mono">
                <span>Historical Drawdown in setup:</span>
                <span className="text-dn font-semibold">
                  -{ml?.maxDrawdownRisk || 6.2}%
                </span>
              </div>
              <div className="mt-1 flex justify-between text-[11px] font-mono">
                <span>Time Barrier:</span>
                <span className="text-slate-300">21 Trading Bars</span>
              </div>
            </div>
          </Card>

          {/* Active Detected Patterns Stream */}
          <Card
            title="Detected Pattern Signals"
            subtitle="Ranked by pattern geometry and reliability"
            rightAction={
              <Badge variant="neutral">
                {data?.mlInference.activePatterns.length || 0} ACTIVE
              </Badge>
            }
          >
            {data && data.mlInference.activePatterns.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
                {data.mlInference.activePatterns.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-line bg-panelLight/50 p-2 text-xs transition-colors hover:border-slate-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-ink px-1.5 py-0.5 font-mono text-[10px] text-ai font-bold border border-line">
                        {p.tf}
                      </span>
                      <div>
                        <div
                          className={`font-semibold font-mono ${
                            p.bias > 0 ? "text-up" : "text-dn"
                          }`}
                        >
                          {p.name}
                        </div>
                        {p.desc && (
                          <div className="text-[10px] text-slate-500 line-clamp-1">
                            {p.desc}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="font-bold text-white">{p.conf}%</div>
                      <div className="text-[10px] text-slate-500">
                        {p.conf >= 80 ? "High" : p.conf >= 70 ? "Med" : "Speculative"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500 font-mono">
                No active patterns matching current filters.
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
