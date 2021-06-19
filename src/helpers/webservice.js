/* eslint-disable import/prefer-default-export */

/**
 * Returns an object of webservice parameters
 * @param {Object} parameters
 * @returns {Object}
 */
export function resolveParameters(parameters = {}) {
  const { parameter: params = [] } = parameters;
  const pattern = /^\W+|\s+$/g;
  return params.reduce((resolved, item = '') => {
    const [key, value] = item.replace(pattern, '').split('::');
    resolved[key] = value; // eslint-disable-line
    return resolved;
  }, {});
}
