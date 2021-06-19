/* eslint-disable import/prefer-default-export */
import NetworkRequest from '../lib/networkRequest';

import { url } from '../config/buffettQuote.json';
import Serialize from '../serializers/buffettQuote';

async function findRandom({ networkClient }) {
  const resp = await networkClient.load({ url }) || {};
  const quotes = Serialize(resp);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return randomQuote;
}

export function createStore() {
  const networkClient = new NetworkRequest();
  return {
    findRandom: () => findRandom({ networkClient }),
  };
}
