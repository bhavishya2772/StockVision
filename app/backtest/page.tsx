"use client";

import { useState, useMemo } from "react";
import { Line } from "@/components/Chart";
import { Card, Stat, Badge } from "@/components/ui";
import { backtest, PRESET_TICKERS } from "@/lib/data";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";

const TICKER_LIST = Object.keys(PRESET_TICKERS);

export default function BacktestPage() {
  const [selectedTicker, setSelectedTicker] = useState("NVDA");
  const [patternFilter, setPatternFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [sideFilter, setSideFilter] = useState("All");

  const b = useMemo(() => backtest(selectedTicker), [selectedTicker]);

  // Unique pattern list from trade log
  const uniquePatterns = useMemo(() => {
    return ["All", ...Array.from(new Set(b.trades.map((t) => t.pattern)))];
  }, [b]);

  // Filtered trade rows
  const filteredTrades = useMemo(() => {
    return b.trades.filter((t) => {
      const matchPat = patternFilter === "All" || t.pattern === patternFilter;
      const matchOut = outcomeFilter === "All" || t.out === outcomeFilter;
      const matchSide =
        sideFilter === "All" ||
        (sideFilter === "Long" && t.dir > 0) ||
        (sideFilter === "Short" && t.dir < 0);
      return matchPat && matchOut && matchSide;
    });
  }, [b, patternFilter, outcomeFilter, sideFilter]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Top Header & Ticker Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-panel p-4 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-mono text-white">
              StockCandle 5-Year Quantitative Backtest
            </h1>
            <span className="rounded bg-ai/10 border border-ai/20 px-2 py-0.5 text-[10px] font-mono text-ai font-semibold">
              TRIPLE-BARRIER
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Multi-timeframe momentum and candlestick pattern execution vs. buy-and-hold benchmark
          </p>
        </div>

        {/* Ticker Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {TICKER_LIST.map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedTicker(t);
                setPatternFilter("All");
                setOutcomeFilter("All");
              }}
              className={`rounded-md px-3 py-1 font-mono text-xs font-semibold transition-all ${
                selectedTicker === t
                  ? "bg-ai text-ink shadow-sm"
                  : "bg-panelLight/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Key Quant Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 font-mono">
        <Stat
          k="Strategy Return"
          v={`${b.totalReturn > 0 ? "+" : ""}${b.totalReturn}%`}
          sub="Compound Growth"
          c={b.totalReturn > 0 ? "text-up" : "text-dn"}
        />
        <Stat
          k="Benchmark Return"
          v={`${b.benchmarkReturn > 0 ? "+" : ""}${b.benchmarkReturn}%`}
          sub="Buy & Hold"
          c="text-slate-300"
        />
        <Stat
          k="Sharpe Ratio"
          v={b.sharpe.toFixed(2)}
          sub="Annualized Alpha"
          c="text-ai"
        />
        <Stat
          k="Sortino Ratio"
          v={b.sortino.toFixed(2)}
          sub="Downside Adjusted"
          c="text-ai"
        />
        <Stat
          k="Max Drawdown"
          v={`-${b.mdd}%`}
          sub="Peak-to-Trough"
          c="text-dn"
        />
        <Stat
          k="Win Rate"
          v={`${b.winRate}%`}
          sub={`${b.totalTrades} Executed Trades`}
          c="text-up"
        />
      </div>

      {/* Historical Equity Curve vs Buy-and-Hold */}
      <Card
        title={`${selectedTicker} Equity Curve vs. Buy-and-Hold Benchmark`}
        subtitle="Simulated on 5 years of daily bars with strict triple-barrier executions"
        rightAction={
          <div className="flex items-center gap-2">
            <Badge variant="ai">PROFIT FACTOR: {b.profitFactor}</Badge>
          </div>
        }
      >
        <div className="pt-2">
          <Line
            n={1260}
            series={[
              {
                pts: b.curve,
                col: "#22d3ee",
                label: "StockCandle Strategy",
              },
              {
                pts: b.benchmark,
                col: "#64748b",
                label: "Buy & Hold Benchmark",
              },
            ]}
          />
        </div>
      </Card>

      {/* Filterable Past Trades Table */}
      <Card
        title={`Executed Trade Log (${filteredTrades.length} of ${b.trades.length} Trades)`}
        subtitle="Categorized by multi-timeframe pattern triggers and barrier exit outcomes"
        rightAction={
          <div className="flex flex-wrap items-center gap-2">
            {/* Pattern Filter */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-500">Pattern:</span>
              <select
                value={patternFilter}
                onChange={(e) => setPatternFilter(e.target.value)}
                className="rounded border border-line bg-ink px-2 py-1 text-xs text-white focus:outline-none"
              >
                {uniquePatterns.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Outcome Filter */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-500">Outcome:</span>
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="rounded border border-line bg-ink px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="All">All Outcomes</option>
                <option value="Win">Win (Target Hit)</option>
                <option value="Loss">Loss (Stop-Loss)</option>
                <option value="Timeout">Timeout (21-Bar Limit)</option>
              </select>
            </div>

            {/* Side Filter */}
            <div className="flex items-center gap-1 font-mono text-xs">
              <span className="text-slate-500">Side:</span>
              <select
                value={sideFilter}
                onChange={(e) => setSideFilter(e.target.value)}
                className="rounded border border-line bg-ink px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="All">All Sides</option>
                <option value="Long">Long Only</option>
                <option value="Short">Short Only</option>
              </select>
            </div>
          </div>
        }
      >
        <div className="max-h-[480px] overflow-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="sticky top-0 bg-panel border-b border-line text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Pattern Trigger</th>
                <th className="py-2.5 px-3">Side</th>
                <th className="py-2.5 px-3">Entry Price</th>
                <th className="py-2.5 px-3">Exit Price</th>
                <th className="py-2.5 px-3">Holding (Bars)</th>
                <th className="py-2.5 px-3">Net Return</th>
                <th className="py-2.5 px-3">Exit Barrier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredTrades.map((t) => {
                const isWin = t.out === "Win" || t.ret > 0;
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-panelLight/40 transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-300">{t.date}</td>
                    <td className="py-2 px-3 font-semibold text-slate-200">
                      {t.pattern}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          t.dir > 0
                            ? "bg-up/10 text-up"
                            : "bg-dn/10 text-dn"
                        }`}
                      >
                        {t.dir > 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {t.dir > 0 ? "LONG" : "SHORT"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      ${t.entry.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      ${t.exit.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {t.holdingPeriod} bars
                    </td>
                    <td
                      className={`py-2 px-3 font-bold ${
                        t.ret >= 0 ? "text-up" : "text-dn"
                      }`}
                    >
                      {t.ret >= 0 ? "+" : ""}
                      {(t.ret * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          t.out === "Win"
                            ? "bg-up/10 text-up border border-up/20"
                            : t.out === "Loss"
                            ? "bg-dn/10 text-dn border border-dn/20"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {t.out === "Win"
                          ? "Take-Profit (+2.5 ATR)"
                          : t.out === "Loss"
                          ? "Stop-Loss (-1.5 ATR)"
                          : "21-Bar Time Barrier"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTrades.length === 0 && (
            <div className="py-10 text-center text-xs text-slate-500 font-mono">
              No trades match the selected filter combination.
            </div>
          )}
        </div>
      </Card>

      {/* Methodology & Assumption Note */}
      <div className="rounded-xl border border-line bg-panel/40 p-4 font-mono text-xs text-slate-400 leading-relaxed">
        <div className="text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-ai" />
          Triple-Barrier Backtesting Parameters & Verification
        </div>
        <p>
          Each trade is sized at a fixed 25% portfolio capital allocation.
          Barriers are set dynamically at entry: Upper Profit Barrier = <span className="text-up font-bold">+2.5 × ATR(14)</span>,
          Lower Stop-Loss Barrier = <span className="text-dn font-bold">-1.5 × ATR(14)</span>,
          Vertical Time Barrier = <span className="text-ai font-bold">21 daily trading bars</span>.
          Trading signals require confirmation across 1D execution patterns and weekly trend momentum filters.
        </p>
      </div>
    </main>
  );
}
