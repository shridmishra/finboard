import { NextResponse } from "next/server";

const ALPHA_VANTAGE_API = "https://www.alphavantage.co/query";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "AAPL";

  try {
    const res = await fetch(
      `${ALPHA_VANTAGE_API}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Alpha Vantage API error:", text);
      return NextResponse.json({ error: "Failed to fetch Alpha Vantage" }, { status: 500 });
    }

    const data = await res.json();

    if (!data["Time Series (5min)"]) {
      console.error("Invalid Alpha Vantage data:", data);
      return NextResponse.json({ error: "No data available" }, { status: 500 });
    }

    const timeSeries = data["Time Series (5min)"];
    const formattedData = Object.entries(timeSeries)
      .slice(0, 10) // Limit to 10 points for bar chart
      .map(([time, values]: [string, any]) => ({
        time: new Date(time).toISOString(),
        open: parseFloat(values["1. open"]),
        close: parseFloat(values["4. close"]),
      }))
      .reverse(); // Oldest to newest

    return NextResponse.json(formattedData);
  } catch (err: any) {
    console.error("Alpha Vantage fetch failed:", err.message);
    return NextResponse.json({ error: "Alpha Vantage fetch failed" }, { status: 500 });
  }
}