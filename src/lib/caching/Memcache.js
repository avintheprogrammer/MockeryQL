/* eslint-disable arrow-body-style, class-methods-use-this,
  consistent-return, radix, no-else-return */
import Memcached from 'memcached';
import globalAppConfig from '../../app/PhoenixQlConfig';
import { isEmptyObject } from '../object';
import Logger from '../logger';

const {
  CACHING_ENABLED,
  CACHING_MEMCACHE_HOST,
  CACHING_MEMCACHE_PORT,
  CACHING_THRESHOLD,
} = globalAppConfig.getProperties();

class Memcache {
  /**
   * class constructor to create instance of memcache.
   */
  constructor() {
    Logger.info({
      component: 'Memcache',
      cacheHost: CACHING_MEMCACHE_HOST,
      cachePort: CACHING_MEMCACHE_PORT,
    });
    // caching in not enabled, so no memcche connection
    if (CACHING_ENABLED === 'false') {
      Logger.info({ component: 'Memcache', info: 'Cache is not enabled' });
      return;
    }
    this.memcached = new Memcached(`${CACHING_MEMCACHE_HOST}:${CACHING_MEMCACHE_PORT}`,
      { timeout: 10, reconnect: 5, minTimeout: 3, maxTimeout: 7 });
    this.cachekeys = new Set();
    // some error handling on memcache connection
    this.memcached.on('issue', (details) => {
      Logger.error('Caching failed.', {
        component: 'Memcache',
        error: `Server ${details.server} went down due to ${details.message}`,
      });
    });
  }

  /**
   * get the value from cache, otherwise get from teh callback provided.
   * @param {string} key: cache key.
   * @param {int} hardCacheTTL: hard cache ttl, default to 300 seconds
   * @param {int} cacheTTL: cache ttl.
   * @param {function} callback: callback to be called if no data in cache.
   * @param {object} params: params to be passed to callback.
   */
  async getAndSet(key, hardCacheTTL = 300, cacheTTL, callback, params = {}, threshold) {
    const hardTTL = parseInt(hardCacheTTL);
    return new Promise(async (resolve, reject) => {
      if (CACHING_ENABLED === 'true') {
        // get the data from cache
        return this.memcached.get(key, async (error, data) => {
          try {
          // oops got some error
          if (error) {
            Logger.error('Error while getting data from cache.', {
              component: 'Memcache',
              error: error.message,
            });
            return reject(error);
          }
          // got data from cache
          if (!isEmptyObject(data)) {
            Logger.info({
              component: 'Memcache',
              info: 'Data returning from cache',
              cacheKey: key,
              TTL: cacheTTL,
            });
            // cache refresh
            const cacheThreshold = (!threshold) ? CACHING_THRESHOLD : threshold;
            if (this.eligibleForRefresh(data.expiry, cacheThreshold) && !this.cachekeys.has(key)) {
              this.cachekeys.add(key);
              const refreshCacheValue = this.getCacheValue(data, cacheTTL);
              // set the old value
              this.memcached.set(key, refreshCacheValue, hardTTL, (err) => {
                if (err) {
                  Logger.error('Error while saving data in cache.', {
                    component: 'Memcache',
                    error: err.message,
                  });
                  this.cachekeys.delete(key);
                  return reject(err);
                }
              });
              // get it from origin
              const response = await callback(params);
              // save the data in cache
              const newCacheValueObj = this.getCacheValue(response, cacheTTL);
              this.memcached.set(key, newCacheValueObj, hardTTL, (err) => {
                if (err) {
                  Logger.error('Error while saving data in cache.', {
                    component: 'Memcache',
                    error: err.message,
                  });
                  this.cachekeys.delete(key);
                  return reject(err);
                }
              });
              this.cachekeys.delete(key);
            }
            // return the cachde data
            return resolve(data.value);
          }
          Logger.info({
              component: 'Memcache',
              info: 'Returning non-cached data',
              cacheKey: key,
              TTL: cacheTTL,
          });
          // no data in cache, get it from origin
          const response = await callback(params);
          Logger.info({
            component: 'Memcache',
            cacheHost: 'Saving data in cache',
            cacheKey: key,
            TTL: cacheTTL,
          });
          // save the data in cache
          const cacheValueObj = this.getCacheValue(response, cacheTTL);
          this.memcached.set(key, cacheValueObj, hardTTL, (err) => {
            if (err) {
              Logger.error('Error while saving data in cache.', {
                component: 'Memcache',
                error: err.message,
              });
              return reject(err);
            }

            const args = params.args || {};
            /**
             * add metadata for the keys, key is nodeids or url,
             *  value is double pipe (||) separated cache keys
             * @example key: 104846992 value: http://qa-aws02capi-bl.cnbc.com/api/v1/id/104846992
             *                                 ||http://qa-aws01cmspcm.cnbc.com/page?assetType=cnbcnewsstory&brand=cnbc&mode=&nodeId=104846992&product=web&sectionId=19854910&sectionSubType=news_section
             */
            if (args) {
              let metaDatakeys = args.id || args.listId || args.url;

              if (metaDatakeys) {
                metaDatakeys = !Array.isArray(metaDatakeys) ? [metaDatakeys] : metaDatakeys;
                metaDatakeys.map((metaDatakey) => {
                  return this.memcached.get(metaDatakey, async (getError, cacheData) => {
                    // if we already have data for this key
                    if (!isEmptyObject(cacheData)) {
                      // don't add if we already have the value
                      if (!cacheData.includes(key)) {
                        this.memcached.append(metaDatakey, `||${key}`, (appendError) => {
                          if (appendError) {
                            Logger.error('Error while appending data in cache.', {
                              component: 'Memcache',
                              error: appendError.message,
                            });
                            return reject(appendError);
                          }
                          return resolve(true);
                        });
                      }
                    } else { // no data in cache. let's add it for the first time
                      // key is the cache value
                      const cacheValue = key;
                      this.memcached.set(metaDatakey, cacheValue, 0, (setError) => {
                        if (setError) {
                          Logger.error('Error while saving data in cache.', {
                            component: 'Memcache',
                            cacheKey: metaDatakey,
                            error: setError.message,
                          });
                          return reject(setError);
                        }
                        return resolve(true);
                      });
                    }
                  });
                });
              }
            }
            return resolve(true);
          });
          // return the non-cachde data
          return resolve(response);
        } catch (err) {
          Logger.error('Error in caching.', {
            component: 'Memcache',
            error: err.message,
          });
          return reject(err);
        }
      });
    }
    else {
      Logger.info({ component: 'Memcache', info: 'Cache is not enabled' });
      await callback(params)
        .then((data) => resolve(data))
        .catch((error) => {
          Logger.error('Caching failed.', {
            component: 'CAPI',
            error: error.message,
          });
          return reject(error);
        });
    }
  });
}

  /**
   * get the cache for provided key.
   * @param {string} key: key for which the cache needs to be flushed.
   */
  get(key) {
    return new Promise((resolve, reject) => {
      try {
        if (CACHING_ENABLED === 'false') {
          Logger.info({ component: 'Memcache', info: 'Cache is not enabled' });
          return reject(new Error('Cache is not enabled'));
        }
        return this.memcached.get(key, async (error, data) => {
          if (error) {
            Logger.error('Error while getting data from cache.', {
              component: 'Memcache',
              error: error.message,
            });
            return reject(error);
          }
          if (data && !isEmptyObject(data)) {
            Logger.info({
              component: 'Memcache',
              info: 'Data returning from cache',
              cacheKey: key,
            });

            return resolve(data);
          }
          return reject(new Error('Something went wrong in get method of Memcache class'));
        });
      } catch (error) {
        Logger.error('Error while getting data from cache.', {
          component: 'Memcache',
          cacheKey: key,
          error: error.message,
        });
        return reject(error);
      }
    });
  }

  /**
   * get the cache for provided key.
   * @param {string} key: key for which the cache needs to be flushed.
   * @param {mixed} value: value to be cached.
   */
  set(key, cacheTTL, value) {
    return new Promise((resolve, reject) => {
      try {
        if (CACHING_ENABLED === 'false') {
          Logger.info({ component: 'Memcache', info: 'Cache is not enabled' });
          return reject(new Error('Cache is not enabled'));
        }
        return this.memcached.set(key, value, cacheTTL, (error) => {
          if (error) {
            Logger.error('Error while saving data in cache.', {
              component: 'Memcache',
              error: error.message,
            });
            return reject(error);
          }
            return resolve(true);
        });
      } catch (error) {
        Logger.error('Error while getting data from cache.', {
          component: 'Memcache',
          cacheKey: key,
          error: error.message,
        });
        return reject(error);
      }
    });
  }

  /**
   * method to execute the appropriate flush method.
   * @param {object} params: params to pick the appropriate flush method.
   */
  flushCache(params) {
    if (!params || isEmptyObject(params)) return this.flushAll();
    if (params.ids) return this.flushByIds(params.ids);
    if (params.keys) return this.flushByKeys(params.keys);

    return false;
  }

   /**
   * flush all cache.
   */
  flushAll() {
    return new Promise((resolve, reject) => {
      try {
        return this.memcached.flush((error, status) => {
          if (error || !status) {
            Logger.error('Error flushing the cache.', {
              component: 'Memcache',
              error: error.message,
            });
            return reject(error);
          }
          return resolve('Cache purged successfully');
        });
      } catch (error) {
        Logger.error('Error flushing the cache.', {
          component: 'Memcache',
          error: error.message,
        });
        return reject(error);
      }
    });
  }

  /**
   * flush the cache for provided key.
   * @param {string} key: key for which the cache needs to be flushed.
   */
  flushByKey(key) {
    return new Promise((resolve, reject) => {
      try {
        return this.memcached.del(key, (error) => {
          if (error) {
            Logger.error('Error flushing the cache by key.', {
              component: 'Memcache',
              cacheKey: key,
              error: error.message,
            });
            return reject(error);
          }
          return resolve(key);
        });
      } catch (error) {
        Logger.error('Error flushing the cache by key.', {
          component: 'Memcache',
          cacheKey: key,
          error: error.message,
        });
        return reject(error);
      }
    });
  }

  /**
   * flush the cache for provided keys.
   * @param {string} keys: keys for which the cache need to be flushed.
   */
  flushByKeys(keys = '') {
    return new Promise((resolve, reject) => {
      try {
        const keysToBeDeleted = keys.split('||');
        return keysToBeDeleted.map((key) => {
          return this.memcached.del(key, (error) => {
            if (error) {
              Logger.error('Error flushing the cache by keys.', {
                component: 'Memcache',
                cacheKey: key,
                error: error.message,
              });
              return reject(error);
            }
            return resolve(keysToBeDeleted);
          });
        });
      } catch (error) {
        Logger.error('Error flushing the cache by keys.', {
          component: 'Memcache',
          cacheKey: keys,
          error: error.message,
        });
        return reject(error);
      }
    });
  }

  /**
   * flush the cache for provided asset ids. These ids have the cache keys as values.
   * @param {string} ids: asset ids for which the cache needs to be flushed.
   */
  flushByIds(ids = '') {
    return new Promise((resolve, reject) => {
      try {
        return ids.split('||').map((key) => {
          return this.memcached.get(key, async (error, data) => {
            if (error) {
              Logger.error('Error getting cache data.', {
                component: 'Memcache',
                cacheKey: key,
                error: error.message,
              });
              return reject(error);
            }

            if (data && !isEmptyObject(data)) {
              const keysToBeDeleted = data.split('||');
              keysToBeDeleted.map((deleteKey) => {
                return this.memcached.del(deleteKey, (deleteError) => {
                  if (deleteError) {
                    Logger.error('Error flushing the cache by key.', {
                      component: 'Memcache',
                      cacheKey: deleteKey,
                      error: deleteError.message,
                    });
                    return reject(deleteError);
                  }
                });
              });
              return resolve(keysToBeDeleted);
            }
            return resolve('No key(s) found to be purged');
          });
        });
      } catch (error) {
          Logger.error('Error flushing the cache by key.', {
            component: 'Memcache',
            cacheKey: ids,
            error: error.message,
          });
        return reject(error);
      }
    });
  }

  /**
   * returns the number of keys in cache.
   */
  cacheKeysCount() {
    return new Promise((resolve, reject) => {
      try {
        return this.memcached.stats((error, status) => {
          if (error || !status) {
            Logger.error('Error getting cache stats.', {
              component: 'Memcache',
              error: error.message,
            });
            return reject(error);
          }
          return resolve(status[0].curr_items);
        });
      } catch (error) {
          Logger.error('Error getting cache stats.', {
            component: 'Memcache',
            error: error.message,
          });
        return reject(error);
      }
    });
  }

  /**
   * if the value is null or the difference in expiry and currnet time is less than
   * or equal to the threshold, return true
   */
   eligibleForRefresh(expiry, refreshThreshold, forceRefresh = false) {
    if (forceRefresh) {
        return true;
    }

    const currentTime = Math.round(Date.now() / 1000);
    return (!expiry) || (expiry - currentTime <= parseInt(refreshThreshold));
  }

  getCacheValue(data, cacheTTL) {
    const currentTime = Math.round(Date.now() / 1000);
    const expiry = (currentTime + parseInt(cacheTTL));
    return { value: data, expiry };
  }
}

export default Memcache;
