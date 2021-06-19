/* eslint-disable import/prefer-default-export */

/**
 * Removes "cn:__", "cn:", "@" & null values from asset attributes
 * @param {Object} asset
 * @returns {Object}
 */
export function sanitize(asset) {
  if (typeof asset !== 'object') return asset;

  return Object.entries(asset).reduce((resolved, item) => {
    let [key, value] = item;

    if (!value && (value !== 0)) return resolved;

    if (value === 'null') return resolved; // needs to be fixed on CAPIs end

    // WARNING: if you remove this, there's no guarantee
    // the `type` value will be resolved using `cn:type` instead of `@type`
    if (['@type', '@context'].includes(key)) return resolved;

    if (Array.isArray(value)) value = value.map(sanitize);

    if (typeof value === 'object') value = sanitize(value);

    const pattern = /^(cn:__|cn:|@|_)/;
    if (key.match(pattern)) key = key.replace(pattern, '');

    resolved[key] = value; // eslint-disable-line
    return resolved;
  }, Array.isArray(asset) ? [] : {});
}
