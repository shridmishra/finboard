
// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// import {
//   adaptAlphaVantage,
//   adaptFinnhub,
//   adaptCoinbase,
//   NormalizedQuote,
//   NormalizedListItem,
// } from '@/lib/apiAdapter';
// import {
//   AlphaTimeSeriesResponse,
//   AlphaQuoteResponse,
//   FinnhubCandleResponse,
//   FinnhubQuoteResponse,
//   CoinbasePriceResponse,
//   CoinbaseTransactionResponse,
// } from '@/types/apiResponses';

// const ALPHA_BASE = 'https://www.alphavantage.co/query';
// const FINNHUB_BASE = 'https://finnhub.io/api/v1';
// const COINBASE_BASE = 'https://api.coinbase.com/v2';

// const alphaKey = process.env.ALPHA_VANTAGE_KEY;
// const finnhubKey = process.env.FINNHUB_KEY;
// const coinbaseKey = process.env.COINBASE_API_KEY;

// export async function POST(req: NextRequest) {
//   try {
//     const { provider, params, url } = await req.json();

//     let fetchUrl = '';
//     const headers: { Authorization?: string } = {}; // Initialize with optional Authorization

//     if (provider === 'alpha' && alphaKey) {
//       fetchUrl = `${ALPHA_BASE}?${new URLSearchParams({ ...params, apikey: alphaKey })}`;
//     } else if (provider === 'finnhub' && finnhubKey) {
//       fetchUrl = `${FINNHUB_BASE}/${params.endpoint}?${new URLSearchParams({ ...params.query, token: finnhubKey })}`;
//     } else if (provider === 'coinbase' && coinbaseKey) {
//       fetchUrl = `${COINBASE_BASE}/${params.endpoint}`;
//       if (params.path) fetchUrl += params.path;
//       headers.Authorization = `Bearer ${coinbaseKey}`; // Set Authorization only for Coinbase
//     } else if (provider === 'custom' && url) {
//       fetchUrl = url;
//     } else {
//       return NextResponse.json({ error: 'Invalid provider or missing key' }, { status: 400 });
//     }

//     const response = await axios.get(fetchUrl, { headers });
//     const data: AlphaTimeSeriesResponse | AlphaQuoteResponse | FinnhubCandleResponse | FinnhubQuoteResponse | CoinbasePriceResponse | CoinbaseTransactionResponse = response.data;

//     let normalized: NormalizedQuote | NormalizedListItem[] | null = null;
//     if (provider === 'alpha') {
//       normalized = adaptAlphaVantage(data as AlphaTimeSeriesResponse | AlphaQuoteResponse, params.function || '');
//     } else if (provider === 'finnhub') {
//       normalized = adaptFinnhub(data as FinnhubCandleResponse | FinnhubQuoteResponse, params.endpoint || '');
//     } else if (provider === 'coinbase') {
//       normalized = adaptCoinbase(data as CoinbasePriceResponse | CoinbaseTransactionResponse, params.endpoint || '');
//     }

//     if (!normalized) {
//       throw new Error('Failed to normalize data');
//     }

//     return NextResponse.json({ data: normalized });
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     if (error.response?.status === 429) {
//       return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
//     }
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

export {};