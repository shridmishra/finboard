"use client";
import { WidgetConfig } from "@/types/widget";
import { useDashboardStore } from "@/stores/dashboardStore";
import ChartWidget from "../widgets/ChartWidget";
import TableWidget from "../widgets/TableWidget";
import CardWidget from "../widgets/CardWidget";

export default function WidgetShell({ widget }: { widget: WidgetConfig }) {
  const remove = useDashboardStore((s) => s.removeWidget);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border rounded-lg shadow overflow-hidden">
      {/* Draggable Header */}
      <div className="drag-handle cursor-move px-3 py-2 border-b dark:border-slate-700 bg-gray-100 dark:bg-slate-700 rounded-t-lg">
        <h3 className="font-semibold text-sm truncate uppercase">{widget.title}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto non-draggable min-h-[150px]">
        {widget.kind === "chart" && (
          <div className="w-full h-full p-2 md:p-4">
            <ChartWidget widget={{ ...widget }} /> {/* ✅ spread ensures plain object */}
          </div>
        )}
        {widget.kind === "table" && (
          <div className="w-full h-full p-2 md:p-4">
            <TableWidget widget={{ ...widget }} />
          </div>
        )}
        {widget.kind === "card" && (
          <div className="w-full h-full p-2 md:p-4">
            <CardWidget widget={{ ...widget }} />
          </div>
        )}
      </div>

      {/* Remove Button */}
      <div className="p-2 border-t dark:border-slate-700 flex justify-end non-draggable">
        <button
          onClick={() => remove(widget.id)}
          className="text-red-500 text-xs md:text-sm hover:text-red-600 transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
