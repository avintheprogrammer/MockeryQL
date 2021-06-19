import parsely from './parsely';

/**
 * This is an abstraction layer for recs. Currently supports Parse.ly, to
 * support more in the future.
 * @param {Object} options
 * @param {Object} networkClient
 */
export default function getRecommendationIds(options, networkClient) {
  const defaultOptions = {
    count: 1,
  };
  const opts = Object.assign(defaultOptions, options);

  return parsely(opts, networkClient);
}
