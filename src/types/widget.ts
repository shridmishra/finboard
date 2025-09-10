export type WidgetConfig = {
  id: string;
  kind: "card" | "table" | "chart";
  title: string;
  position: { x: number; y: number; w: number; h: number };
  refreshIntervalSecs: number;
  apiUrl?: string;
  fields?: string[];
  symbol?: string;
};