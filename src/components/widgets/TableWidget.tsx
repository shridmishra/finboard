"use client";

import { WidgetConfig } from "@/types/widget";
import { useState } from "react";

type Props = { widget: WidgetConfig };

const mockRows = [
  { symbol: "AAPL", price: 189.12, change: "+1.2%" },
  { symbol: "GOOGL", price: 2830.54, change: "-0.5%" },
  { symbol: "MSFT", price: 312.78, change: "+0.8%" },
  { symbol: "AMZN", price: 134.11, change: "-0.2%" },
  { symbol: "TSLA", price: 722.15, change: "+2.4%" },
  { symbol: "NFLX", price: 402.67, change: "-1.0%" },
];

export default function TableWidget({ widget }: Props) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 3;

  const start = page * rowsPerPage;
  const pageRows = mockRows.slice(start, start + rowsPerPage);
  const totalPages = Math.ceil(mockRows.length / rowsPerPage);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Scrollable table area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <thead className="sticky top-0 bg-background text-xs">
            <tr className="border-b">
              <th className="p-1 sm:p-2">Symbol</th>
              <th className="p-1 sm:p-2">Price</th>
              <th className="p-1 sm:p-2">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.symbol} className="border-b last:border-0">
                <td className="p-1 sm:p-2 font-medium">{row.symbol}</td>
                <td className="p-1 sm:p-2">${row.price}</td>
                <td
                  className={`p-1 sm:p-2 ${
                    row.change.startsWith("-")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination pinned to bottom */}
      <div className="flex justify-between items-center mt-1 sm:mt-2 pt-1 sm:pt-2 text-xs border-t">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span>
          {page + 1}/{totalPages}
        </span>
        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          className="px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
