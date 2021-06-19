import { GraphQLString, GraphQLInt } from 'graphql';
import { AssetType } from '../types/assets/asset';

export default {
  type: AssetType,
  args: {
    id: { type: GraphQLInt },
    url: { type: GraphQLString },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
