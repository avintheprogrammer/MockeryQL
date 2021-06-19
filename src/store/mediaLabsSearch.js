/* eslint-disable import/prefer-default-export */
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';

// const { CAPI_HOST } = global.appConfig.getProperties();
// Normally, this host constant would be an environment variable, but this is a temp service
const API_HOST = 'http://23.21.66.213:9080/appi/getesbam.jsp?t=';
const CLIP_NAME = 'http://23.21.66.213/assets/buffet/2012-BAM-1.mp4';

/**
 * Example of query that hits this code:
 * @example
 * query MediaLabsSearch($term: String = "Amazon") {
 *   mediaLabsSearch(term: $term) {
 *     hits
 *   }
 * }
 */


/**
 * Generates final MediaLabs Search API request URL
 * @todo: replace this with the real CAPI call
 * @param {string} args.term
 * @returns {string}
 */
function generateURL({ term }) {
  if (term) return `${API_HOST}${term}`;

  throw new Error('Must provide a valid MediaLabs search parameter');
}

/**
 * Filters the response from the MediaLabs API to only results in the
 *  same hard-coded clip that is loaded
 * @param {string} args.term
 * @returns {string}
 */
function pruneResults(initialResults) {
  const prunedResults = initialResults.hits.hits;
  const newResult = {
    hits: [],
  };
  Object.entries(prunedResults).forEach((currentResult) => {
    const [, value] = currentResult;

    if ((value.source.file) && (CLIP_NAME.indexOf(value.source.file) !== -1)) {
      newResult.hits.push(value.source);
    }
  }, Array.isArray(initialResults) ? [] : {});

  return newResult;
}

/**
 * Provides single inteface to Media Labs Search API
 * @param {object} args
 * @param {object} options.qs
 * @returns {object}
 */
async function find(args, options = {}, { networkClient }) {
  const url = generateURL(args);
  try {
    return pruneResults(await networkClient.load({ url, ...options }));
  } catch (error) {
    Logger.error('Failed to fetch from content API.', {
      args,
      error: error.message,
    });
    return {};
  }
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    find: (args, options) => find(args, options, { networkClient }),
  };
}
