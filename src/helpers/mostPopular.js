/* eslint-disable import/prefer-default-export */
import queryString from 'query-string';
import globalAppConfig from '../app/PhoenixQlConfig';
import sourceMapping from '../config/mostPopular.json';
import Logger from '../lib/logger';

/**
 * Generates an object representing params to pass to API
 * @param {object} args
 */
export function getParamObject(args = {}) {
  const { source, section, tag, ...remainingArgs } = args;
  const { queryStringMapping, fixedParams } = sourceMapping[source];

  // Apply fixed paramters
  const params = Object.assign({}, fixedParams);

  // If a mapping exists add it to params
  Object.entries(queryStringMapping).forEach(([argsKey, apiParamKey]) => {
    const value = remainingArgs[argsKey];
    if (value) {
      params[apiParamKey] = value;
    }
  });

  // Add tag only if section is not defined
  if (!section && tag) {
    params[queryStringMapping.tag] = tag;
  }

  return params;
}

function getConfigQueryParams(source) {
  const { configKeyValues } = sourceMapping[source];
  if (!configKeyValues) {
    return '';
  }
  const configQuery = configKeyValues.map((key) => {
    const val = globalAppConfig.get(key);
    if (!val) {
      Logger.error({
        msg: `${key} of mostPopular source is missing`,
      });
    }
    return val;
  }).filter((val) => val).join('&');

  return `&${configQuery}`;
}

/**
 * Generates final Most Popular Source URL
 * @param {object} args
 */
export function generateURL(args = {}) {
  // Attach API key and secret
  const { baseUrl } = sourceMapping[args.source];

  const queryParameters = queryString.stringify(getParamObject(args));
  const configQueryParams = getConfigQueryParams(args.source);
  const url = `${baseUrl}?${queryParameters}${configQueryParams}`;
  return url;
}
