import { stringify } from 'query-string';
import request from 'request-promise';
import DataLoader from 'dataloader';

import { isEmptyObject } from './object';
import Logger from './logger';

export default class NetworkRequest {
  constructor() {
    this.loader = this.createNetworkLoader();
  }

  createNetworkLoader = () => (
    new DataLoader(
      keys => Promise.all(keys.map(key => this.makeRequest({ url: key }))), { batch: false },
    )
  )

  load = ({ url, qs }) => {
    const requestUrl = this.generateUrl(url, qs);
    return this.loader.load(requestUrl).catch(error => {
      Logger.error('Failed network request', {
        component: 'lib/networkRequest',
        requestUrl,
        error: error.message,
      });
      throw error;
    });
  }

  generateUrl = (url, qs) => (isEmptyObject(qs) ? url : `${url}?${stringify(qs)}`);
  makeRequest = ({ url, qs }) => request({ url, qs, timeout: 30000, json: true })
}
