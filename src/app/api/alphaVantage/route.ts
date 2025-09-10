import { NextResponse } from "next/server";

const ALPHA_API = "https://www.alphavantage.co/query";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const functionType = searchParams.get("function") ?? "TIME_SERIES_DAILY";
  const symbol = searchParams.get("symbol") ?? "AAPL";

  const res = await fetch(
    `${ALPHA_API}?function=${functionType}&symbol=${symbol}&apikey=${process.env.ALPHA_KEY}`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch Alpha Vantage" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
