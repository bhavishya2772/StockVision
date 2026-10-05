import { Card, Badge } from "@/components/ui";
import {
  ShieldCheck,
  Cpu,
  BarChart,
  Binary,
  GitBranch,
  Layers,
  Sparkles,
} from "lucide-react";

const SHAP_FEATURES = [
  { feature: "1M Macro Regime (SMA 10 / SMA 20)", shap: 0.31, desc: "Global macro filter: long-only if price > SMA10" },
  { feature: "1W SMA 20/50 Momentum Crossover", shap: 0.27, desc: "Medium-term trend direction and golden/death cross alignment" },
  { feature: "1D Bullish / Bearish Hammer Geometry", shap: 0.16, desc: "Shadow-to-body ratio ≥ 2.0 at local swing boundaries" },
  { feature: "1W Relative Strength Index (RSI 14)", shap: 0.12, desc: "Wilder momentum oscillator detecting divergence & exhaustion" },
  { feature: "1D Engulfing Range Expansion", shap: 0.08, desc: "Full candlestick body enclosure with volume surge" },
  { feature: "ATR(14) Normalized Volatility", shap: 0.06, desc: "True range scaling for adaptive barrier placement" },
];

export default function MethodologyPage() {
  const candlestickFormulas = [
    {
      name: "Bullish Hammer",
      bias: "Bullish (+1)",
      formula: "LowerWick ≥ 2.0 × Body ∧ UpperWick ≤ 0.1 × Range ∧ Low ≈ LocalSwingLow",
      desc: "Small real body situated at the upper end of the trading range with an extended lower wick indicating strong rejection of intraday selling pressure.",
    },
    {
      name: "Inverted Hammer",
      bias: "Bullish (+1)",
      formula: "UpperWick ≥ 2.0 × Body ∧ LowerWick ≤ 0.1 × Range ∧ Low ≈ LocalSwingLow",
      desc: "Buyers aggressively drive prices higher intraday. While sellers push price back down, the high liquidity base establishes support at key levels.",
    },
    {
      name: "Bullish Engulfing",
      bias: "Bullish (+1)",
      formula: "Close[t] > Open[t] ∧ Open[t] ≤ Close[t-1] ∧ Close[t] ≥ Open[t-1]",
      desc: "Current green candle body completely overtakes and encompasses the prior red candle body, signaling aggressive buyer dominance.",
    },
    {
      name: "Bearish Engulfing",
      bias: "Bearish (-1)",
      formula: "Close[t] < Open[t] ∧ Open[t] ≥ Close[t-1] ∧ Close[t] ≤ Open[t-1]",
      desc: "Current red candle body completely overwhelms the preceding green candle, signaling an aggressive turnover from distribution to supply dump.",
    },
    {
      name: "Morning Star (3-Bar Reversal)",
      bias: "Bullish (+1)",
      formula: "Close[t-2] < Open[t-2] ∧ Body[t-1]/Range[t-1] ≤ 0.3 ∧ Close[t] > (Open[t-2] + Close[t-2])/2",
      desc: "Tall bearish candle followed by a tight-range indecision star candle, confirmed by a strong bullish impulse penetrating past the 50% midpoint of the first candle.",
    },
    {
      name: "Support / Resistance Bounce",
      bias: "Confluence Trigger",
      formula: "|Low[t] - RollingSupport[20]| ≤ 0.3 × ATR ∧ LowerWick ≥ 1.3 × Body",
      desc: "Candle wick sweeps structural liquidity at the rolling 20-period pivot boundary followed by immediate aggressive buyer absorption.",
    },
  ];

  const methodologyPillars = [
    {
      title: "1. TA-Lib Compliant Indicator Computation",
      desc: "Indicators are calculated per timeframe using industry-standard algorithmic mathematics. Daily OHLCV data is aggregated cleanly into 5-bar weekly and 21-bar monthly structures. Wilder's exponential smoothing is applied to RSI(14) to maintain parity with institutional trading desks.",
    },
    {
      title: "2. Marcos López de Prado Triple-Barrier Labeling",
      desc: "Instead of fixed-time horizon returns, trades are labeled using three dynamic boundaries: Upper Profit Barrier (+k × ATR), Lower Stop-Loss Barrier (-1.5 × ATR), and Vertical Time Barrier (21 bars). This avoids path-dependent lookahead bias and accurately mirrors real-world execution stops.",
    },
    {
      title: "3. Hierarchical Multi-Timeframe Feature Stacking",
      desc: "Signals are never executed in isolation. A daily Hammer occurring within a bearish weekly trend (SMA 20 < SMA 50) is heavily penalized or invalidated. Only when the 1-Month regime, 1-Week momentum, and 1-Day execution form a directional confluence does the model emit a STRONG BUY or ACCUMULATE verdict.",
    },
    {
      title: "4. Parametric 95% Daily Value-at-Risk (VaR)",
      desc: "Daily log-return variance is computed across a rolling 60-bar window. Assuming normal return distribution at the 95% confidence level (z = 1.64485), the terminal computes maximum anticipated 1-day portfolio risk in dollar and percentage terms: VaR(95%) = 1.64485 × σ × Price.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4 sm:p-6 pb-20">
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="ai">QUANTITATIVE RESEARCH</Badge>
          <span className="font-mono text-xs text-slate-500">v2.4 Specification</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
          StockCandle Model Architecture & Methodology
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive documentation of our algorithmic pattern recognition rules, Marcos López de Prado triple-barrier labeling system, and hierarchical machine learning risk models.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid gap-4 md:grid-cols-2">
        {methodologyPillars.map((p, idx) => (
          <Card key={idx} title={p.title}>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {p.desc}
            </p>
          </Card>
        ))}
      </div>

      {/* Mathematical Candlestick Formations */}
      <Card
        title="Mathematical Candlestick Recognition Engine"
        subtitle="Objective algorithmic criteria evaluated across incoming OHLCV candles"
        rightAction={<Badge variant="up">ZERO SUBJECTIVITY</Badge>}
      >
        <div className="grid gap-3.5 sm:grid-cols-2 pt-2">
          {candlestickFormulas.map((p, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-line bg-panelLight/40 p-3.5 space-y-2 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-white">
                  {p.name}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                    p.bias.includes("Bullish")
                      ? "bg-up/10 text-up"
                      : p.bias.includes("Bearish")
                      ? "bg-dn/10 text-dn"
                      : "bg-ai/10 text-ai"
                  }`}
                >
                  {p.bias}
                </span>
              </div>
              <div className="rounded bg-ink/80 p-2 font-mono text-[11px] text-ai/90 border border-line">
                {p.formula}
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* SHAP Feature Importance */}
      <Card
        title="Feature Importance & Interpretability (Mean |SHAP|)"
        subtitle="Calibrated weights determining trade verdict and directional win probability"
        rightAction={<Badge variant="ind">TREE SHAP EXPLAINABILITY</Badge>}
      >
        <div className="space-y-3 pt-2">
          {SHAP_FEATURES.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">{item.feature}</span>
                <span className="text-ai font-bold">{(item.shap * 100).toFixed(0)}% weight</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-ink border border-line overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ai to-cyan-400 transition-all duration-700"
                  style={{ width: `${(item.shap / 0.31) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Mathematical Formulations of Risk Metrics */}
      <Card
        title="Quantitative Performance & Risk Formulations"
        subtitle="Mathematical definitions powering backtests and live execution bounds"
      >
        <div className="grid gap-4 md:grid-cols-3 pt-2 font-mono text-xs">
          <div className="rounded-lg border border-line bg-ink/60 p-3 space-y-1.5">
            <div className="font-bold text-slate-200">Annualized Sharpe Ratio</div>
            <div className="text-ai text-[11px]">Sharpe = (μ / σ) × √(252)</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Measures excess portfolio return per unit of total standard deviation risk over a risk-free benchmark.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-ink/60 p-3 space-y-1.5">
            <div className="font-bold text-slate-200">Sortino Ratio</div>
            <div className="text-ai text-[11px]">Sortino = (μ / σ_d) × √(252)</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Penalizes only harmful downside volatility (σ_d), rewarding trades with asymmetric upside skew.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-ink/60 p-3 space-y-1.5">
            <div className="font-bold text-slate-200">Parametric 95% Daily VaR</div>
            <div className="text-ai text-[11px]">VaR(95%) = 1.645 × σ_daily × Capital</div>
            <p className="text-[10px] text-slate-400 font-sans">
              Statistically models the maximum expected loss on any single trading day at 95% confidence.
            </p>
          </div>
        </div>
      </Card>
    </main>
  );
}
