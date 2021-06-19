
export default function serialize(asset = {}) {
  const {
    id,
    type,
    headline,
    name: title,
    url,
    show,
    description,
    thumbnail,
    duration,
    uploadDate,
    autoPlay,
  } = asset;

  return {
    id: Number(id),
    type,
    headline,
    title,
    url,
    show,
    description,
    thumbnail,
    duration,
    uploadDate,
    autoPlay,
  };
}
