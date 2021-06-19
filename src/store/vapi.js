/* eslint-disable import/prefer-default-export */

import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';
import Logger from '../lib/logger';

const { REGISTER_API, VAPI_URL } = globalAppConfig.getProperties();

function generateTokenURL(args = {}) {
  const urlParams = [];
  try {
    urlParams.push(`token=${args.sessionToken}`);
    urlParams.push(`uid=${args.uid}`);
  } catch (e) {
    // keep going even if error
  }

  urlParams.push('tokenfor=LIVESTREAM');

  let url = `${REGISTER_API}/14/payload`;

  if (urlParams.length > 0) {
    const queryParams = urlParams.join('&');
    url = `${url}?${queryParams}`;
  }
  return url;
}

function generateVAPIURL(streamName, token = '') {
  const stream = `streamname=${streamName}`;
  const output = 'output=json';
  const pid = 'partnerId=14';
  const authkey = `authkey=${token}`;

  return `${VAPI_URL}?${stream}&${output}&${pid}&${authkey}`;
}

function toLivestreamConfig(livestream = {}) {
  return {
    timeZone: livestream.Timezone,
    endTime: livestream.Endtime,
    inCache: livestream.InCache,
    altURL: livestream.AltUrl,
    restricted: livestream.Restricted,
    startTime: livestream.Starttime,
    ignoreWeekend: livestream.IgnoreWeekend,
    protectedURL: livestream.protectedURL,
    remaining: livestream.Remaining,
    url: livestream.URL,
    name: livestream.Name,
    tokenGenerator: livestream.tokenGenerator,
  };
}

async function getPlaybackURL(args = {}, { networkClient }) {
  try {
    const tokenUrl = generateTokenURL(args);
    const tokenResponse = await networkClient.load({ url: tokenUrl }) || {};
    const videoToken = tokenResponse.payload_token;

    // return null to query if videoToken is empty string
    if (!videoToken) return null;

    const vapiURL = generateVAPIURL(args.streamName, videoToken);
    const resp = await networkClient.load({ url: vapiURL }) || {};

    // return { playbackURL: resp['cnbc-global-video-response'].data['stream-assets'][0] };
    return toLivestreamConfig(resp['cnbc-global-video-response'].data['stream-assets'][0]);
  } catch (error) {
    Logger.error('Failed to fetch livestream.', {
      args: { args },
      error: error.message,
    });
    return {};
  }
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    getPlaybackURL: args => getPlaybackURL(args, { networkClient }),
  };
}
