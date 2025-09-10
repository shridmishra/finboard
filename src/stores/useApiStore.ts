import { create } from "zustand";
import { apiFetch } from "@/lib/api";

type CacheKey = string; // "finnhub:symbol=AAPL"
type ApiCache = Record<CacheKey, unknown>;

type ApiState = {
  cache: ApiCache;
  loading: boolean;
  error: string | null;
  fetchData: (source: "finnhub" | "alpha", params: Record<string, string>) => Promise<unknown>;
};

function makeCacheKey(source: string, params: Record<string, string>): CacheKey {
  return `${source}:${Object.entries(params)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("&")}`;
}

export const useApiStore = create<ApiState>((set, get) => ({
  cache: {},
  loading: false,
  error: null,

  fetchData: async (source, params) => {
    const key = makeCacheKey(source, params);
    const { cache } = get();

    // Return cached result if exists
    if (cache[key]) return cache[key];

    set({ loading: true, error: null });
    try {
      const result = await apiFetch(source, params);
      set((state) => ({
        cache: { ...state.cache, [key]: result },
        loading: false,
      }));
      return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));
