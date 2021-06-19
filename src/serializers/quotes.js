/* eslint-disable no-param-reassign, consistent-return */

export default function serialize(quotes = [], urls = [], limit) {
  const filteredQuotes = [];
  const BAD_QUOTE_ERROR_CODE = '1';

  quotes.forEach((quote) => {
    // skip the bad data
    if (quote.code !== BAD_QUOTE_ERROR_CODE) {
      // add 'url' to each of the quote
      quote.url = urls.get(quote.symbol);
      filteredQuotes.push(quote);
    }
  });

  return {
    assets: filteredQuotes.slice(0, limit),
  };
}
