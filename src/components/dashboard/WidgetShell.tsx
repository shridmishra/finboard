"use client";
import { WidgetConfig } from "@/types/widget";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function WidgetShell({ widget }: { widget: WidgetConfig }) {
  const remove = useDashboardStore((s) => s.removeWidget);

  return (
    <div className="border rounded-lg p-3 bg-white shadow dark:bg-slate-800">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{widget.title}</h3>
        <button
          onClick={() => remove(widget.id)}
          className="text-red-500 text-sm"
        >
          Remove
        </button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {widget.kind} widget content here.
      </div>
    </div>
  );
}
