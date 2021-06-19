import { GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import ModuleUnionType from '../unions/module';

import { selectionSetToFragmentTypes } from '../../../lib/astToFragmentTypes';

import moduleToRequest from '../../../config/moduleToRequest.json';

import Logger from '../../../lib/logger';
import RequestError from '../../../lib/error/RequestError';

function fetchData(stores, storeType, id, options, mode) {
  switch (storeType) {
    case 'Article': {
      return stores.article.find({ id }, options);
    }
    case 'ArticleTicker': {
      return stores.articleTicker.find({ id }, options);
    }
    case 'AssetList': {
      return stores.assetList.find({ id }, { ...options, mode });
    }
    case 'BuffettTimeline': {
      return stores.buffettTimeline.find();
    }
    case 'BuffettQuote': {
      return stores.buffettQuote.findRandom(options);
    }
    case 'CAPI': {
      const { page, pageSize, offset } = options;
      const qs = { page, pageSize, offset, mode };
      return stores.capi.find({ id }, { qs });
    }
    case 'MarketBanner': {
      return stores.marketBanner.find({ id }, options);
    }
    case 'MostPopular': {
      return stores.mostPopular.find({
        id,
        source: 'PARSELY',
      }, options);
    }
    case 'Video': {
      return stores.video.find({ id }, options);
    }
    default: {
      return {};
    }
  }
}

export default () => ({
  name: {
    type: GraphQLString,
  },
  source: {
    type: GraphQLString,
  },
  canChangeLayout: {
    type: GraphQLBoolean,
  },
  canChangeSource: {
    type: GraphQLBoolean,
  },
  serverRenderPolicy: {
    type: GraphQLString,
  },
  attributes: {
    type: GraphQLJSON,
    resolve: ({ attributes }) => attributes || {},
  },
  options: {
    type: GraphQLJSON,
  },
  data: {
    type: ModuleUnionType,
    args: {
      mode: {
        type: GraphQLString,
      },
    },
    resolve: async ({ name, source, options }, args, { stores }, info) => {
      const { storeType } = moduleToRequest[name] || {};
      const { mode } = args;

      const { selectionSet = {} } = info.fieldNodes[0];
      const moduleTypes = selectionSetToFragmentTypes({ selectionSet });

      if (!storeType || !moduleTypes.includes(name)) return {};

      try {
        const resp = await fetchData(stores, storeType, source, options, mode);

        if (!resp) throw new Error(`No data returned for ${name} module`);

        return { ...resp, name };
      } catch (error) {
        Logger.error(error);

        throw new RequestError({
          message: error.message,
          statusCode: 500,
        });
      }
    },
  },
});
