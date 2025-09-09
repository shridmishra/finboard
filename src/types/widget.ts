export type WidgetKind = 'chart' | 'table' | 'card';

export interface WidgetConfig {
  id: string;
  kind: WidgetKind;
  title: string;
  position: { x: number; y: number; w: number; h: number };
  refreshIntervalSecs?: number;
}
