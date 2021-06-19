import { render } from '../mocks/security.json';

export default function serialize(asset = {}) {
  const {
    type,
    slug: headline,
    name: title,
    url,
    symbol,
    exchangeName,
    issueId,
    datePublished,
    name,
    tickerSymbol,
  } = asset;

  return {
    type,
    headline,
    title,
    url,
    symbol,
    exchangeName,
    issueId,
    datePublished,
    name,
    tickerSymbol,
    render,
  };
}
