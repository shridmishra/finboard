import { NextResponse } from "next/server";

const FINNHUB_API = "https://finnhub.io/api/v1";

// Define valid endpoint keys
type Endpoint = "quote" | "stock/profile2" | "stock/candle" | "stock/gainers" | "stock/metric" | "company-news";

// Define config structure for each endpoint
interface EndpointConfig {
  required: string[];
  optional: string[];
}

// Define endpoint configurations with explicit typing
const endpointConfigs: Record<Endpoint, EndpointConfig> = {
  quote: {
    required: ["symbol"],
    optional: [],
  },
  "stock/profile2": {
    required: ["symbol"],
    optional: [],
  },
  "stock/candle": {
    required: ["symbol", "resolution", "from", "to"],
    optional: [],
  },
  "stock/gainers": {
    required: [],
    optional: ["exchange"],
  },
  "stock/metric": {
    required: ["symbol", "metric"],
    optional: [],
  },
  "company-news": {
    required: ["symbol", "from", "to"],
    optional: [],
  },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const endpoint = (searchParams.get("endpoint") ?? "quote") as Endpoint;
  const symbol = searchParams.get("symbol") ?? "AAPL"; // Default for endpoints requiring symbol
  const resolution = searchParams.get("resolution"); // For /stock/candle
  const from = searchParams.get("from"); // For /stock/candle, /company-news
  const to = searchParams.get("to"); // For /stock/candle, /company-news
  const exchange = searchParams.get("exchange"); // For /stock/gainers
  const metric = searchParams.get("metric"); // For /stock/metric

  // Validate endpoint
  if (!(endpoint in endpointConfigs)) {
    return NextResponse.json({ error: `Unsupported endpoint: ${endpoint}` }, { status: 400 });
  }

  // Get config for the endpoint
  const config = endpointConfigs[endpoint];

  // Validate required parameters
  for (const param of config.required) {
    if (!searchParams.get(param)) {
      return NextResponse.json({ error: `Missing required parameter: ${param}` }, { status: 400 });
    }
  }

  // Build query string for Finnhub API
  const queryParams = new URLSearchParams();
  queryParams.append("token", process.env.FINNHUB_KEY || "");

  if (config.required.includes("symbol") || config.optional.includes("symbol")) {
    queryParams.append("symbol", symbol);
  }
  if (resolution && endpoint === "stock/candle") {
    queryParams.append("resolution", resolution);
  }
  if (from && (endpoint === "stock/candle" || endpoint === "company-news")) {
    queryParams.append("from", from);
  }
  if (to && (endpoint === "stock/candle" || endpoint === "company-news")) {
    queryParams.append("to", to);
  }
  if (exchange && endpoint === "stock/gainers") {
    queryParams.append("exchange", exchange);
  }
  if (metric && endpoint === "stock/metric") {
    queryParams.append("metric", metric);
  }

  try {
    const url = `${FINNHUB_API}/${endpoint}?${queryParams.toString()}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error(`Finnhub API error for ${endpoint}:`, text);
      return NextResponse.json({ error: `Failed to fetch Finnhub ${endpoint}` }, { status: 500 });
    }

    const data = await res.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: `Empty response from Finnhub ${endpoint}` }, { status: 500 });
    }

    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Finnhub fetch failed for ${endpoint}:`, err.message);
    return NextResponse.json({ error: `Finnhub fetch failed for ${endpoint}` }, { status: 500 });
  }
}