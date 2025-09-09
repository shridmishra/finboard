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

type Props = { widget: WidgetConfig };

const mockData = [
  { date: "2024-09-01", close: 145 },
  { date: "2024-09-02", close: 148 },
  { date: "2024-09-03", close: 147 },
  { date: "2024-09-04", close: 151 },
  { date: "2024-09-05", close: 149 },
  { date: "2024-09-06", close: 153 },
  { date: "2024-09-07", close: 155 },
];

export default function ChartWidget({ widget }: Props) {
  return (
    <div className="w-full h-full"> {/* ✅ fill parent instead of h-64 */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
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
