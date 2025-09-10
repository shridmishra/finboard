export type WidgetKind = "card" | "table" | "chart";

export interface WidgetPosition {
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
  symbol: string;
}

export type ApiResponse = Record<string, unknown> | unknown[] | null;