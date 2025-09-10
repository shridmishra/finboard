"use client";

import { WidgetConfig } from "@/types/widget";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

interface Props {
  widget: WidgetConfig;
}

export default function ChartWidget({ widget }: Props) {
  const symbol = widget.symbol ?? "AAPL";
  const refreshInterval = (widget.refreshIntervalSecs ?? 60) * 1000;

  // React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["stockHistory", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/finnhub?symbol=${symbol}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();

      // Transform data if needed for Recharts
      // Finnhub /quote returns { c, h, l, o, pc, t } (current, high, low, open, previous close, timestamp)
      // Recharts expects an array with { date, close } for LineChart
      return [
        {
          date: new Date(json.t * 1000).toLocaleTimeString(),
          close: json.c,
        },
      ];
    },
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: !!symbol,
  });

  if (!widget.symbol) return <div>No symbol specified</div>;
  if (isLoading) return <div>Loading chart...</div>;
  if (error || !data) return <div>Error fetching chart data</div>;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" stroke="var(--color-foreground)" />
          <YAxis stroke="var(--color-foreground)" />
          <Tooltip
            contentStyle={{
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="var(--color-main)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
