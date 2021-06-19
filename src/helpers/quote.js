/* eslint-disable import/prefer-default-export */
import urlDetails from '../lib/urlDetails';

export function resolveQuoteData(data = []) {
  const quotes = data
    .map(({ url }) => urlDetails({ url }))
    .reduce((resolved, item) => {
      const { url, path } = item;
      const symbol = path.split('=').splice(1)[0].toUpperCase();
      resolved.push([ symbol, url ]);
      return resolved;
    }, []);
  return quotes;
}
