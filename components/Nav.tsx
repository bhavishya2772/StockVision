"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CandlestickChart, Activity, Cpu, ShieldCheck, ExternalLink } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/terminal", label: "Live Terminal", icon: Activity },
    { href: "/backtest", label: "Backtests & Alpha", icon: Cpu },
    { href: "/methodology", label: "Quant Methodology", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[#070a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-ai/20 to-ind/20 border border-ai/30 group-hover:border-ai/60 transition-colors">
              <CandlestickChart className="h-4.5 w-4.5 text-ai group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
                Stock<span className="text-ai font-extrabold">Candle</span>
                <span className="rounded bg-ai/10 px-1.5 py-0.2 text-[10px] font-mono text-ai border border-ai/20">v2.4 PRO</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    active
                      ? "bg-panel text-white border border-line shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-panelLight/40"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-ai" : "text-slate-500"}`} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-line bg-panel/80 px-2.5 py-1 text-[11px] font-mono text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-up opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-up"></span>
            </span>
            <span>FEED: <span className="text-up font-semibold">ONLINE</span></span>
          </div>

          <Link
            href="/terminal"
            className="flex items-center gap-1.5 rounded-md bg-ai px-3.5 py-1.5 text-xs font-semibold text-ink hover:bg-cyan-300 transition-colors shadow-sm"
          >
            <span>Open Terminal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
