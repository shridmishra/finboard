"use client";
import { WidgetConfig } from "@/types/widget";
import { useDashboardStore } from "@/stores/dashboardStore";
import ChartWidget from "../widgets/ChartWidget";
import TableWidget from "../widgets/TableWidget";
import CardWidget from "../widgets/CardWidget";

export default function WidgetShell({ widget }: { widget: WidgetConfig }) {
  const remove = useDashboardStore((s) => s.removeWidget);

  return (
    <div className="border rounded-lg bg-white shadow dark:bg-slate-800 flex flex-col h-full overflow-hidden">
      {/* ✅ Only this section is draggable */}
      <div className="drag-handle cursor-move px-3 py-2 border-b dark:border-slate-700 bg-gray-100 dark:bg-slate-700 rounded-t-lg">
        <h3 className="font-semibold text-sm truncate uppercase">{widget.title}</h3>
      </div>

      {/* ✅ Content fills all remaining space */}
      <div className="flex-1 overflow-hidden non-draggable">
        {widget.kind === "chart" && (
          <div className="w-full h-full">
            <ChartWidget widget={widget} />
          </div>
        )}
        {widget.kind === "table" && (
          <div className="w-full h-full">
            <TableWidget widget={widget} />
          </div>
        )}
        {widget.kind === "card" && (
          <div className="w-full h-full">
            <CardWidget widget={widget} />
          </div>
        )}
      </div>

      {/* Remove button (non-draggable) */}
      <div className="p-2 border-t dark:border-slate-700 flex justify-end non-draggable">
        <button
          onClick={() => remove(widget.id)}
          className="text-red-500 text-xs"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
