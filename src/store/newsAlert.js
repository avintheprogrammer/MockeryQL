/* eslint-disable import/prefer-default-export, consistent-return */
import globalAppConfig from '../app/PhoenixQlConfig';
import Logger from '../lib/logger';
import { BrandValues } from '../schema/types/assets/brand';

const { BREAKING_NEWS_LIST_ID, DEAL_OR_NO_DEAL_WATCH_LIVE_LIST_ID, WATCH_LIVE_LIST_ID } =
  globalAppConfig.getProperties();

async function fetchWebAlert({ listId, page = 0, pageSize = 20 }, { capi }) {
  const qs = { page, pageSize, promoted: true };
  const { listItem: listItems = [] } = await capi.find({ listId }, { qs });
  if (listItems.length) return listItems[0];
}

async function find({ brand, product }, { capi }) {
  try {
    if (product !== 'web') {
      return null;
    }

    if (brand === BrandValues.dealornodeal.value)
    {
      const watchLive = await fetchWebAlert(
        { listId: DEAL_OR_NO_DEAL_WATCH_LIVE_LIST_ID }, { capi });
      return { watchLive };
    }

    const [breakingNews, watchLive] = await Promise.all([
      fetchWebAlert({ listId: BREAKING_NEWS_LIST_ID }, { capi }),
      fetchWebAlert({ listId: WATCH_LIVE_LIST_ID }, { capi }),
    ]);
    return { breakingNews, watchLive };
  } catch (error) {
    Logger.error('Failed to fetch newAlerts from content API.', {
      product,
      error: error.message,
    });
    return null;
  }
}

export function createStore({ capi }) {
  return {
    find: args => find(args, { capi }),
  };
}
