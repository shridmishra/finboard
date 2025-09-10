"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";

type WidgetConfig = { symbol?: string; refreshIntervalSecs?: number };
type Quote = { c: number; pc: number };

const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA", "NFLX"];
const rowsPerPage = 8;

async function fetchQuote(symbol: string): Promise<Quote> {
  const res = await fetch(`/api/finnhub?symbol=${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export default function TableWidget({ widget }: { widget: WidgetConfig }) {
  const [page, setPage] = useState(0);
  const refreshInterval = (widget.refreshIntervalSecs ?? 60) * 1000;

  // Use React Query to fetch all quotes in parallel
  const queries = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["quote", symbol],
      queryFn: () => fetchQuote(symbol),
      refetchInterval: refreshInterval,
      staleTime: refreshInterval / 2,
    })),
  });

  const pageRows = symbols.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(symbols.length / rowsPerPage);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-gray-800 text-text">
     
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-white dark:bg-gray-700">
            <tr className="border-b border-gray-700">
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Change</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((sym, i) => {
              const query = queries[i]; // use index instead of queryKey
              const quote = query.data as Quote | undefined;

              if (!quote || query.isLoading) {
                return (
                  <tr key={sym} className="border-b border-gray-700 last:border-0">
                    <td className="p-2 font-medium">{sym}</td>
                    <td className="p-2">Loading…</td>
                    <td className="p-2 text-gray-500">––</td>
                  </tr>
                );
              }

              const change = ((quote.c - quote.pc) / quote.pc) * 100;
              const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
              const changeClass = change < 0 ? "text-red-500" : "text-green-600";

              return (
                <tr key={sym} className="border-b border-gray-700 last:border-0">
                  <td className="p-2 font-medium">{sym}</td>
                  <td className="p-2">${quote.c.toFixed(2)}</td>
                  <td className={`p-2 ${changeClass}`}>{changeText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 text-xs border-t border-gray-700">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="px-2 py-1 bg-background rounded disabled:opacity-40"
        >
          Prev
        </button>
        <span>{page + 1}/{totalPages}</span>
        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          className="px-2 py-1 bg-gray-700 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
     
    </div>
  );
}