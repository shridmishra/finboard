import { NextResponse } from "next/server";

const FINNHUB_API = "https://finnhub.io/api/v1";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") ?? "AAPL";

  const res = await fetch(
    `${FINNHUB_API}/quote?symbol=${symbol}&token=${process.env.FINNHUB_KEY}`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch Finnhub" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
