/* eslint-disable no-param-reassign */
import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import AssetList from '../types/assets/assetList';
import ApiSources from '../types/assets/apiSource';

export default {
  type: AssetList,
  args: {
    source: {
      type: new GraphQLNonNull(ApiSources),
    },
    id: {
      type: GraphQLInt,
    },
    tag: {
      type: new GraphQLNonNull(GraphQLString),
    },
    section: {
      type: GraphQLString,
    },
    sortBy: {
      type: GraphQLString,
    },
    startPeriod: {
      type: GraphQLString,
    },
    endPeriod: {
      type: GraphQLString,
    },
    count: {
      type: GraphQLInt,
    },
    author: {
      type: GraphQLString,
    },
  },
  resolve: (_, args, { stores }) => stores.mostPopular.find(args),
};
