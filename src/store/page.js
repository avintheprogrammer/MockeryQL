/*
  eslint-disable
  import/prefer-default-export,
  arrow-body-style,
  consistent-return,
  no-param-reassign,
  radix
*/
import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';
import { removeSpaces } from '../lib/string';
import Cache from '../lib/caching/Cache';
import CacheSources from '../lib/caching/cacheSources';

import RequestError from '../lib/error/RequestError';

const { PCM_HOST, CACHING_PCM_HARD_TTL, CACHING_PCM_SOFT_TTL } = globalAppConfig.getProperties();

let requestToken = 0;

/**
 * Fetches page config from PCM
 * @param {object} params
 * @returns {object}
 */
function fetchConfig(params = {}) {
  try {
    return params.networkClient.load({ url: params.requestUrl });
  } catch (error) {
    Logger.error({
      msg: 'Failed to fetch page config from PCM',
      args: params.url,
      err: error.message,
    });

    throw error;
  }
}

/**
 * Fetches page asset from CAPI
 * @see: the host prefix is temporary until CAPI supports path requests
 * @param {string} args.id
 * @param {string} args.path
 * @param {string} args.brand
 * @returns {object}
 */
async function fetchInfo({ id, path = '' }, { capi }) {
  try {
    let info;
    requestToken = (requestToken + 1) % 100; // rotate every 100 requests

    const p = path.split('/');
    id = (p.length > 1 && p[1] === 'id') ? p.pop() : id; // eslint-disable-line

    if (id) { // find by id
      info = await capi.find({ id });
      Logger.info({ component: 'PAGE', requestToken, id, info });
    } else { // find by path
      info = await capi.find({ url: path });
      Logger.info({ component: 'PAGE', requestToken, path, info });
    }

    return info;
  } catch (error) {
    Logger.error({
      msg: 'Failed to fetch page info from CAPI',
      args: { id, path },
      err: error.message,
    });

    throw error;
  }
}

/**
 * Returns the resolved page from both PCM and CAPI
 * @param {string} args.id
 * @param {string} args.path
 * @returns {object}
 */
async function find({ id, path, product = 'web', mode = '', templateVariant = 0 } = [], stores) {
  try {
    // fetch page info
    const pageInfo = await fetchInfo({ id, path }, stores);
    if (!pageInfo) return;

    // fetch page config
    const {
      id: pageID,
      type: assetType,
      branding: brand = 'cnbc',
      subType: assetSubType,
      section: { id: sectionId = '', subType: sectionSubType } = {},
    } = pageInfo;

    const pcmParams = {
      product,
      brand: removeSpaces(brand).toLowerCase(),
      assetType,
      assetSubType,
      sectionSubType,
      sectionId,
      nodeId: pageID,
      mode,
      partner: 'pql01',
      templateVariant,
    };

    const { networkClient } = stores;
    const pcmRoute = (mode === 'pcmpreview') ? 'preview' : 'page';
    const requestUrl = networkClient.generateUrl(`${PCM_HOST}/${pcmRoute}`, pcmParams);
    const key = requestUrl.split(' ').join('_');
    const callbackParams = { requestUrl, args: { id: pageID }, networkClient };
    const cacheObj = Cache.getInstance(CacheSources.memcache);
    // caching
    const pageConfig = await cacheObj.getAndSet(
      decodeURIComponent(key),
      CACHING_PCM_HARD_TTL,
      CACHING_PCM_SOFT_TTL,
      fetchConfig,
      callbackParams,
    ).then((data) => data) // return the cached data
     .catch((error) => {
      Logger.error('Caching failed.', {
        component: 'Page',
        error: error.message,
      });
      // return the non-cached data
      return fetchConfig(callbackParams);
    });

    if (!pageConfig) return;

    return {
      ...pageInfo,
      ...pageConfig,
    };
  } catch (error) {
    Logger.error({
      msg: 'Failed to execute page request',
      args: { id, path },
      err: error.message,
    });

    throw new RequestError({
      message: 'Failed to execute page request',
      statusCode: error.statusCode || 500,
    });
  }
}

export function createStore({ capi }) {
  const networkClient = new NetworkRequest();
  return {
    find: args => find(args, { capi, networkClient }),
  };
}
