/* eslint-disable import/prefer-default-export */

import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';

const { PRO_AUTH_API } = globalAppConfig.getProperties();

/**
 * Generates Skyrock API request URL
 * @param {string} authCode
 * @returns {string}
 */
const generateURL = (uid, sessionToken) => `${PRO_AUTH_API}${uid}/validateProUser?token=${sessionToken}`;

/**
 * Determines whether a user is 'Pro' user or not
 * @param {string} authCode
 * @returns {boolean}
 */
export async function resolveProAuthentication({
  uid = 'Not Logged In',
  sessionToken = 'Not Logged In',
}, { networkClient }) {
  try {
    if (uid === 'Not Logged In') return false;
    const url = generateURL(uid, sessionToken);
    const { isValidProUser = false } = await networkClient.load({ url }) || {};
    return isValidProUser;
  } catch (error) {
    Logger.error({
      msg: 'Failed to fetch auth data service',
      args: { uid, sessionToken },
      err: error.message,
    });
    return false;
  }
}

/**
 * Fetches article from CAPI
 * @param {number} args.id
 * @returns {object}
 */
function find({ id, url }, { capi }) {
  return capi.find({ id, url });
}

export function createStore({ capi }) {
  const networkClient = new NetworkRequest();
  return {
    find: args => find(args, { capi }),
    resolveProAuthentication: args => resolveProAuthentication(args, { networkClient }),
  };
}
