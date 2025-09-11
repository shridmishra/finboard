import { NextResponse } from "next/server";
import {
  AlphaVantageQuote,
  AlphaVantageOverview,
  AlphaVantageTimeSeries,
  AlphaVantageSearch,
  GlobalQuoteResponse,
  OverviewResponse,
  TimeSeriesDailyResponse,
  TimeSeriesIntradayResponse,
  SymbolSearchResponse,
  ErrorResponse,
} from "@/types/alphaVantage/type";

const ALPHA_VANTAGE_API = "https://www.alphavantage.co/query";

// Define valid function keys
type AVFunction =
  | "GLOBAL_QUOTE"
  | "OVERVIEW"
  | "TIME_SERIES_DAILY"
  | "TIME_SERIES_INTRADAY"
  | "SYMBOL_SEARCH";

// Define specific config interfaces for each function
interface GlobalQuoteConfig {
  required: string[];
  optional: string[];
  formatResponse: (
    data: GlobalQuoteResponse | ErrorResponse
  ) => AlphaVantageQuote | null;
}

interface OverviewConfig {
  required: string[];
  optional: string[];
  formatResponse: (
    data: OverviewResponse | ErrorResponse
  ) => AlphaVantageOverview | null;
}

interface TimeSeriesDailyConfig {
  required: string[];
  optional: string[];
  formatResponse: (
    data: TimeSeriesDailyResponse | ErrorResponse
  ) => AlphaVantageTimeSeries[] | null;
}

interface TimeSeriesIntradayConfig {
  required: string[];
  optional: string[];
  formatResponse: (
    data: TimeSeriesIntradayResponse | ErrorResponse
  ) => AlphaVantageTimeSeries[] | null;
}

interface SymbolSearchConfig {
  required: string[];
  optional: string[];
  formatResponse: (
    data: SymbolSearchResponse | ErrorResponse
  ) => AlphaVantageSearch[] | null;
}

// Union of all config types
type FunctionConfig =
  | GlobalQuoteConfig
  | OverviewConfig
  | TimeSeriesDailyConfig
  | TimeSeriesIntradayConfig
  | SymbolSearchConfig;

// Define function configurations
const functionConfigs: Record<AVFunction, FunctionConfig> = {
  GLOBAL_QUOTE: {
    required: ["symbol"],
    optional: [],
    formatResponse: (data: GlobalQuoteResponse | ErrorResponse) => {
      if ("Note" in data || "Information" in data) return null;
      const quote = (data as GlobalQuoteResponse)["Global Quote"];
      if (!quote) return null;
      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      };
    },
  },
  OVERVIEW: {
    required: ["symbol"],
    optional: [],
    formatResponse: (data: OverviewResponse | ErrorResponse) => {
      if ("Note" in data || "Information" in data) return null;
      const overview = data as OverviewResponse;
      return {
        symbol: overview.Symbol,
        name: overview.Name,
        marketCap: parseFloat(overview.MarketCapitalization) || undefined,
        peRatio: parseFloat(overview.PERatio) || undefined,
        volume: parseInt(overview.Volume) || undefined,
      };
    },
  },
  TIME_SERIES_DAILY: {
    required: ["symbol"],
    optional: [],
    formatResponse: (data: TimeSeriesDailyResponse | ErrorResponse) => {
      if ("Note" in data || "Information" in data) return null;
      const timeSeries = (data as TimeSeriesDailyResponse)[
        "Time Series (Daily)"
      ];
      if (!timeSeries) return null;
      return Object.entries(timeSeries)
        .slice(0, 10) // Limit to 10 days
        .map(([date, values]) => ({
          time: new Date(date).toISOString(),
          open: parseFloat(values["1. open"]),
          close: parseFloat(values["4. close"]),
        }))
        .reverse(); // Oldest to newest
    },
  },
  TIME_SERIES_INTRADAY: {
    required: ["symbol", "interval"],
    optional: [],
    formatResponse: (data: TimeSeriesIntradayResponse | ErrorResponse) => {
      if ("Note" in data || "Information" in data) return null;
      const metaData = (data as TimeSeriesIntradayResponse)["Meta Data"];
      const timeSeries = (data as TimeSeriesIntradayResponse)[
        `Time Series (${metaData["3. Interval"]})`
      ];
      if (!timeSeries) return null;
      return Object.entries(timeSeries)
        .slice(0, 10) // Limit to 10 points
        .map(([time, values]) => ({
          time: new Date(time).toISOString(),
          open: parseFloat(values["1. open"]),
          close: parseFloat(values["4. close"]),
        }))
        .reverse(); // Oldest to newest
    },
  },
  SYMBOL_SEARCH: {
    required: ["keywords"],
    optional: [],
    formatResponse: (data: SymbolSearchResponse | ErrorResponse) => {
      if ("Note" in data || "Information" in data) return null;
      const matches = (data as SymbolSearchResponse).bestMatches;
      if (!matches) return null;
      return matches.map((match) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        changePercent: parseFloat(
          match["9. changePercent"]?.replace("%", "") || "0"
        ),
      }));
    },
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const func = (searchParams.get("function") ?? "GLOBAL_QUOTE") as AVFunction;
  const symbol = searchParams.get("symbol") ?? "AAPL"; // Default for symbol-based functions
  const interval = searchParams.get("interval"); // For TIME_SERIES_INTRADAY
  const keywords = searchParams.get("keywords"); // For SYMBOL_SEARCH

  // Validate function
  if (!(func in functionConfigs)) {
    return NextResponse.json(
      { error: `Unsupported function: ${func}` },
      { status: 400 }
    );
  }

  // Get config for the function
  const config = functionConfigs[func];

  // Validate required parameters
  for (const param of config.required) {
    if (!searchParams.get(param)) {
      return NextResponse.json(
        { error: `Missing required parameter: ${param}` },
        { status: 400 }
      );
    }
  }

  // Build query string for Alpha Vantage API
  const queryParams = new URLSearchParams();
  const apiKey =
    searchParams.get("apikey") || process.env.ALPHA_VANTAGE_KEY || "demo";

  queryParams.append("apikey", apiKey);
  queryParams.append("function", func);

  if (
    config.required.includes("symbol") ||
    config.optional.includes("symbol")
  ) {
    queryParams.append("symbol", symbol);
  }
  if (interval && func === "TIME_SERIES_INTRADAY") {
    queryParams.append("interval", interval);
  }
  if (keywords && func === "SYMBOL_SEARCH") {
    queryParams.append("keywords", keywords);
  }

  try {
    const url = `${ALPHA_VANTAGE_API}?${queryParams.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error(`Alpha Vantage API error for ${func}:`, text);
      return NextResponse.json(
        { error: `Failed to fetch Alpha Vantage ${func}` },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Check for API error messages (e.g., rate limit)
    if ("Note" in data || "Information" in data) {
      console.error(
        `Alpha Vantage API message for ${func}:`,
        data.Note || data.Information
      );
      return NextResponse.json(
        { error: "Alpha Vantage API limit reached or invalid request" },
        { status: 429 }
      );
    }

    // Format response
    const formattedData = config.formatResponse(data);

    if (!formattedData) {
      console.error(`Invalid Alpha Vantage data for ${func}:`, data);
      return NextResponse.json(
        { error: `No data available for ${func}` },
        { status: 500 }
      );
    }

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error(
      `Alpha Vantage fetch failed for ${func}:`,
      err instanceof Error ? err.message : String(err)
    );
    return NextResponse.json(
      { error: `Alpha Vantage fetch failed for ${func}` },
      { status: 500 }
    );
  }
}
