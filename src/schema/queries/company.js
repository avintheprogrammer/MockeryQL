import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Security from '../types/assets/security';

export default {
  type: Security,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(_, args, { stores }) {
    return stores.capi.find(args);
  },
};
