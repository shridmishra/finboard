const BASE_URLS = {
  finnhub: "/api/finnhub",
  alpha: "/api/alphaVantage",
};

export async function apiFetch(
  source: keyof typeof BASE_URLS,
  pathOrParams: string | Record<string, string>
) {
  let url: URL;

  if (typeof pathOrParams === "string") {
    // Dynamic route: /api/finnhub/{symbol}
    url = new URL(`${BASE_URLS[source]}/${pathOrParams}`, window.location.origin);
  } else {
    // Query params: /api/alphaVantage?symbol=...
    url = new URL(BASE_URLS[source], window.location.origin);
    Object.entries(pathOrParams).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  try {
    const res = await fetch(url.toString());
    if (!res.ok) {
      const errData = await res.text();
      throw new Error(`API error: ${res.status} - ${errData}`);
    }
    return await res.json();
  } catch (err) {
    console.error("API fetch failed:", err);
    throw err;
  }
}
