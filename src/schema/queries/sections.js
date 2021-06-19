import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import Franchise from '../types/assets/franchise';

import FailedLookupError from '../../lib/error/FailedLookupError';

const ID_LOOKUP_LIMIT = 10;

export default {
  type: new GraphQLList(Franchise),
  args: {
    ids: {
      type: new GraphQLList(GraphQLInt),
    },
    urls: {
      type: new GraphQLList(GraphQLString),
    },
  },
  resolve: async (_, { ids, urls }, context) => {
    // some error handling
    if (!ids && !urls) throw new Error('Either pass ids or urls');
    if (ids && urls && ids.length && urls.length) throw new Error('Either pass ids or urls, but not both');
    if (ids && ids.length > ID_LOOKUP_LIMIT) {
      throw new Error(`You may not request more than ${ID_LOOKUP_LIMIT} IDs at a time`);
    }

    try {
      let data, sortedIds, sortedUrls = []; // eslint-disable-line
      if (ids && ids.length) {
        sortedIds = ids.sort((a, b) => a - b);
        data = await context.stores.capi.find({ id: sortedIds });
      } else {
        sortedUrls = urls.sort();
        data = await context.stores.capi.find({ url: sortedUrls });
      }

      const response = Array.isArray(data) ? data : [data];

      // needed this for properly displaying the error messages for the non data ids
      const failedData = (ids && ids.length)
        ? sortedIds.filter(id => !response.find(row => Number(row.id) === id))
        : sortedUrls.filter(url => !response.find(row => row.liveURL === url));

      if (failedData.length) {
        const error = new FailedLookupError({ failedData });
        context.errors = [error]; // eslint-disable-line
      }

      return response;
    } catch (e) {
      throw new FailedLookupError({ failedData: ids || urls });
    }
  },
};
