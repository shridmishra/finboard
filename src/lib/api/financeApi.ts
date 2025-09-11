import {
  AlphaVantageQuote,
  AlphaVantageOverview,
  AlphaVantageTimeSeries,
  AlphaVantageSearch,
} from "@/types/alphaVantage/type";

import {
  FinnhubCandle,
  FinnhubGainer,
  FinnhubMetrics,
  FinnhubNews,
  FinnhubProfile,
  FinnhubQuote,
} from "@/types/finnhub/type";

// Finnhub fetch functions
export async function fetchFinnhubQuote(symbol: string): Promise<FinnhubQuote> {
  const res = await fetch(`/api/finnhub?symbol=${symbol}&endpoint=quote`);
  if (!res.ok) throw new Error("Failed to fetch Finnhub quote");
  return res.json();
}

export async function fetchFinnhubProfile(
  symbol: string
): Promise<FinnhubProfile> {
  const res = await fetch(
    `/api/finnhub?symbol=${symbol}&endpoint=stock/profile2`
  );
  if (!res.ok) throw new Error("Failed to fetch Finnhub profile");
  return res.json();
}

export async function fetchFinnhubCandle(
  symbol: string,
  resolution: string = "D",
  daysBack: number = 7
): Promise<FinnhubCandle> {
  const to = Math.floor(Date.now() / 1000);
  const from = to - daysBack * 24 * 60 * 60;
  const res = await fetch(
    `/api/finnhub?symbol=${symbol}&endpoint=stock/candle&resolution=${resolution}&from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error("Failed to fetch Finnhub candle");
  return res.json();
}

export async function fetchFinnhubGainers(
  exchange: string = "US"
): Promise<FinnhubGainer[]> {
  const res = await fetch(
    `/api/finnhub?endpoint=stock/gainers&exchange=${exchange}`
  );
  if (!res.ok) throw new Error("Failed to fetch Finnhub gainers");
  const data = await res.json();
  return data.data || [];
}

export async function fetchFinnhubMetrics(
  symbol: string
): Promise<FinnhubMetrics> {
  const res = await fetch(
    `/api/finnhub?symbol=${symbol}&endpoint=stock/metric&metric=all`
  );
  if (!res.ok) throw new Error("Failed to fetch Finnhub metrics");
  const data = await res.json();
  return data.metric || {};
}

export async function fetchFinnhubNews(
  symbol: string,
  daysBack: number = 7
): Promise<FinnhubNews[]> {
  const to = new Date().toISOString().split("T")[0];
  const from = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const res = await fetch(
    `/api/finnhub?symbol=${symbol}&endpoint=company-news&from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error("Failed to fetch Finnhub news");
  return res.json();
}

// Alpha Vantage fetch functions
export async function fetchAlphaVantageQuote(
  symbol: string
): Promise<AlphaVantageQuote> {
  const res = await fetch(
    `/api/alphavantage?symbol=${symbol}&function=GLOBAL_QUOTE`
  );
  if (!res.ok) throw new Error("Failed to fetch Alpha Vantage quote");
  return res.json();
}

export async function fetchAlphaVantageOverview(
  symbol: string
): Promise<AlphaVantageOverview> {
  const res = await fetch(
    `/api/alphavantage?symbol=${symbol}&function=OVERVIEW`
  );
  if (!res.ok) throw new Error("Failed to fetch Alpha Vantage overview");
  return res.json();
}

export async function fetchAlphaVantageTimeSeriesDaily(
  symbol: string
): Promise<AlphaVantageTimeSeries[]> {
  const res = await fetch(
    `/api/alphavantage?symbol=${symbol}&function=TIME_SERIES_DAILY`
  );
  if (!res.ok)
    throw new Error("Failed to fetch Alpha Vantage daily time series");
  return res.json();
}

export async function fetchAlphaVantageTimeSeriesIntraday(
  symbol: string,
  interval: string = "5min"
): Promise<AlphaVantageTimeSeries[]> {
  const res = await fetch(
    `/api/alphavantage?symbol=${symbol}&function=TIME_SERIES_INTRADAY&interval=${interval}`
  );
  if (!res.ok)
    throw new Error("Failed to fetch Alpha Vantage intraday time series");
  return res.json();
}

export async function fetchAlphaVantageSearch(
  keywords: string = "US"
): Promise<AlphaVantageSearch[]> {
  const res = await fetch(
    `/api/alphavantage?keywords=${keywords}&function=SYMBOL_SEARCH`
  );
  if (!res.ok) throw new Error("Failed to fetch Alpha Vantage search");
  return res.json();
}
