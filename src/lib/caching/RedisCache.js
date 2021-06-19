import Logger from '../logger';

class RedisCache {
  /**
   * class constructor to create instance of redis cache.
   */
  constructor(directory) {
    Logger.info({
      component: 'RedisCache',
      cacheHost: 'REDISCACHE_HOST',
      cachePort: 'REDISCACHE_PORT',
      cacheDirectory: directory,
    });
  }
}

export default RedisCache;
