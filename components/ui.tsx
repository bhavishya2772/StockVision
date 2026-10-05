import React from "react";

export function Card({
  title,
  subtitle,
  rightAction,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-line bg-panel p-4 shadow-lg backdrop-blur-sm ${className}`}>
      {(title || rightAction) && (
        <div className="mb-3.5 flex items-center justify-between border-b border-line/50 pb-2.5">
          <div>
            {title && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] font-mono text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({
  k,
  v,
  sub,
  c = "text-white",
}: {
  k: string;
  v: string | number;
  sub?: string;
  c?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-panelLight/40 p-3 transition-colors hover:border-slate-700">
      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {k}
      </div>
      <div className={`mt-1 font-mono text-lg font-bold tracking-tight ${c}`}>
        {v}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-slate-500 font-mono">{sub}</div>}
    </div>
  );
}

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: "up" | "dn" | "ai" | "ind" | "neutral";
  children: React.ReactNode;
}) {
  const styles = {
    up: "bg-up/10 text-up border-up/30",
    dn: "bg-dn/10 text-dn border-dn/30",
    ai: "bg-ai/10 text-ai border-ai/30",
    ind: "bg-ind/10 text-indLight border-ind/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-mono font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
