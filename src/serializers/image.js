export default function serialize(asset = {}) {
  const {
    id,
    type,
    creatorOverwrite,
    slug: headline,
    name: title,
    datePublished,
    caption,
    copyrightHolder,
    width,
    height,
    url,
  } = asset;

  return {
    id,
    type,
    creatorOverwrite,
    headline,
    title,
    url,
    datePublished,
    caption,
    copyrightHolder,
    width,
    height,
  };
}
