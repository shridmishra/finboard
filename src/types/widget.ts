export interface WidgetConfig {
  id: string;
  kind: "chart" | "table" | "card";
  title: string;
  position: { x: number; y: number; w: number; h: number };
  refreshIntervalSecs?: number;

  symbol?: string;         
  apiProvider?: "finnhub" | "alphaVantage"; 
}
