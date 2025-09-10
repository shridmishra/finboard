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
    // for dynamic routes: /api/finnhub/{symbol}
    url = new URL(`${BASE_URLS[source]}/${pathOrParams}`, window.location.origin);
  } else {
    // for query params: /api/alphaVantage?symbol=...
    url = new URL(BASE_URLS[source], window.location.origin);
    Object.entries(pathOrParams).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
  }

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
