// src/hooks/useQuote.ts
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => apiFetch("finnhub", { symbol }),
    refetchInterval: 30000, // auto-refresh every 30s
  });
}
