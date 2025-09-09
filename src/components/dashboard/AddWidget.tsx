"use client";

import { useDashboardStore } from "@/stores/dashboardStore";
import { useState } from "react";

export default function AddWidget() {
  const addWidget = useDashboardStore((s) => s.addWidget);
  const [open, setOpen] = useState(false);

  const handleAdd = (kind: "chart" | "table" | "card") => {
    addWidget(kind);
    setOpen(false);
  };

  return (
    <div className="border-2 border-dashed  border-gray-400 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition max-w-2xl"
      onClick={() => setOpen(true)}
    >
      <span className="text-4xl font-bold text-gray-500 dark:text-gray-400">＋</span>
      <span className="text-sm mt-2 text-gray-600 dark:text-gray-400">
        Add Widget
      </span>

      {open && (
        <div
          className="absolute mt-2 p-3  bg-white dark:bg-gray-900 border rounded-lg shadow-lg flex gap-2 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
            onClick={() => handleAdd("chart")}
          >
            Chart
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleAdd("table")}
          >
            Table
          </button>
          <button
            className="px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600"
            onClick={() => handleAdd("card")}
          >
            Card
          </button>
        </div>
      )}
    </div>
  );
}
