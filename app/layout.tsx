import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import type { Metadata } from "next";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "StockCandle — Multi-Timeframe Pattern Intelligence & Quantitative ML",
  description: "Institutional-grade multi-timeframe candlestick pattern scanner, real-time market data, and triple-barrier machine learning risk engine.",
  keywords: ["StockCandle", "algorithmic trading", "candlestick patterns", "machine learning", "multi-timeframe", "quant terminal"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} font-sans bg-ink text-slate-200 antialiased min-h-screen selection:bg-cyan-500/20 selection:text-cyan-300`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
