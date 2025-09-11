export interface AlphaVantageQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface AlphaVantageOverview {
  symbol: string;
  name: string;
  marketCap?: number;
  peRatio?: number;
  volume?: number;
}

export interface AlphaVantageTimeSeries {
  time: string;
  open: number;
  close: number;
}

export interface AlphaVantageSearch {
  symbol: string;
  name: string;
  changePercent: number;
}

export interface GlobalQuoteResponse {
  "Global Quote": {
    "01. symbol": string;
    "05. price": string;
    "09. change": string;
    "10. change percent": string;
  };
}

export interface OverviewResponse {
  Symbol: string;
  Name: string;
  MarketCapitalization: string;
  PERatio: string;
  Volume: string;
}

export interface TimeSeriesDailyResponse {
  "Meta Data": {
    "2. Symbol": string;
  };
  "Time Series (Daily)": {
    [date: string]: {
      "1. open": string;
      "4. close": string;
    };
  };
}

export interface TimeSeriesIntradayResponse {
  "Meta Data": {
    "2. Symbol": string;
    "3. Interval": string;
  };
  [key: string]: {
    [time: string]: {
      "1. open": string;
      "4. close": string;
    };
  } | {
    "2. Symbol": string;
    "3. Interval": string;
  };
}

export interface SymbolSearchResponse {
  bestMatches: Array<{
    "1. symbol": string;
    "2. name": string;
    "9. changePercent"?: string;
  }>;
}

export interface ErrorResponse {
  Note?: string;
  Information?: string;
}