import { render } from '../mocks/company.json';

export default function serialize(asset = {}) {
  const {
    type,
    slug: headline,
    name: title,
    url,
    tickerSymbol,
    issuerId: tickerIssueID,
    symbol,
  } = asset;

  return {
    type,
    headline,
    title,
    url,
    tickerSymbol,
    tickerIssueID,
    symbol,
    render,
  };
}
