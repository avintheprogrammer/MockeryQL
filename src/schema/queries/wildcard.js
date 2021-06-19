import { GraphQLNonNull, GraphQLInt } from 'graphql';
import Wildcard from '../types/assets/wildcard';

export default {
  type: Wildcard,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
