// components/ChartWidget.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartConfig } from "@/components/ui/chart";
import { WidgetConfig } from "@/types/widget";

interface Props {
  widget: WidgetConfig;
}

interface ChartData {
  time: string;
  open: number;
  close: number;
}

const chartConfig = {
  open: { label: "Open", color: "#10B981" }, // Green
  close: { label: "Close", color: "#3B82F6" }, // Blue
} satisfies ChartConfig;

export function ChartWidget({ widget }: Props) {
  const symbol = widget.symbol ?? "AAPL";
  const refreshInterval = (widget.refreshIntervalSecs ?? 30) * 1000; // 30s for testing
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fetchCount, setFetchCount] = useState(0); // Track fetches

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["stockHistory", symbol],
    queryFn: async () => {
      const res = await fetch(`/api/finnhub?symbol=${symbol}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error:", errorText);
        throw new Error("API error");
      }
      const json = await res.json();
      console.log("API Response:", json);

      if (!json.o || !json.c) {
        console.error("Invalid API data:", json);
        throw new Error("Invalid API data");
      }

      return {
        time: new Date().toISOString(), // Unique ISO timestamp
        open: json.o,
        close: json.c,
      };
    },
    refetchInterval: refreshInterval,
    staleTime: refreshInterval / 2,
    enabled: !!symbol,
  });

  // Append new data to chartData
  useEffect(() => {
    if (data && data.open && data.close) {
      setChartData((prev) => {
        const newData = [...prev, data].slice(-10); // Keep last 10 points for bar chart
        console.log("Appending data:", data);
        console.log("Updated chartData:", newData, "Length:", newData.length);
        setFetchCount((prev) => prev + 1);
        return newData;
      });
    }
  }, [data]);

  // Log chartData on render
  useEffect(() => {
    console.log("Current chartData on render:", chartData);
  }, [chartData]);

  // Fallback to mock data if no data after 3 fetches
  useEffect(() => {
    if (fetchCount >= 3 && chartData.length === 0) {
      console.warn("No data after 3 fetches, using mock data");
      const mockData = Array.from({ length: 5 }, (_, i) => ({
        time: new Date(Date.now() - i * 30 * 1000).toISOString(),
        open: 237 + Math.random() * 5,
        close: 234.35 + Math.random() * 5,
      }));
      setChartData(mockData);
      console.log("Mock data applied:", mockData);
    }
  }, [fetchCount]);

  if (!widget.symbol) return <div>No symbol specified</div>;
  if (isLoading && chartData.length === 0) return <div>Loading chart...</div>;
  if (error) return <div>Error fetching chart data: {(error as Error).message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {symbol} Stock Chart
          <Badge variant="outline" className="text-green-500 bg-green-500/10 border-none ml-2">
            <TrendingUp className="h-4 w-4" />
            <span>{isFetching ? "Updating" : "Live"}</span>
          </Badge>
        </CardTitle>
        <CardDescription>Real-time stock data</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}STOCK CHART
AAPL Stock Chart
Live
Real-time stock data
17:58
234
234.75
235.5
236.25
237
Data points: 1 (Fetches: 2)
￼Remove
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
              formatter={(value, name) => [value, chartConfig[name]?.label || name]}
            />
            <Bar dataKey="open" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="close" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
        <div className="text-sm text-muted-foreground mt-2">
          Data points: {chartData.length} (Fetches: {fetchCount}) {isFetching ? "(Fetching...)" : ""}
        </div>
      </CardContent>
    </Card>
  );
}