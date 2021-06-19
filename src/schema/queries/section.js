import { GraphQLInt, GraphQLString } from 'graphql';
import Franchise from '../types/assets/franchise';

export default {
  type: Franchise,
  args: {
    id: {
      type: GraphQLInt,
    },
    page: {
      type: GraphQLInt,
    },
    pageSize: {
      type: GraphQLInt,
    },
    mode: {
      type: GraphQLString,
    },
  },
  resolve: (_, { id, page, pageSize, mode }, { stores }) => {
    const qs = { page, pageSize, mode };
    return stores.capi.find({ id }, { qs });
  },
};
