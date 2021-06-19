import Logger from '../../lib/logger';
import { generateURL } from '../mostPopular';

/**
 * Async function that returns list of recommendations for Parse.ly
 * @param {Object} args { url, limit, tags }
 * @param {Object} networkClient
 * @param {Object} config For testing injection
 */
export default async function getRecommendationIds(
  args,
  networkClient,
) {
  const { url, count, tag } = args;
  if (!url) {
    Logger.error('Must provide a valid URL to the Parse.ly Recommendation API');
    return [];
  }
  if (!count || count < 1) {
    Logger.error('Count must be 1 or greater to Parse.ly Recommendation API');
    return [];
  }
  if (!tag) {
    Logger.error('Specify tag (e.g. Video) for Parse.ly Recommendation API');
    return [];
  }

  const argsWithSource = Object.assign(
    {
      source: 'PARSELY_RELATED',
    },
    args,
  );

  const parsleyRequestURL = generateURL(argsWithSource);
  try {
    const response = await networkClient.load({ url: parsleyRequestURL });

    if (response && response.data && response.data.length > 0) {
      const ids = response.data
        // Extract ID
        .map((item) => {
          const md = JSON.parse(item.metadata);
          return md.nodeid;
        })
        // Filter undefined
        .filter((id) => id);
      return ids;
    }

    Logger.error('Failed to fetch from Parse.ly Recommendation API.', parsleyRequestURL, { args });
    return [];
  } catch (error) {
    Logger.error('Failed to fetch from content API.', {
      args,
      error: error.message,
    });
    return [];
  }
}

