"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchFinnhubQuote,
  fetchFinnhubProfile,
  fetchFinnhubCandle,
  fetchFinnhubGainers,
  fetchFinnhubMetrics,
  fetchAlphaVantageQuote,
  fetchAlphaVantageOverview,
  fetchAlphaVantageTimeSeriesDaily,
  fetchAlphaVantageSearch,
 
} from "@/lib/api/financeApi";
import { WidgetConfig } from "@/types/types";

// Unified interfaces for rendering
interface UnifiedQuote {
  price: number;
  changePercent: number;
}

interface UnifiedFinancial {
  marketCap?: number;
  peRatio?: number;
  volume?: number;
}

interface UnifiedTimeSeries {
  time: string;
  close: number;
}

interface UnifiedGainer {
  symbol: string;
  name?: string;
  changePercent: number;
}

export default function FinanceCard({ widget }: { widget: WidgetConfig }) {
  const { symbol = "AAPL", refreshIntervalSecs = 60, type, api = "finnhub" } = widget;
  const refreshInterval = refreshIntervalSecs * 1000;

  const cardType: "watchlist" | "gainers" | "performance" | "financial" =
    ["watchlist", "gainers", "performance", "financial"].includes(type ?? "")
      ? (type as "watchlist" | "gainers" | "performance" | "financial")
      : "watchlist";

  // Finnhub queries
  const { data: finnhubQuote, isLoading: finnhubQuoteLoading } = useQuery({
    queryKey: ["finnhubQuote", symbol],
    queryFn: () => fetchFinnhubQuote(symbol),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "finnhub" && cardType !== "gainers" && !!symbol,
  });

  const { data: finnhubFinancial, isLoading: finnhubFinancialLoading } = useQuery({
    queryKey: ["finnhubFinancial", symbol],
    queryFn: async () => {
      const [profile, metrics] = await Promise.all([
        fetchFinnhubProfile(symbol),
        fetchFinnhubMetrics(symbol),
      ]);
      return { marketCap: profile.marketCapitalization, peRatio: metrics.peTTM, volume: metrics.volume };
    },
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "finnhub" && cardType === "financial" && !!symbol,
  });

  const { data: finnhubTimeSeries, isLoading: finnhubTimeSeriesLoading } = useQuery({
    queryKey: ["finnhubPerformance", symbol],
    queryFn: () => fetchFinnhubCandle(symbol),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "finnhub" && cardType === "performance" && !!symbol,
  });

  const { data: finnhubGainers, isLoading: finnhubGainersLoading } = useQuery({
    queryKey: ["finnhubGainers"],
    queryFn: () => fetchFinnhubGainers(),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "finnhub" && cardType === "gainers",
  });

  // Alpha Vantage queries
  const { data: alphaQuote, isLoading: alphaQuoteLoading } = useQuery({
    queryKey: ["alphaQuote", symbol],
    queryFn: () => fetchAlphaVantageQuote(symbol),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "alphavantage" && cardType !== "gainers" && !!symbol,
  });

  const { data: alphaFinancial, isLoading: alphaFinancialLoading } = useQuery({
    queryKey: ["alphaFinancial", symbol],
    queryFn: () => fetchAlphaVantageOverview(symbol),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "alphavantage" && cardType === "financial" && !!symbol,
  });

  const { data: alphaTimeSeries, isLoading: alphaTimeSeriesLoading } = useQuery({
    queryKey: ["alphaPerformance", symbol],
    queryFn: () => fetchAlphaVantageTimeSeriesDaily(symbol),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "alphavantage" && cardType === "performance" && !!symbol,
  });

  const { data: alphaGainers, isLoading: alphaGainersLoading } = useQuery({
    queryKey: ["alphaGainers"],
    queryFn: () => fetchAlphaVantageSearch(),
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: api === "alphavantage" && cardType === "gainers",
  });

  // Normalize data based on API
  const quote: UnifiedQuote | undefined =
    api === "finnhub" && finnhubQuote
      ? { price: finnhubQuote.c, changePercent: ((finnhubQuote.c - finnhubQuote.pc) / finnhubQuote.pc) * 100 }
      : api === "alphavantage" && alphaQuote
      ? { price: alphaQuote.price, changePercent: alphaQuote.changePercent }
      : undefined;

  const financial: UnifiedFinancial | undefined =
    api === "finnhub" && finnhubFinancial
      ? finnhubFinancial
      : api === "alphavantage" && alphaFinancial
      ? { marketCap: alphaFinancial.marketCap, peRatio: alphaFinancial.peRatio, volume: alphaFinancial.volume }
      : undefined;

  const timeSeries: UnifiedTimeSeries[] | undefined =
    api === "finnhub" && finnhubTimeSeries
      ? finnhubTimeSeries.c.map((close, i) => ({
          time: new Date(finnhubTimeSeries.t[i] * 1000).toISOString(),
          close,
        }))
      : api === "alphavantage" && alphaTimeSeries
      ? alphaTimeSeries
      : undefined;

  const gainers: UnifiedGainer[] | undefined =
    api === "finnhub" && finnhubGainers
      ? finnhubGainers.map((g) => ({ symbol: g.symbol, changePercent: g.dp }))
      : api === "alphavantage" && alphaGainers
      ? alphaGainers
      : undefined;

  const isLoading =
    finnhubQuoteLoading ||
    finnhubFinancialLoading ||
    finnhubTimeSeriesLoading ||
    finnhubGainersLoading ||
    alphaQuoteLoading ||
    alphaFinancialLoading ||
    alphaTimeSeriesLoading ||
    alphaGainersLoading;

  const renderContent = () => {
    // Validate symbol for non-gainers types
    if (cardType !== "gainers" && !symbol) {
      return (
        <div className="p-4">
          <p className="text-red-500">Symbol is required</p>
        </div>
      );
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="p-4">
          <p className="text-gray-500 dark:text-gray-400">
            Loading {cardType === "gainers" ? "gainers" : symbol}...
          </p>
        </div>
      );
    }

    // Handle failed data fetch
    if (cardType !== "gainers" && !quote) {
      return (
        <div className="p-4">
          <p className="text-red-500">Failed to load data for {symbol}</p>
        </div>
      );
    }

    if (cardType === "gainers" && (!gainers || !gainers[0])) {
      return (
        <div className="p-4">
          <p className="text-red-500">Failed to load gainers data</p>
        </div>
      );
    }

    // Render gainers card
    if (cardType === "gainers") {
      const topGainer = gainers![0]; // Non-null assertion since checked
      const changeText = `${topGainer.changePercent >= 0 ? "+" : ""}${topGainer.changePercent.toFixed(2)}%`;
      return (
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">{topGainer.symbol}</h3>
          {topGainer.name && <p className="text-base">Name: {topGainer.name}</p>}
          <p className={`text-base font-bold ${topGainer.changePercent < 0 ? "text-red-500" : "text-green-600"}`}>
            Daily Change: {changeText}
          </p>
        </div>
      );
    }

    // Calculate change for non-gainers types
    const changeText = `${quote!.changePercent >= 0 ? "+" : ""}${quote!.changePercent.toFixed(2)}%`;
    const changeClass = quote!.changePercent < 0 ? "text-red-500" : "text-green-600";

    switch (cardType) {
      case "watchlist":
        return (
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{symbol}</h3>
            <p className="text-base">Price: ${quote!.price.toFixed(2)}</p>
            <p className={`text-base ${changeClass}`}>Change: {changeText}</p>
          </div>
        );
      case "performance":
        const weekChange = timeSeries && timeSeries.length > 1
          ? ((timeSeries[0].close - timeSeries[timeSeries.length - 1].close) / timeSeries[timeSeries.length - 1].close) * 100
          : 0;
        return (
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{symbol}</h3>
            <p className="text-base">Price: ${quote!.price.toFixed(2)}</p>
            <p className={`text-base ${weekChange < 0 ? "text-red-500" : "text-green-600"}`}>
              Weekly Change: {weekChange.toFixed(2)}%
            </p>
          </div>
        );
      case "financial":
        return (
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{symbol}</h3>
            <p className="text-base">Price: ${quote!.price.toFixed(2)}</p>
            <p>Market Cap: {financial?.marketCap ? `$${financial.marketCap.toLocaleString()}` : "N/A"}</p>
            <p>P/E Ratio: {financial?.peRatio?.toFixed(2) || "N/A"}</p>
            <p>Volume: {financial?.volume?.toLocaleString() || "N/A"}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
      {renderContent()}
    </div>
  );
}