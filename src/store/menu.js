/* eslint-disable no-param-reassign, import/prefer-default-export, radix */
import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';
import urlDetails from '../lib/urlDetails';
import Cache from '../lib/caching/Cache';
import CacheSources from '../lib/caching/cacheSources';

const { PCM_HOST, CACHING_PCM_HARD_TTL, CACHING_PCM_SOFT_TTL } = globalAppConfig.getProperties();

/**
 * Adds attributes to dynamic menu schema
 * @param {object} args.item
 * @param {object} args.attr
 * @returns {object}
 */

function toDynamicMenuItem({ item, attr }) {
  const {
    name,
    type,
    label,
    host,
    path,
    endDate,
    timezone,
    registrationDeadlineDate,
    status,
    capacity,
    phone,
    location,
    startDate,
    email,
    items = [],
  } = item;

  const eventFields = (type === 'event')
    ? {
      endDate,
      timezone,
      registrationDeadlineDate,
      status,
      capacity,
      phone,
      location,
      startDate,
      email,
    }
    : {};

  return {
    name,
    label,
    host,
    path,
    ...eventFields,
    attr: items.length
      ? attr.parent
      : attr.child,
    items: items.map(o => toDynamicMenuItem({ item: o, attr })),
  };
}

/**
 * Converts CAPI response item to the PCM menu schema
 * @param {object} item
 * @returns {object}
 */
function toMenuItemConfig(item = {}) {
  const {
    name,
    title: label,
    listItem: items = [],
    eventStartDate: startDate,
    eventEndDate: endDate,
    eventTimezone: timezone,
    eventRegistrationDeadlineDate: registrationDeadlineDate,
    eventStatus: status,
    eventCapacity: capacity,
    eventPhone: phone,
    eventEmail: email,
    eventLocation: location,
    id,
    type,
    url,
    eventLandingPage,
  } = item;

  return {
    ...urlDetails({ url: eventLandingPage || url }),
    name,
    label,
    startDate,
    endDate,
    timezone,
    registrationDeadlineDate,
    status,
    capacity,
    phone,
    email,
    location,
    items: items.map(toMenuItemConfig),
    type, // no way to really determine dynamic types from CAPI!?
    source: { id },
  };
}

/**
 * Converts resolved menu item config to a consistent format for clients
 * @param {object} item
 * @returns {object}
 */
function toMenuItem(item = {}) {
  const {
    name,
    label,
    host,
    path,
    attr,
    items = [],
  } = item;


  return {
    name,
    label,
    host,
    path,
    attr,
    items: items.map(toMenuItem),
  };
}

/**
 * Fetches dynamic menu item from source (currently supports CAPI only)
 * @param {number} id
 * @param {object} source
 * @returns {object}
 */
async function fetchMenuItem(id, source = {}, { capi }) {
  try {
    const { name = 'CAPI', path = '/list/id/' } = source;

    if (name !== 'CAPI') throw new Error(`Invalid menu item source: ${source}`);

    return toMenuItemConfig(await capi.find({ path: `${path}${id}` }, { qs: { promoted: 'true' } }));
  } catch (error) {
    Logger.error({
      msg: 'Failed to fetch menu item from CAPI',
      args: { id, source },
      err: error.message,
    });
    return {};
  }
}

/**
 * Fetches menu config from PCM
 * @param {object} params
 * @returns {object}
 */
function fetchMenuConfig(params = {}) {
  try {
    return params.networkClient.load({ url: params.requestUrl });
  } catch (error) {
    Logger.error({
      msg: 'Failed to fetch menu config from PCM',
      url: params.requestUrl,
      err: error.message,
    });
    return {};
  }
}

/**
 * “Rescursively” resolves dynamic menu items (to be appended to static menu)
 * @param {Array.<object>} items
 * @param {number} level
 * @returns {Array.<object>}
 */
function resolveDynamicMenuItems(items = [], level = 1, { capi }) {
  return items.reduce(async (resolved, item) => {
    resolved = await resolved;
    if (!item) return resolved;

    // Ideally we would probably like for this to be a true recursive function
    // that could scale to 'n' number of dynamic children but the CAPI response
    // schema doesn't really provide any kind of indicator as to when the children
    // should start/stop being resolved; hence the explicit 'level'. For now, we
    // will just control the flow...
    const { source = {}, id } = item;
    const menuItems = level < 3
      ? (await fetchMenuItem(id || source.id, source, { capi })).items
      : [];

    // Note: Top level resolution is different than children: The initial top level
    // element is discarded and its children become the new top level entities.
    if (level === 1) return resolveDynamicMenuItems(menuItems, 2, { capi });
    if (level === 2) item.items = await resolveDynamicMenuItems(menuItems, 3, { capi });
    if (level > 3) Logger.warn('cannot resolve CAPI responses more than 3 layers deep.');

    resolved.push(item);
    return resolved;
  }, []);
}

/**
 * Recursively resolves & normalizes menu config response
 * @param {Array.<object>} items
 * @returns {Array.<object>}
 */
function resolveMenuItems(items = [], { capi }) {
  return items.reduce(async (resolved, item) => {
    resolved = await resolved;
    if (!item) return resolved;

    const { items: children = [], name, attr = {} } = item;

    if (name === 'dynamic') {
      const fetchedItems = await resolveDynamicMenuItems([item], 1, { capi }) || [];
      const dynamicMenuItems = fetchedItems.map(fetchedItem => (
        toDynamicMenuItem({ item: fetchedItem, attr })
      ));

      resolved.push(...dynamicMenuItems);
      return resolved;
    }

    if (children.length) item.items = await resolveMenuItems(children, { capi });

    resolved.push(toMenuItem(item));
    return resolved;
  }, []);
}

/**
 * Returns a single array of all top level parent/child (i.e placement/component) key pairs
 * e.g. [[header, main], [header, expanded]])
 * @param {object} response
 * @returns {string[][]} (e.g. [[header, main], [header, expanded]])
 */
function resolveTopLevelKeyPairs(response) {
  return Object.keys(response).reduce((resolved, parent) => {
    resolved.push(...Object.keys(response[parent]).map(child => [parent, child]));
    return resolved;
  }, []);
}

/**
 * Returns the menu resolved from both PCM and CAPI
 * @see: It is our hope that this won't be a permanent solution and the CMS
 * team will support managing the menu in a single place.
 * @param {string} args.brand
 * @param {string} args.product
 * @returns {object}
 */
async function find({ brand, product = 'web', region = 'USA' }, { capi, networkClient }) {
  const requestUrl = `${PCM_HOST}/menu/${brand}/${product}?region=${region}&partner=pql01`;
  const key = requestUrl.split(' ').join('_');
  const callbackParams = { requestUrl, networkClient };
  const cacheObj = Cache.getInstance(CacheSources.memcache);
  // caching
  const response = await cacheObj.getAndSet(
    decodeURIComponent(key),
    CACHING_PCM_HARD_TTL,
    CACHING_PCM_SOFT_TTL,
    fetchMenuConfig,
    callbackParams,
  ).then((data) => data) // return the cached data
   .catch((error) => {
    Logger.error('Caching failed.', {
      component: 'Menu',
      error: error.message,
    });
    // return the non-cached data
    return fetchMenuConfig(callbackParams);
  });

  return resolveTopLevelKeyPairs(response).reduce(async (config, current) => {
    const [placement, component] = current;
    const items = response[placement][component];

    config = await config;
    if (!items) return config;

    config[placement][component] = items.length
      ? await resolveMenuItems(items, { capi })
      : items;

    return config;
  }, { header: {}, footer: {}, currentBrand: brand });
}

export function createStore({ capi }) {
  const networkClient = new NetworkRequest();
  return {
    find: args => find(args, { capi, networkClient }),
  };
}
