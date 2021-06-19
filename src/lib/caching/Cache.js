import Memcache from './Memcache';
import RedisCache from './RedisCache';
import FileCache from './FileCache';
import CacheSources from './cacheSources';

const instances = {};

/**
 * base cache class to create singleton instance of provided class
 */
class Cache {
  /**
   * get the cache instance.
   * @param {string} cacheName: cache source.
   */
  static getInstance(cacheName = null) {
    let instance = null;
    let cache = cacheName;
    if (!cache) {
      cache = CacheSources.memcache;
    }
    if (!instances || !instances[cache]) {
      switch (cache) {
        case CacheSources.redisCache:
          instance = new RedisCache();
          break;
        case CacheSources.fileCache:
          instance = new FileCache();
          break;
        case CacheSources.memcache:
        default:
          instance = new Memcache();
      }
      instances[cache] = instance;
    }
    return instances[cache];
  }
}

export default Cache;
