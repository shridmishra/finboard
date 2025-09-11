export interface FinnhubQuote {
  c: number; // Current price
  pc: number; // Previous close
  h?: number; // High
  l?: number; // Low
  v?: number; // Volume
}

export interface FinnhubProfile {
  name: string;
  ticker: string;
  marketCapitalization?: number;
  logo?: string;
}

export interface FinnhubCandle {
  c: number[]; // Close prices
  t: number[]; // Timestamps
  o?: number[]; // Open prices
  h?: number[]; // High prices
  l?: number[]; // Low prices
  v?: number[]; // Volumes
  s: string; // Status
}

export interface FinnhubGainer {
  symbol: string;
  c: number; // Current price
  dp: number; // Change percent
}

export interface FinnhubMetrics {
  peTTM?: number;
  epsTTM?: number;
  volume?: number;
}

export interface FinnhubNews {
  headline: string;
  datetime: number;
  source: string;
  summary: string;
  url: string;
}
