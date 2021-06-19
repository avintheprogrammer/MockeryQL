/* eslint-disable import/prefer-default-export */

function isNotChart(result = {}) {
  return result.type !== 'chart';
}

function removeCharts(data = {}) {
  const { results = [] } = data;
  return {
    ...data,
    results: results.filter(isNotChart),
  };
}

function addSearchTag(data = {}) {
  const { tags } = data || {};
  return { ...data, tags };
}

/**
 * Fetches asset list from CAPI
 * @param {string} args.q
 * @param {number} options.page
 * @param {number} options.pageSize
 * @param {number} options.partner
 * @param {number} options.contentType
 * @param {number} options.subType
 * @param {number} options.dateType
 * @param {number} options.timePeriod
 * @param {number} options.timeUnit
 * @param {number} options.fromDate
 * @param {number} options.toDate
 * @param {number} options.author
 * @param {number} options.source
 * @param {number} options.usageRule
 * @param {number} options.section
 * @param {number} options.secondarySection
 * @param {number} options.tag
 * @param {number} options.state
 * @param {number} options.sortBy
 * @param {number} options.asc
 * @param {number} options.index
 * @returns {object}
 */
async function find({ q = '*' }, options = {}, { capi }) {
  const { page = 1, pageSize = 20, searchEngine = 2, partner = 'pql01' } = options;
  const qs = { ...options, searchEngine, page, pageSize, q, partner };
  const searchResult = await capi.find({ q }, { qs });
  return addSearchTag(removeCharts(searchResult));
}

export function createStore({ capi }) {
  return {
    find: (args, options) => find(args, options, { capi }),
  };
}
