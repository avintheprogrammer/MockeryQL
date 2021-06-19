import { GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import AssetInterfaceType from '../interfaces/asset';

import SharedFields from './shared';

import { resolveRelated } from './../../../helpers/asset';

export default () => ({
  ...SharedFields(),
  name: {
    type: GraphQLString,
  },
  related: {
    type: new GraphQLList(AssetInterfaceType),
    resolve: ({ association: associations = [] }) => resolveRelated({ associations }),
  },
  assets: {
    type: new GraphQLList(AssetInterfaceType),
    args: {
      count: {
        type: GraphQLInt,
      },
      mode: {
        type: GraphQLString,
      },
      promoted: {
        type: GraphQLBoolean,
      },
    },
    resolve: async ({ id, appliedQS }, { count, mode, promoted }, { stores }) => {
      const options = { pageSize: count, mode, promoted, ...appliedQS };
      const { assets } = await stores.assetList.find({ id }, options) || {};
      return assets;
    },
  },
});
