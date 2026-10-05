"use client";

import React, { useState } from "react";
import { Candle, Pat } from "@/lib/types";

interface ChartProps {
  candles: Candle[];
  height?: number;
  marks?: Pat[];
  lines?: { v: (number | null)[]; col: string; name: string }[];
  levels?: { y: number; col: string; label: string }[];
  showVolume?: boolean;
}

export function Chart({
  candles,
  height = 340,
  marks = [],
  lines = [],
  levels = [],
  showVolume = true,
}: ChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!candles || candles.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-slate-500 font-mono"
      >
        Waiting for candle stream...
      </div>
    );
  }

  const c = candles;
  const width = 880;
  const priceAxisWidth = 65;
  const plotWidth = width - priceAxisWidth;
  const volHeight = showVolume ? 60 : 0;
  const mainPlotHeight = height - volHeight - 30; // 30px for HUD & margins
  const topPad = 25;

  // Compute price bounds
  const prices = c.flatMap((k) => [k.h, k.l]);
  levels.forEach((l) => prices.push(l.y));
  lines.forEach((ln) =>
    ln.v.forEach((val) => {
      if (val !== null && !isNaN(val)) prices.push(val);
    })
  );

  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const yPos = (v: number) =>
    topPad + (1 - (v - minPrice) / priceRange) * mainPlotHeight;

  // Volume bounds
  const maxVol = Math.max(...c.map((k) => k.v || 1000));
  const volYPos = (v: number) =>
    height - 10 - ((v || 0) / (maxVol || 1)) * (volHeight - 15);

  const candleSpacing = plotWidth / c.length;
  const xPos = (i: number) => candleSpacing * (i + 0.5);
  const candleBodyWidth = Math.max(2, Math.min(14, candleSpacing * 0.72));

  // Current hovered or latest candle for HUD
  const activeCandle =
    hoverIdx !== null && c[hoverIdx] ? c[hoverIdx] : c[c.length - 1];
  const prevActiveCandle =
    hoverIdx !== null && hoverIdx > 0
      ? c[hoverIdx - 1]
      : c.length > 1
      ? c[c.length - 2]
      : activeCandle;

  const activeDelta = activeCandle ? activeCandle.c - prevActiveCandle.c : 0;
  const activeDeltaPct =
    prevActiveCandle && prevActiveCandle.c
      ? (activeDelta / prevActiveCandle.c) * 100
      : 0;

  // Filter marks within current candles
  const visibleMarks = marks.filter((m) => m.i >= 0 && m.i < c.length);

  return (
    <div className="relative select-none w-full">
      {/* Interactive HUD Bar */}
      {activeCandle && (
        <div className="flex flex-wrap items-center justify-between border-b border-line/60 bg-[#070a0f]/80 px-3 py-1.5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-300 font-semibold">{activeCandle.date}</span>
            <span>
              O: <span className="text-slate-200">{activeCandle.o.toFixed(2)}</span>
            </span>
            <span>
              H: <span className="text-slate-200">{activeCandle.h.toFixed(2)}</span>
            </span>
            <span>
              L: <span className="text-slate-200">{activeCandle.l.toFixed(2)}</span>
            </span>
            <span>
              C:{" "}
              <span
                className={
                  activeCandle.c >= activeCandle.o ? "text-up font-bold" : "text-dn font-bold"
                }
              >
                {activeCandle.c.toFixed(2)}
              </span>
            </span>
            <span
              className={`rounded px-1 py-0.2 text-[10px] ${
                activeDelta >= 0 ? "bg-up/10 text-up" : "bg-dn/10 text-dn"
              }`}
            >
              {activeDelta >= 0 ? "+" : ""}
              {activeDelta.toFixed(2)} ({activeDeltaPct.toFixed(2)}%)
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {activeCandle.v && (
              <span>
                Vol: <span className="text-slate-300">{(activeCandle.v / 1e6).toFixed(2)}M</span>
              </span>
            )}
            {lines.map((l, idx) => {
              const val = hoverIdx !== null ? l.v[hoverIdx] : l.v[l.v.length - 1];
              if (val === null || val === undefined) return null;
              return (
                <span key={idx} style={{ color: l.col }}>
                  {l.name}: {val.toFixed(2)}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Candlestick & Volume Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full cursor-crosshair overflow-visible"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="volGradUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="volGradDn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Grid Lines & Price Labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((step, idx) => {
          const val = minPrice + (maxPrice - minPrice) * step;
          const y = yPos(val);
          return (
            <g key={idx}>
              <line
                x1="0"
                x2={plotWidth}
                y1={y}
                y2={y}
                stroke="#1f2937"
                strokeDasharray="2 3"
                strokeWidth="1"
              />
              <text
                x={plotWidth + 8}
                y={y + 3.5}
                fontSize="10"
                fill="#64748b"
                fontFamily="var(--font-mono)"
              >
                {val.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Volume Separator line */}
        {showVolume && (
          <line
            x1="0"
            x2={plotWidth}
            y1={height - volHeight}
            y2={height - volHeight}
            stroke="#1f2937"
            strokeWidth="1"
          />
        )}

        {/* Volume Bars */}
        {showVolume &&
          c.map((k, i) => {
            const isUp = k.c >= k.o;
            const x = xPos(i);
            const y = volYPos(k.v || 0);
            const barH = Math.max(1, height - 10 - y);
            return (
              <rect
                key={`vol-${i}`}
                x={x - candleBodyWidth * 0.45}
                y={y}
                width={candleBodyWidth * 0.9}
                height={barH}
                fill={isUp ? "url(#volGradUp)" : "url(#volGradDn)"}
                stroke={isUp ? "#10b981" : "#f43f5e"}
                strokeOpacity="0.4"
                strokeWidth="0.5"
              />
            );
          })}

        {/* Candlesticks */}
        {c.map((k, i) => {
          const isUp = k.c >= k.o;
          const col = isUp ? "#10b981" : "#f43f5e";
          const x = xPos(i);
          const yOpen = yPos(k.o);
          const yClose = yPos(k.c);
          const yHigh = yPos(k.h);
          const yLow = yPos(k.l);
          const topBody = Math.min(yOpen, yClose);
          const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));

          return (
            <g
              key={`candle-${i}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
            >
              {/* Wick */}
              <line
                x1={x}
                x2={x}
                y1={yHigh}
                y2={yLow}
                stroke={col}
                strokeWidth="1.2"
              />
              {/* Body */}
              <rect
                x={x - candleBodyWidth / 2}
                y={topBody}
                width={candleBodyWidth}
                height={bodyH}
                fill={isUp ? "#10b981" : "#f43f5e"}
                rx="0.5"
              />
            </g>
          );
        })}

        {/* Moving Average Poly-lines */}
        {lines.map((l, li) => {
          const points = l.v
            .map((val, i) => {
              if (val === null || isNaN(val)) return null;
              return `${xPos(i)},${yPos(val)}`;
            })
            .filter(Boolean)
            .join(" ");

          if (!points) return null;

          return (
            <polyline
              key={`line-${li}`}
              fill="none"
              stroke={l.col}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          );
        })}

        {/* Horizontal Level Guidelines (Stop-Loss, Target 1, Target 2) */}
        {levels.map((l, li) => {
          const y = yPos(l.y);
          if (y < 0 || y > height) return null;
          return (
            <g key={`lvl-${li}`}>
              <line
                x1="0"
                x2={plotWidth}
                y1={y}
                y2={y}
                stroke={l.col}
                strokeDasharray="4 3"
                strokeWidth="1.2"
              />
              <rect
                x="4"
                y={y - 9}
                width="84"
                height="15"
                rx="2"
                fill="#070a0f"
                stroke={l.col}
                strokeWidth="0.8"
              />
              <text
                x="8"
                y={y + 2.5}
                fontSize="9.5"
                fontWeight="600"
                fill={l.col}
                fontFamily="var(--font-mono)"
              >
                {l.label}: {l.y.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Contextual Pattern Badges on Trigger Candles */}
        {visibleMarks.map((m, mi) => {
          const k = c[m.i];
          if (!k) return null;
          const x = xPos(m.i);
          const isBull = m.bias > 0;
          const col = isBull ? "#10b981" : "#f43f5e";
          const y = isBull ? yPos(k.l) + 14 : yPos(k.h) - 22;

          return (
            <g key={`pat-${mi}`} className="transition-all">
              <line
                x1={x}
                x2={x}
                y1={isBull ? yPos(k.l) : yPos(k.h)}
                y2={y + (isBull ? -4 : 10)}
                stroke={col}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect
                x={x - 44}
                y={y - 8}
                width="88"
                height="16"
                rx="3"
                fill="#070a0f"
                stroke={col}
                strokeWidth="1"
              />
              <text
                x={x}
                y={y + 3.5}
                fontSize="8.5"
                fontWeight="bold"
                textAnchor="middle"
                fill={col}
                fontFamily="var(--font-mono)"
              >
                {m.name.length > 14 ? m.name.slice(0, 13) + "…" : m.name}
              </text>
            </g>
          );
        })}

        {/* Hover Crosshair */}
        {hoverIdx !== null && (
          <g pointerEvents="none">
            <line
              x1={xPos(hoverIdx)}
              x2={xPos(hoverIdx)}
              y1={topPad}
              y2={height - 10}
              stroke="#64748b"
              strokeDasharray="2 2"
              strokeWidth="1"
            />
            {activeCandle && (
              <>
                <line
                  x1="0"
                  x2={plotWidth}
                  y1={yPos(activeCandle.c)}
                  y2={yPos(activeCandle.c)}
                  stroke="#64748b"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
                <rect
                  x={plotWidth}
                  y={yPos(activeCandle.c) - 9}
                  width={priceAxisWidth}
                  height="18"
                  fill="#1f2937"
                />
                <text
                  x={plotWidth + 6}
                  y={yPos(activeCandle.c) + 3.5}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#f8fafc"
                  fontFamily="var(--font-mono)"
                >
                  {activeCandle.c.toFixed(2)}
                </text>
              </>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Performance & Equity Curve Chart for Backtests
 */
export function Line({
  series,
  n,
  height = 260,
}: {
  series: { pts: { i: number; v: number; date?: string }[]; col: string; label: string }[];
  n: number;
  height?: number;
}) {
  const [hoverPt, setHoverPt] = useState<number | null>(null);

  const width = 880;
  const paddingX = 60;
  const plotWidth = width - paddingX;
  const plotHeight = height - 40;

  const allVals = series.flatMap((s) => s.pts.map((p) => p.v));
  if (allVals.length === 0) return null;

  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const valRange = maxVal - minVal || 1;

  const yPos = (v: number) => 15 + (1 - (v - minVal) / valRange) * plotHeight;
  const maxI = Math.max(n, ...series.flatMap((s) => s.pts.map((p) => p.i)), 1);
  const xPos = (i: number) => (i / maxI) * plotWidth;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 font-mono">
              <span
                className="h-2 w-2 rounded-full inline-block"
                style={{ backgroundColor: s.col }}
              />
              <span className="text-slate-300 font-semibold">{s.label}</span>
              <span className="text-slate-400">
                ${s.pts[s.pts.length - 1]?.v?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          ))}
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Baseline Capital: $100,000 USD
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none">
        {/* Horizontal gridlines */}
        {[0, 0.33, 0.66, 1].map((step, idx) => {
          const val = minVal + valRange * step;
          const y = yPos(val);
          return (
            <g key={idx}>
              <line
                x1="0"
                x2={plotWidth}
                y1={y}
                y2={y}
                stroke="#1f2937"
                strokeDasharray="2 3"
                strokeWidth="1"
              />
              <text
                x={plotWidth + 6}
                y={y + 3.5}
                fontSize="10"
                fill="#64748b"
                fontFamily="var(--font-mono)"
              >
                ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Polylines for each series */}
        {series.map((s) => {
          const points = s.pts.map((p) => `${xPos(p.i)},${yPos(p.v)}`).join(" ");
          return (
            <g key={s.label}>
              <polyline
                fill="none"
                stroke={s.col}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
