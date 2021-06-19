import Logger from '../logger';

class FileCache {
  /**
   * class constructor to create instance of file cache.
   */
  constructor(directory) {
    Logger.info({
      component: 'FileCache',
      cacheDirectory: directory,
    });
  }
}

export default FileCache;
