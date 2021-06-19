function toQuote(asset = {}) {
  const {
    gsx$link: link = {},
    gsx$quote: quote = {},
    gsx$label: label = {},
    gsx$date: date = {},
  } = asset;

  return {
    link: link.$t,
    quote: quote.$t,
    label: label.$t,
    date: date.$t,
  };
}

export default function serialize(asset = {}) {
  const { entry: entries = [] } = asset.feed || {};
  return entries.map(toQuote);
}
