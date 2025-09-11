export type WidgetKind = "card" | "table" | "chart";

export interface WidgetPosition {
  minW: number;
  maxW: number;
  minH: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  id: string;
  kind: WidgetKind;
  title: string;
  apiUrl: string;
  refreshIntervalSecs: number;
  fields: string[];
  position: WidgetPosition;
  symbol?: string;
  type?: "watchlist" | "gainers" | "performance" | "financial";
  api?: "finnhub" | "alphavantage";
}

export type ApiResponse = Record<string, unknown> | unknown[] | null;