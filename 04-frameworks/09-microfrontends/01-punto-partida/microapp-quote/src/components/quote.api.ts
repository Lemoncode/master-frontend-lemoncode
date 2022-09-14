export interface QuoteResponse {
  content: string;
  author: string;
}

export const getQuote = (): Promise<QuoteResponse> =>
  fetch("https://api.quotable.io/random").then(result => result.json());
