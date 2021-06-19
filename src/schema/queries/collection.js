import { GraphQLNonNull, GraphQLInt } from 'graphql';

import Collection from '../types/assets/collection';

export default {
  type: Collection,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    page: {
      type: GraphQLInt,
    },
    pageSize: {
      type: GraphQLInt,
    },
  },
  resolve(_, { id, page, pageSize }, { stores }) {
    const qs = { page, pageSize };
    return stores.capi.find({ id }, { qs });
  },
};
