import { GraphQLInt, GraphQLString } from 'graphql';
import Event from '../types/assets/event';

export default {
  type: Event,
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
