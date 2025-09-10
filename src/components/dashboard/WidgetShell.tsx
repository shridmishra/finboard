"use client";
import { WidgetConfig } from "@/types/types";
import { useDashboardStore } from "@/stores/dashboardStore";
import TableWidget from "../widgets/TableWidget";
import CardWidget from "../widgets/CardWidget";
import { ChartWidget } from "../widgets/ChartWidget";
import { Pencil, RefreshCcw, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function WidgetShell({ widget }: { widget: WidgetConfig }) {
  const remove = useDashboardStore((s) => s.removeWidget);
  const updateWidget = useDashboardStore((s) => s.updateWidget);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(widget.title);
  const [interval, setInterval] = useState(widget.refreshIntervalSecs ?? 60);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800 border  shadow overflow-hidden">
      {/* Header */}
      <div className="drag-handle cursor-move px-3 py-2 border-b dark:border-slate-700 bg-gray-100 dark:bg-slate-700 rounded-t-lg flex items-center justify-between">
        <h3 className="font-semibold text-sm truncate uppercase">{widget.title}</h3>

        {/* Actions */}
        <div className="flex items-center gap-2 non-draggable">
          {/* Edit Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded">
                <Pencil className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Widget</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => updateWidget(widget.id, { title })}
                  placeholder="Widget name"
                />
                <Input
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  onBlur={() =>
                    updateWidget(widget.id, { refreshIntervalSecs: interval })
                  }
                  placeholder="Refresh interval (seconds)"
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Refresh Button */}
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["stockHistory", widget.symbol],
              })
            }
            className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
          >
            <RefreshCcw className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>

          <button
          onClick={() => remove(widget.id)}
          className="text-red-500 text-xs md:text-sm transition-colors duration-200 p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded"
        >
          <Trash2 className="h-4 w-4" />
        </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 h-full min-h-[150px]">
        {widget.kind === "chart" && (
          <div className="w-full h-full p-2 md:p-4">
            <ChartWidget widget={{ ...widget }} />
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

     

    </div>
  );
}
