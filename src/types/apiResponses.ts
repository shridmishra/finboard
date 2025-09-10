export interface AlphaTimeSeriesResponse {
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

export interface AlphaQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export interface FinnhubCandleResponse {
  c: number[]; // Close prices
  h: number[]; // High prices
  l: number[]; // Low prices
  o: number[]; // Open prices
  t: number[]; // Timestamps (Unix)
  v: number[]; // Volume
}

export interface FinnhubQuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Change percent
}

export interface CoinbasePriceResponse {
  data: {
    amount: string;
    currency: string;
  };
}

export interface CoinbaseTransactionResponse {
  data: Array<{
    amount: {
      amount: string;
      currency: string;
    };
    created_at: string;
    type: string;
  }>;
}