/* eslint-disable import/prefer-default-export, radix */
import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';
import { isEmptyObject } from '../lib/object';
import { sanitize } from '../helpers/capi';
import Cache from '../lib/caching/Cache';
import CacheSources from '../lib/caching/cacheSources';

const { CAPI_HOST, CACHING_CAPI_HARD_TTL, CACHING_CAPI_SOFT_TTL } = globalAppConfig.getProperties();

let requestToken = 0;

/**
 * Generates final CAPI request URL
 * @todo: lets try to refactor this
 * @param {number} args.id
 * @param {number} args.listId
 * @param {string} args.q
 * @param {string} args.url
 * @param {string} args.path
 * @returns {string}
 */
function generateURL({ id, listId, url, path, q } = {}) {
  if (id) return `${CAPI_HOST}/id/${id}`;

  if (listId) return `${CAPI_HOST}/list/id/${listId}`;

  if (q) return `${CAPI_HOST}/search`;

  if (url) return `${CAPI_HOST}/url/${encodeURIComponent(url)}`;

  if (path) return `${CAPI_HOST}${path}`;

  throw new Error('Must provide a valid CAPI parameter');
}

/**
 * Cleans up the query string object by removing properties with undefined or null values
 * @param {object} args.options
 * @returns {object}
 */
function getCleanQueryString(options = {}) {
  const { qs = {} } = options;

  return Object.entries(qs).reduce((resolved, item) => {
    const [key, value] = item;

    if (!value || value === 0) {
      return resolved;
    }
    resolved[key] = value; // eslint-disable-line
    return resolved;
  }, {});
}

/**
 * Get the parameters required to be added for pcmpreview and webpreview calls
 * https://nbcnewsdigital.atlassian.net/wiki/spaces/CNBCREDESIGN/pages/361857076/Site+Preview
 * @param {string} args.listId
 * @param {string} args.mode
 * @returns {object}
 */
function getPreviewParams({ listId }, { qs = {} }) {
  if (!listId) return {};
  const { mode = '' } = qs;
  const params = {};
  if (mode !== '') params.index = 'current';
  if (mode === 'pcmpreview') {
    params.itemState = 'publish';
    params.cddebug = 1;
  }
  return params;
}

/**
 * Called by the cache object if cache data is not found
 * @param {object} params
 * @returns {object}
 */
async function processRequest(params = []) {
  const url = params.requestUrl;
  try {
    const capiResp = sanitize(await params.networkClient.load({ url }) || {});
    requestToken = (requestToken + 1) % 100; // rotate every 100 requests

    // TODO: Add debug response summary
    Logger.info({
      component: 'CAPI',
      requestToken,
      url,
      args: params.qs,
      capiResp,
    });

    if (isEmptyObject(capiResp)) throw new Error('Invalid ID');

    if (Array.isArray(capiResp)) return capiResp;

    return { ...capiResp, appliedQS: params.qs, sourceQuery: url };
  } catch (error) {
    Logger.error('Failed to fetch from content API.', {
      component: 'CAPI',
      args: params.qs,
      error: error.message,
    });

    throw error;
  }
}

/**
 * Provides single interface to CAPI
 * @param {object} args
 * @param {object} options.qs
 * @returns {object}
 */
async function find(args = {}, options = {}, { networkClient }) {
  const url = generateURL(args);
  const previewQS = getPreviewParams(args, options);
  const qs = { ...getCleanQueryString(options), ...previewQS, partner: 'pql01' };
  const requestUrl = networkClient.generateUrl(url, qs);
  const key = requestUrl.split(' ').join('_');
  const callbackParams = { requestUrl, qs, args, networkClient };
  const cacheObj = Cache.getInstance(CacheSources.memcache);
  // caching
  return cacheObj.getAndSet(
    decodeURIComponent(key),
    CACHING_CAPI_HARD_TTL,
    CACHING_CAPI_SOFT_TTL,
    processRequest,
    callbackParams,
  ).then((data) => data) // return the cached data
   .catch((error) => {
    Logger.error('Caching failed.', {
      component: 'CAPI',
      args,
      error: error.message,
    });
    // return the non-cached data
    return processRequest(callbackParams);
  });
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    find: (args, options) => find(args, options, { networkClient }),
  };
}
