// NOTE: This is a mock serializer and will be deleted when CAPI implements
// the `url` attribute for the company embedded asset type
function companySerializer(asset) {
  const {
    id,
    branding: brand,
    type,
    slug: headline,
    name: title,
    section,
  } = asset;

  return {
    id,
    type,
    headline,
    title,
    section: {
      subType: (section || {}).subType,
    },
    brand,
    href: `/quotes/?symbol=${asset.symbol}`, // eslint-disable-line
  };
}

function webResourceSerializer(asset) {
  const {
    webResourceAttributeTarget: target,
    webResourceAttributeRel: rel,
    webResourceAttributeId: id,
    webResourceAttributeClass: className,
    webResourceAttributeUrl: href,
  } = asset.webResource;

  return {
    target,
    rel,
    id,
    className,
    href,
  };
}

function genericSerializer(asset) {
  const {
    url: href = '#',
    type,
    branding: brand,
    section,
  } = asset;

  return {
    href,
    type,
    brand,
    section: {
      subType: (section || {}).subType,
    },
  };
}

export default function serialize(asset = {}) {
  switch (asset.type) {
    case 'company':
      return companySerializer(asset);
    case 'webresource':
      return webResourceSerializer(asset);
    default:
      return genericSerializer(asset);
  }
}
