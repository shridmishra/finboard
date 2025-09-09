"use client";

import { WidgetConfig } from "@/types/widget";

type Props = { widget: WidgetConfig };

// Mock finance metrics
const mockMetrics = [
  { title: "Portfolio Value", value: "$120,450", change: "+2.3%" },
  { title: "Top Gainer", value: "AAPL +3.2%", change: "" },
  { title: "Top Loser", value: "TSLA -1.5%", change: "" },
];
export default function CardWidget({ widget }: Props) {
  const metric = mockMetrics[Math.floor(Math.random() * mockMetrics.length)];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-2 sm:p-4 overflow-hidden">
      <div className="flex-1 flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-green-800 rounded-lg overflow-hidden">
        <h4 className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-full">
          {metric.title}
        </h4>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate max-w-full">
          {metric.value}
        </p>
        {metric.change && (
          <p
            className={`mt-1 text-xs sm:text-sm ${
              metric.change.startsWith("-") ? "text-red-500" : "text-green-600"
            }`}
          >
            {metric.change}
          </p>
        )}
      </div>
    </div>
  );
}
