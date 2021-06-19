/* eslint-disable import/prefer-default-export */
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';
import { isEmptyObject } from '../lib/object';
import { resolveQuoteData } from '../helpers/quote';
import { generateURL } from '../helpers/mostPopular';
import quotesSerializer from '../serializers/quotes';
import { quoteApiUrl } from '../config/quote.json';

async function find(args = {}, { networkClient }) {
  try {
    const limit = args.count;
    // adding buffer of getting more tickers to filter out the bad data
    const EXTRA_TICKERS = 5;
    args.count += EXTRA_TICKERS;   // eslint-disable-line
    const url = generateURL(args);
    // Parsely API call
    const parselyResponse = await networkClient.load({ url });
    if (isEmptyObject(parselyResponse)) return [];

    // getting the quote symbols out of Parsely response
    const quoteData = (parselyResponse.data)
      ? resolveQuoteData(parselyResponse.data)
      : [];
    if (!quoteData.length) return [];
    const quoteSymbols = quoteData.map((quote) => quote[0]);
    const qs = { requestMethod: 'itv', output: 'json', symbols: quoteSymbols.join('|') };

    // quote API call
    const quoteResponse = await networkClient.load({ url: quoteApiUrl, qs }) || [];
    if (!quoteResponse
      || !quoteResponse.ITVQuoteResult
      || !quoteResponse.ITVQuoteResult.ITVQuote) return [];

    let { ITVQuoteResult: { ITVQuote: data } } = quoteResponse;
    // we always need to provide the iterable object
    data = Array.isArray(data) ? data : [data];

    return quotesSerializer(data, new Map(quoteData), limit);
  } catch (error) {
    Logger.error('Failed to fetch quotes.', {
      error: error.message,
    });

    return null;
  }
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    find: args => find(args, { networkClient }),
  };
}
