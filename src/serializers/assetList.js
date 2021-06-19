/* eslint-disable arrow-body-style, consistent-return */
function meetsFilterRequirement(asset = {}, filter = {}) {
  return !Object.entries(filter).find((item) => {
    const [key, value] = item;

    if (value.notEquals) {
      if (Array.isArray(value.notEquals)) {
        const containsNonAllowedValue =
          value.notEquals.find(nonAllowedValue => asset[key] === nonAllowedValue);
        if (containsNonAllowedValue) return true;
      }

      if (asset[key] === value.notEquals) return true;
    }

    if (value.equals && asset[key] !== value.equals) return true;

    return false;
  });
}

/**
 * Serializes & filters assets
 * @param {Array.<object>} assets
 * @param {Array.<string>} assetTypes
 * @returns {Array.<object>}
 */
function resolveAssets(assets = [], { assetTypes = [], filter = {} }) {
  return assets.filter(asset => (
    assetTypes.length
      ? assetTypes.includes(asset.type) && meetsFilterRequirement(asset, filter)
      : asset
  ));
}

export default function serialize(asset, { assetTypes = [], filter } = {}) {
  if (!asset) return;
  return {
    ...asset,
    assets: resolveAssets(asset.listItem, { assetTypes, filter }),
  };
}
