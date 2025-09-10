import { NextResponse } from "next/server";

const FINNHUB_API = "https://finnhub.io/api/v1";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "AAPL";

  try {
    const res = await fetch(
      `${FINNHUB_API}/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Finnhub API error:", text);
      return NextResponse.json({ error: "Failed to fetch Finnhub" }, { status: 500 });
    }

    const data = await res.json();

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Empty response from Finnhub" }, { status: 500 });
    }

    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Finnhub fetch failed:", err.message);
    return NextResponse.json({ error: "Finnhub fetch failed" }, { status: 500 });
  }
}