"use client";
import { useDashboardStore } from "@/stores/dashboardStore";
import WidgetShell from "./WidgetShell";

export default function Dashboard() {
  const widgets = useDashboardStore((s) => s.widgets);
  const addWidget = useDashboardStore((s) => s.addWidget);

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => addWidget("chart")}
          className="px-3 py-1 rounded bg-blue-500 text-white"
        >
          Add Chart
        </button>
        <button
          onClick={() => addWidget("table")}
          className="px-3 py-1 rounded bg-green-500 text-white"
        >
          Add Table
        </button>
        <button
          onClick={() => addWidget("card")}
          className="px-3 py-1 rounded bg-purple-500 text-white"
        >
          Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <WidgetShell key={w.id} widget={w} />
        ))}
      </div>
    </div>
  );
}
