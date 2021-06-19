/* eslint-disable import/prefer-default-export */
import assetListSerializer from '../serializers/assetList';

/**
 * Fetches asset list from CAPI
 * @param {number} args.id
 * @param {number} options.page
 * @param {number} options.pageSize
 * @param {number} options.offset
 * @param {Array.<object>} options.include
 * @returns {object}
 */
async function find({ id: listId }, options = {}, { capi }) {
  if (!listId) return [];

  const {
    page = 1,
    pageSize = 20,
    offset = 0,
    promoted,
    include = [],
    exclude = [],
    excludeContentClassification = [],
    filter = {},
    mode,
  } = options;

  const qs = {
    page,
    pageSize,
    offset,
    promoted,
    includeAssetType: !exclude.length ? include.join(',') : null,
    excludeAssetType: exclude.join(','),
    excludeContentClassification,
    mode,
  };

  // Serialize response
  const assetList = await capi.find({ listId }, { qs });
  return assetListSerializer(assetList, { assetTypes: include, filter });
}

export function createStore({ capi }) {
  return {
    find: (args, options) => find(args, options, { capi }),
  };
}
