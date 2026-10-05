import { NextRequest, NextResponse } from "next/server";
import { getMarketAnalysis } from "@/lib/marketService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker") || "AAPL";
    const timeframe = searchParams.get("timeframe") as "1D" | "1W" | "1M" | null;

    const analysis = await getMarketAnalysis(ticker);

    if (timeframe && analysis.timeframes[timeframe]) {
      return NextResponse.json({
        ticker: analysis.ticker,
        name: analysis.name,
        currentPrice: analysis.currentPrice,
        change: analysis.change,
        changePercent: analysis.changePercent,
        lastUpdated: analysis.lastUpdated,
        isRealData: analysis.isRealData,
        timeframe: analysis.timeframes[timeframe],
        mlInference: analysis.mlInference,
      }, {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      });
    }

    return NextResponse.json(analysis, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("[StockCandle API Error]:", error);
    return NextResponse.json(
      { error: "Failed to process market data", details: (error as Error).message },
      { status: 500 }
    );
  }
}
