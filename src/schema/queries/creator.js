import { GraphQLInt, GraphQLString } from 'graphql';
import Creator from '../types/assets/creator';

export default {
  type: Creator,
  args: {
    id: {
      type: GraphQLInt,
    },
    url: {
      type: GraphQLString,
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
