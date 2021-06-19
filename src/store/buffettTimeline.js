/* eslint-disable import/prefer-default-export */
import globalAppConfig from '../app/PhoenixQlConfig';
import NetworkRequest from '../lib/networkRequest';

import Serialize from '../serializers/buffettTimeline';

const { BUFFETT_TIMELINE } = globalAppConfig.getProperties();

async function find({ networkClient }) {
  const url = `${BUFFETT_TIMELINE}`;
  const resp = await networkClient.load({ url }) || {};
  const slides = Serialize(resp);
  return { slides };
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    find: () => find({ networkClient }),
  };
}
