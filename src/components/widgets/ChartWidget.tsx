// src/components/widgets/ChartWidget.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WidgetConfig } from "@/types/types";

// Chart data type
interface ChartData {
  time: string;
  open: number;
  close: number;
}

// Restrict chart keys
type ChartKeys = "open" | "close";

const chartConfig: Record<ChartKeys, { label: string; color: string }> = {
  open: { label: "Open", color: "#10B981" }, // Green
  close: { label: "Close", color: "#3B82F6" }, // Blue
};

interface Props {
  widget: WidgetConfig;
}

export function ChartWidget({ widget }: Props) {
  const symbol = widget.symbol ?? "AAPL";
  const refreshInterval = (widget.refreshIntervalSecs ?? 30) * 1000;

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fetchCount, setFetchCount] = useState(0);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["stockHistory", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/finnhub?symbol=${symbol}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();

      if (!json.o || !json.c) throw new Error("Invalid API data");

      return {
        time: new Date().toISOString(),
        open: json.o,
        close: json.c,
      };
    },
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: !!symbol,
  });

  // Append new data
  useEffect(() => {
    if (data?.open && data?.close) {
      setChartData((prev) => {
        const newData = [...prev, data].slice(-10);
        setFetchCount((p) => p + 1);
        return newData;
      });
    }
  }, [data]);

  // Fallback to mock data if no API data after 3 tries
  useEffect(() => {
    if (fetchCount >= 3 && chartData.length === 0) {
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        time: new Date(Date.now() - i * 30 * 1000).toISOString(),
        open: 237 + Math.random() * 5,
        close: 234.35 + Math.random() * 5,
      }));
      setChartData(mockData);
    }
  }, [fetchCount, chartData.length]);

  if (!widget.symbol) return <div>No symbol specified</div>;
  if (isLoading && chartData.length === 0) return <div>Loading chart...</div>;
  if (error) return <div>Error fetching chart data</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {symbol} Stock Chart
          <Badge
            variant="outline"
            className="text-green-500 bg-green-500/10 border-none ml-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{isFetching ? "Updating" : "Live"}</span>
          </Badge>
        </CardTitle>
        <CardDescription>Real-time stock data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full min-h-[300px] min-w-[250px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                />
                <YAxis domain={["auto", "auto"]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value, name) => {
                    const key = name as ChartKeys;
                    return [value, chartConfig[key]?.label || key];
                  }}
                />
                <Bar
                  dataKey="open"
                  fill={chartConfig.open.color}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="close"
                  fill={chartConfig.close.color}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Data points: {chartData.length} (Fetches: {fetchCount}){" "}
          {isFetching ? "(Fetching...)" : ""}
        </div>
      </CardContent>
    </Card>
  );
}
