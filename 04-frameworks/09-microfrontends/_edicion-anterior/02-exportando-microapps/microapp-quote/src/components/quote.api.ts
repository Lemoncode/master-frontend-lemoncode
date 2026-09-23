export interface QuoteResponse {
  quote: string;
  author: string;
}

export const getQuote = (): Promise<QuoteResponse> =>
  fetch("https://api.gameofthronesquotes.xyz/v1/random")
    .then((result) => result.json())
    .then(({ sentence, character }) => ({ quote: sentence, author: character.name }));

/**
 * Free QUOTE Services
 * https://stoic.tekloon.net/stoic-quote => Working (stoic quotes). Response: {quote: "", author: ""}
 * https://api.breakingbadquotes.xyz/v1/quotes => Working (breaking bad only quotes). Response: [{quote: "", author: ""}]
 * https://api.gameofthronesquotes.xyz/v1/random => Working (GOT only quotes). Response: {sentence: "", character: {name: ""}}
 * https://api.quotable.io => Stopped working
 */
