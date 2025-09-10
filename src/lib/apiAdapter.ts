// import get from 'lodash/get';
// import {
//   AlphaTimeSeriesResponse,
//   AlphaQuoteResponse,
//   FinnhubCandleResponse,
//   FinnhubQuoteResponse,
//   CoinbasePriceResponse,
//   CoinbaseTransactionResponse,
// } from '@/types/apiResponses';

// // Normalized data types
// export interface NormalizedTimeSeries {
//   date: string;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
//   volume: number;
// }

// export interface NormalizedQuote {
//   symbol: string;
//   price: number;
//   change: number;
//   changePercent: number;
// }

// export interface NormalizedListItem {
//   symbol: string;
//   name: string;
//   price: number;
//   change: number;
// }

// // Adapter functions
// export const adaptAlphaVantage = (
//   rawData: AlphaTimeSeriesResponse | AlphaQuoteResponse,
 
// ): NormalizedTimeSeries[] | NormalizedQuote => {
//   if ('Time Series (Daily)' in rawData) {
//     const series = rawData['Time Series (Daily)'];
//     return Object.entries(series).map(([date, values]) => ({
//       date,
//       open: parseFloat(values['1. open']),
//       high: parseFloat(values['2. high']),
//       low: parseFloat(values['3. low']),
//       close: parseFloat(values['4. close']),
//       volume: parseInt(values['5. volume'], 10),
//     })) as NormalizedTimeSeries[];
//   } else if ('Global Quote' in rawData) {
//     const quote = rawData['Global Quote'];
//     return {
//       symbol: quote['01. symbol'],
//       price: parseFloat(quote['05. price']),
//       change: parseFloat(quote['09. change']),
//       changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
//     } as NormalizedQuote;
//   }
//   throw new Error('Unsupported Alpha Vantage endpoint');
// };

// export const adaptFinnhub = (
//   rawData: FinnhubCandleResponse | FinnhubQuoteResponse,
//   endpoint: string
// ): NormalizedTimeSeries[] | NormalizedQuote => {
//   if ('c' in rawData && Array.isArray(rawData.c)) {
//     const { c, h, l, o, t, v } = rawData as FinnhubCandleResponse;
//     return t.map((timestamp, i) => ({
//       date: new Date(timestamp * 1000).toISOString().split('T')[0],
//       open: o[i],
//       high: h[i],
//       low: l[i],
//       close: c[i],
//       volume: v[i],
//     })) as NormalizedTimeSeries[];
//   } else if ('c' in rawData && typeof rawData.c === 'number') {
//     const quote = rawData as FinnhubQuoteResponse;
//     return {
//       symbol: 'TODO: Pass symbol', // Requires config
//       price: quote.c,
//       change: quote.d,
//       changePercent: quote.dp,
//     } as NormalizedQuote;
//   }
//   throw new Error('Unsupported Finnhub endpoint');
// };

// export const adaptCoinbase = (
//   rawData: CoinbasePriceResponse | CoinbaseTransactionResponse,
//   endpoint: string
// ): NormalizedTimeSeries | NormalizedListItem[] => {
//   if (endpoint.includes('/spot')) {
//     const data = (rawData as CoinbasePriceResponse).data;
//     return {
//       date: new Date().toISOString().split('T')[0],
//       close: parseFloat(data.amount),
//       symbol: data.currency,
//       volume: 0, // Not provided
//     } as unknown as NormalizedTimeSeries;
//   } else if (endpoint.includes('transactions')) {
//     const transactions = (rawData as CoinbaseTransactionResponse).data;
//     return transactions.map(item => ({
//       symbol: item.amount.currency,
//       name: item.type,
//       price: parseFloat(item.amount.amount),
//       change: 0, // Not available, calculate if needed
//     })) as NormalizedListItem[];
//   }
//   throw new Error('Unsupported Coinbase endpoint');
// };

// // Data mapper with type safety
// export const mapData = <T extends NormalizedTimeSeries[] | NormalizedQuote | NormalizedListItem[]>(
//   normalizedData: T,
//   selectedFields: (keyof T extends unknown[] ? keyof NormalizedTimeSeries : keyof T)[],
//   formatting: Record<string, 'currency' | 'percentage' | 'number'> = {}
// ): T extends unknown[] ? NormalizedTimeSeries[] : NormalizedQuote => {
//   const mapItem = (item: unknown): Record<string, string | number> => {
//     const mapped: Record<string, string | number> = {};
//     selectedFields.forEach(field => {
//       const value = get(item, field as string);
//       if (typeof value === 'string' && !isNaN(parseFloat(value))) {
//         mapped[field as string] = parseFloat(value);
//       } else {
//         mapped[field as string] = value as string | number;
//       }
//       if (formatting[field as string]) {
//         mapped[field as string] = formatValue(mapped[field as string], formatting[field as string]);
//       }
//     });
//     return mapped as unknown as T extends unknown[] ? NormalizedTimeSeries : NormalizedQuote;
//   };

//   if (Array.isArray(normalizedData)) {
//     return normalizedData.map(item => mapItem(item)) as unknown as NormalizedTimeSeries[];
//   } else {
//     return mapItem(normalizedData) as unknown as NormalizedQuote;
//   }
// };

// // Formatter
// const formatValue = (value: string | number, type: 'currency' | 'percentage' | 'number'): string => {
//   const numValue = typeof value === 'string' ? parseFloat(value) : value;
//   if (isNaN(numValue)) return value.toString();
//   switch (type) {
//     case 'currency':
//       return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue);
//     case 'percentage':
//       return `${numValue.toFixed(2)}%`;
//     case 'number':
//       return numValue.toLocaleString();
//     default:
//       return value.toString();
//   }
// };