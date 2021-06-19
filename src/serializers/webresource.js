export default function serialize(asset = {}) {
  const { type, headline, webResource = {} } = asset;

  const {
    webResourceAttributeUrl: href,
  } = webResource;

  return {
    type,
    href,
    headline,
  };
}
